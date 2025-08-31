import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongo";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import { validateSubscribeRequest, createErrorResponse } from "@/lib/validation";
import { config, getRateLimit } from "@/lib/config";
import { createRequestContext, logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const context = createRequestContext(req);
  const startTime = Date.now();

  try {
    context.log.info("Processing subscription request");

    // Rate limiting - block if too many requests from same IP
    const clientIP = getClientIP(req);
    const rateLimitConfig = getRateLimit('subscribe');
    const rateLimitResult = rateLimit(clientIP, rateLimitConfig.requests, rateLimitConfig.windowMs);
    
    if (!rateLimitResult.success) {
      logger.rateLimitHit(clientIP, "/api/subscribe", { requestId: context.requestId });
      const response = NextResponse.json(
        { error: "too_many_requests", resetTime: rateLimitResult.resetTime },
        { status: 429 }
      );
      context.finish(429);
      return response;
    }

    // Parse and validate request body
    const rawData = await req.json().catch(() => null);
    const validation = validateSubscribeRequest(rawData);
    
    if (!validation.valid) {
      context.log.warn("Validation failed", { error: validation.error });
      const response = createErrorResponse(validation.error!, 400);
      context.finish(400);
      return response;
    }

    const { email, profile, utm, source, context: clientContext } = validation.data!;
    context.log.info("Processing subscription", { email, source });

    // Derive server-side context from headers/cookies
    const reqUrl = new URL(req.url);
    const hdrs = req.headers;
    // Next 15+ makes cookies() async; await to get the store
    const cookieStore = await cookies();
    function parseJSONSafe<T>(s: string | undefined | null): T | null { try { return s ? JSON.parse(s) as T : null; } catch { return null; } }
    function parseHost(h: string | null): string | null { if (!h) return null; try { return new URL(h).host; } catch { return h; } }
    
    // Basic server context
    const serverContext = {
      ip: getClientIP(req),
      forwardedFor: hdrs.get('x-forwarded-for') || null,
      userAgent: hdrs.get('user-agent') || null,
      referer: hdrs.get('referer') || null,
      acceptLanguage: hdrs.get('accept-language') || null,
      host: hdrs.get('host') || null,
      country: hdrs.get('cf-ipcountry') || hdrs.get('x-vercel-ip-country') || null,
      requestPath: reqUrl.pathname,
      requestTime: new Date().toISOString(),
      firstTouchCookies: {
        firstVisit: cookieStore.get('munch_first_visit')?.value || null,
        firstUrl: cookieStore.get('munch_first_url')?.value || null,
        referrer: cookieStore.get('munch_referrer')?.value || null,
        firstUtm: cookieStore.get('munch_first_utm')?.value || null,
        lastUtm: cookieStore.get('munch_last_utm')?.value || null,
      },
      geo: {
        city: hdrs.get('x-vercel-ip-city') || null,
        region: hdrs.get('x-vercel-ip-country-region') || null,
        country: hdrs.get('x-vercel-ip-country') || hdrs.get('cf-ipcountry') || null,
        continent: hdrs.get('x-vercel-ip-continent') || null,
        latitude: hdrs.get('x-vercel-ip-latitude') || null,
        longitude: hdrs.get('x-vercel-ip-longitude') || null,
        timezone: hdrs.get('x-vercel-ip-timezone') || null,
      },
      asn: {
        number: hdrs.get('x-vercel-ip-asn') || null,
        name: hdrs.get('x-vercel-ip-as-name') || null,
      }
    };

    // Attribution classification
    const refHost = parseHost(serverContext.referer);
    const lastUtmJson = parseJSONSafe<Record<string, string>>(serverContext.firstTouchCookies.lastUtm || null);
    const firstUtmJson = parseJSONSafe<Record<string, string>>(serverContext.firstTouchCookies.firstUtm || null);
    const utmObj = lastUtmJson || firstUtmJson || null;
    function classifyReferral(): string {
      const medium = utmObj?.utm_medium?.toLowerCase();
      const hasPaidIds = Boolean(utmObj?.gclid || utmObj?.fbclid || utmObj?.msclkid);
      if (hasPaidIds) return 'paid_ad';
      if (medium && ['cpc','ppc','paid','display','paid_social','social_paid','ads'].includes(medium)) return 'paid_ad';
      if (!serverContext.referer) return 'direct';
      const h = (refHost || '').toLowerCase();
      if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(h)) return 'organic_search';
      if (/facebook\.|instagram\.|t\.co$|twitter\.|x\.com|linkedin\.|reddit\./.test(h)) return 'social';
      if (/mail\.|mail\.google\.com|outlook\.|yahoo\.mail|proton\.me|icloud\.com/.test(h)) return 'email';
      return 'referral';
    }
    const attribution = {
      referralType: classifyReferral(),
      utm: utmObj,
      refererHost: refHost,
    };

    const client = await clientPromise;
    const db = client.db(config.database.name);
    const col = db.collection("subscribers");

    // Ensure index exists (safe to call multiple times)
    await col.createIndex({ email: 1 }, { unique: true });

    // Start transaction for atomic subscription
    const session = client.startSession();
    const dbStartTime = Date.now();
    
    try {
      await session.withTransaction(async () => {
        const now = new Date();
        
        // Use upsert with transaction for atomic operation
        await col.updateOne(
          { email },
          {
            $setOnInsert: { email, createdAt: now },
            $set: {
              status: "pending-verification",
              profile: profile || null,
              utm: utm || null,
              source: source || "landing",
              context: {
                client: (clientContext as any)?.client || null,
                server: serverContext,
                attribution,
              },
              updatedAt: now,
            },
          },
          { upsert: true, session }
        );
      });

      const dbDuration = Date.now() - dbStartTime;
      logger.dbOperation("upsert", "subscribers", dbDuration, { requestId: context.requestId });
      context.log.info("Subscription processed successfully", { email });

    } catch (error: any) {
      const dbDuration = Date.now() - dbStartTime;
      logger.dbOperation("upsert_failed", "subscribers", dbDuration, { requestId: context.requestId });
      context.log.error("Subscription transaction failed", { email, error: error.message });
      
      // Check if it's a duplicate key error (user already exists)
      if (error.code === 11000) {
        context.log.info("Duplicate subscription attempt", { email });
        const response = NextResponse.json({ 
          ok: true,
          message: "Email already subscribed" 
        });
        context.finish(200);
        return response;
      }
      
      const response = NextResponse.json(
        { error: "subscription_failed", message: "Unable to process subscription" },
        { status: 500 }
      );
      context.finish(500);
      return response;
    } finally {
      await session.endSession();
    }

    const response = NextResponse.json({ ok: true });
    context.finish(200);
    return response;

  } catch (error: any) {
    context.log.error("Unexpected error in subscription endpoint", { error: error.message, stack: error.stack });
    const response = NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
    context.finish(500);
    return response;
  }
}
