import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";
import Notification from "@/models/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/*.*.*.* GET *.*.*.*/
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("📡 Buscando tema con id:", id);

  await connectDB();
  const topic = await Topic.findById(id)
    .populate("author", "username profileImage")
    .populate("replies.author", "username profileImage")
    .sort({ createdAt: -1 });
  console.log("Resultado de la búsqueda:", topic);
  console.log("repli imagen:", topic.replies.profileImage);

  if (!topic)
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });

  return NextResponse.json(topic);
}

/*.*.*.* POST *.*.*.*/
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { content } = await req.json();

  await connectDB();

  const topic = await Topic.findById(id);
  if (!topic)
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });

  // Agregar reply
  topic.replies.push({
    author: session.user.id,
    content,
  });

  await topic.save();

  // Repopular todo actualizado
  const updated = await Topic.findById(id)
    .populate("author", "username profileImage")
    .populate("replies.author", "username profileImage");

  // Crear notificación
  if (String(topic.author) !== String(session.user.id)) {
    await Notification.create({
      user: topic.author, // dueño del post
      type: "reply",
      message: `${session.user.username} respondió tu postal`,
      link: `/tema/${topic._id}`,
    });
  }

  return NextResponse.json(updated);
}
