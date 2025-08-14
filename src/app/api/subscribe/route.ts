import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, profile, utm, source } = await req.json().catch(() => ({}));
  const ok = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const em = email.toLowerCase();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "munch");
  const col = db.collection("subscribers");

  await col.createIndex({ email: 1 }, { unique: true });

  const now = new Date();
  await col.updateOne(
    { email: em },
    {
      $setOnInsert: { email: em, createdAt: now },
      $set: {
        status: "pending-verification",
        profile: profile ?? null,
        utm: utm ?? null,
        source: source ?? "landing",
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}