import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { verifyFree } from "@/lib/freeEmailVerification";

export const dynamic = "force-dynamic"; // ensure node runtime

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string") return NextResponse.json({ error: "missing email" }, { status: 400 });

  const em = email.toLowerCase();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "munch");
  const col = db.collection("subscribers");

  const sub = await col.findOne({ email: em });
  if (!sub) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const vr = await verifyFree(em);
  const status = vr.deliverable ? "active" : "invalid";
  await col.updateOne({ email: em }, { $set: { status, verifier: vr, updatedAt: new Date() } });

  return NextResponse.json({ ok: true, status, vr });
}