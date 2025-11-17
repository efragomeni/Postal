import Notification from "@/models/notification";
import { connectDB } from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const notif = await Notification.create(body);
  return NextResponse.json(notif);
}
