import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Topic from "@/models/topic";
import User from "@/models/user";

/*.*.*.*  GET TODOS LOS TEMAS *.*.*.*/
export async function GET() {
  try {
    await connectDB();
    const topics = await Topic.find()
      .populate("author", "username profileImage provincia institucion")
      .sort({ createdAt: -1 });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error al obtener topics:", error);
    return NextResponse.json(
      { error: "Error al obtener topics" },
      { status: 500 }
    );
  }
}

/*.*.*.*   POST NUEVO TEMA *.*.*.*/
export async function POST(req: Request) {
  console.log("POST /api/topics ejecutándose");

  try {
    const session = await getServerSession(authOptions);
    console.log("Sesión obtenida:", session);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();

    const { title, content } = await req.json();
    console.log("Datos recibidos:", { title, content });

    const user = await User.findById(session.user.id);
    if (!user)
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );

    const newTopic = new Topic({
      title,
      content,
      author: user._id,
      profileimage:user.profileImage,
    });

    await newTopic.save();

    const populatedTopic = await newTopic.populate(
      "author",
      "username profileImage provincia institucion"
    );
    console.log("Tema creado correctamente:", populatedTopic);

    return NextResponse.json(populatedTopic, { status: 201 });
  } catch (error) {
    console.error("Error al crear topic:", error);
    return NextResponse.json(
      { error: "Error al crear topic" },
      { status: 500 }
    );
  }
}
