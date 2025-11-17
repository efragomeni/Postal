import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notification from "@/models/notification";
import { connectDB } from "@/lib/db";

/*.*.*.*   GET   *.*.*.*/
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  await connectDB();
  const notifs = await Notification.find({ user: session.user.id })
    .sort({ createdAt: -1 });

  return NextResponse.json(notifs);
}
/*.*.*.*   PATCH   *.*.*.*/
export async function PATCH() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  await connectDB();
  // marcar todas como leídas
  await Notification.updateMany(
    { user: session.user.id, read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ success: true });
}



