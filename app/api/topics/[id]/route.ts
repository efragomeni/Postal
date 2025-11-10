import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("📡 Buscando tema con id:", id);

  await connectDB();
  const topic = await Topic.findById(id);
  console.log("Resultado de la búsqueda:", topic);

  if (!topic)
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });

  return NextResponse.json(topic);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("No autorizado", { status: 401 });
  }
  const  author= session.user?.name || "Anónimo";;
  const { content } = await req.json();

  await connectDB();
  const topic = await Topic.findById(id);
  if (!topic)
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });

  topic.replies.push({ author, content });
  await topic.save();

  return NextResponse.json(topic);
}
