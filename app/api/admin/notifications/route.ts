import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notification from "@/models/notification";
import { connectDB } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await connectDB();
  const notifs = await Notification.find({
    user: session.user.id,
    type: "report",
  }).sort({ createdAt: -1 });

  return NextResponse.json(notifs);
}

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await connectDB();
  await Notification.updateMany(
    { user: session.user.id, type: "report", read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ success: true });
}
