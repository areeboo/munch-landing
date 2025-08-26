import { NextResponse } from "next/server";
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

    const { email, profile, utm, source } = validation.data!;
    context.log.info("Processing subscription", { email, source });

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