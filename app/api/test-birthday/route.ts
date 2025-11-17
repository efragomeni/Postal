import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { runBirthdayCheckOnce } from "@/lib/birthdayCron";

export async function GET() {
  await connectDB();
  await runBirthdayCheckOnce();
  
  return NextResponse.json({ ok: true, message: "Cron ejecutado manualmente" });
}
