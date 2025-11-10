import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 🟢 GET - Obtener todos los topics
export async function GET() {
  try {
    await connectDB();
    const topics = await Topic.find().sort({ createdAt: -1 });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error al obtener topics:", error);
    return NextResponse.json(
      { error: "Error al obtener topics" },
      { status: 500 }
    );
  }
}

// 🟢 POST - Crear un nuevo topic
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("No autorizado", { status: 401 });
    }
    const { title, content } = await req.json();
    const author = session.user?.name || "Anónimo";
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    await connectDB();
    const newTopic = new Topic({ title, content, author });
    await newTopic.save();

    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error("Error al crear topic:", error);
    return NextResponse.json(
      { error: "Error al crear topic" },
      { status: 500 }
    );
  }
}
