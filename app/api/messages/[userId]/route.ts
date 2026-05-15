import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Message from "@/models/message";
import Notification from "@/models/notification";
import mongoose from "mongoose";

/* GET — mensajes entre el usuario actual y [userId] */
export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await context.params;
  await connectDB();

  const myId = new mongoose.Types.ObjectId(session.user.id);
  const otherId = new mongoose.Types.ObjectId(userId);

  const messages = await Message.find({
    $or: [
      { sender: myId, receiver: otherId },
      { sender: otherId, receiver: myId },
    ],
  }).sort({ createdAt: 1 });

  // Marcar como leídos los mensajes recibidos del otro
  await Message.updateMany(
    { sender: otherId, receiver: myId, read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ messages });
}

/* POST — enviar mensaje a [userId] */
export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await context.params;
  const { content } = await req.json();

  if (!content?.trim())
    return NextResponse.json({ error: "Contenido vacío" }, { status: 400 });

  await connectDB();

  const message = await Message.create({
    sender: session.user.id,
    receiver: userId,
    content: content.trim(),
  });

  // Crear notificación para el receptor
  const senderName = `${session.user.name} ${session.user.lastname}`;
  await Notification.create({
    user: userId,
    type: "message",
    message: `💬 ${senderName} te envió un mensaje`,
    link: `/?openChat=${session.user.id}`,
  });

  return NextResponse.json({ message }, { status: 201 });
}
