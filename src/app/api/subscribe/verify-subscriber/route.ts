import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { verifyFree } from "@/lib/freeEmailVerification";
import { rateLimit, getClientIP } from "@/lib/rateLimit";
import { validateVerifyRequest, createErrorResponse } from "@/lib/validation";
import { config, getRateLimit } from "@/lib/config";
import { createRequestContext, logger } from "@/lib/logger";

export const dynamic = "force-dynamic"; // ensure node runtime

export async function POST(req: Request) {
  const context = createRequestContext(req);
  
  try {
    context.log.info("Processing email verification request");

    // Rate limiting - prevent abuse of email verification
    const clientIP = getClientIP(req);
    const rateLimitConfig = getRateLimit('verifyEmail');
    const rateLimitResult = rateLimit(clientIP, rateLimitConfig.requests, rateLimitConfig.windowMs);
    
    if (!rateLimitResult.success) {
      logger.rateLimitHit(clientIP, "/api/subscribe/verify-subscriber", { requestId: context.requestId });
      const response = NextResponse.json(
        { error: "too_many_requests", resetTime: rateLimitResult.resetTime },
        { status: 429 }
      );
      context.finish(429);
      return response;
    }

    // Parse and validate request body
    const rawData = await req.json().catch(() => null);
    const validation = validateVerifyRequest(rawData);
    
    if (!validation.valid) {
      context.log.warn("Validation failed", { error: validation.error });
      const response = createErrorResponse(validation.error!, 400);
      context.finish(400);
      return response;
    }

    const { email } = validation.data!;
    context.log.info("Processing verification", { email });

    const client = await clientPromise;
    const db = client.db(config.database.name);
    const col = db.collection("subscribers");

    // Start a transaction for atomic operations
    const session = client.startSession();
    const dbStartTime = Date.now();
    
    try {
      let verificationResult: any;
      
      await session.withTransaction(async () => {
        const sub = await col.findOne({ email }, { session });
        if (!sub) {
          throw new Error("SUBSCRIBER_NOT_FOUND");
        }

        const verifyStartTime = Date.now();
        const vr = await verifyFree(email);
        const verifyDuration = Date.now() - verifyStartTime;
        
        logger.emailVerification(email, vr.result, verifyDuration, { requestId: context.requestId });
        
        const status = vr.deliverable ? "active" : "invalid";
        
        // Update subscriber status atomically
        await col.updateOne(
          { email }, 
          { $set: { status, verifier: vr, updatedAt: new Date() } },
          { session }
        );
        
        verificationResult = { ok: true, status, vr };
      });

      const dbDuration = Date.now() - dbStartTime;
      logger.dbOperation("verify_update", "subscribers", dbDuration, { requestId: context.requestId });
      
      context.log.info("Email verification completed successfully", { 
        email, 
        status: verificationResult.status 
      });

      // Get updated subscriber data
      const updatedSub = await col.findOne({ email });
      const response = NextResponse.json({ 
        ok: true, 
        status: updatedSub?.status, 
        vr: updatedSub?.verifier 
      });
      context.finish(200);
      return response;

    } catch (error: any) {
      const dbDuration = Date.now() - dbStartTime;
      logger.dbOperation("verify_failed", "subscribers", dbDuration, { requestId: context.requestId });

      if (error.message === "SUBSCRIBER_NOT_FOUND") {
        context.log.warn("Subscriber not found for verification", { email });
        const response = NextResponse.json({ error: "not_found" }, { status: 404 });
        context.finish(404);
        return response;
      }
      
      context.log.error("Email verification transaction failed", { 
        email, 
        error: error.message 
      });
      
      const response = NextResponse.json(
        { error: "verification_failed", message: "Unable to verify email at this time" },
        { status: 500 }
      );
      context.finish(500);
      return response;
    } finally {
      await session.endSession();
    }

  } catch (error: any) {
    context.log.error("Unexpected error in verification endpoint", { 
      error: error.message, 
      stack: error.stack 
    });
    
    const response = NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
    context.finish(500);
    return response;
  }
}