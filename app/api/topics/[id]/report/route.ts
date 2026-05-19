import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";
import User from "@/models/user";
import Notification from "@/models/notification";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();

  const topic = await Topic.findById(id).populate("author", "username");
  if (!topic) {
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  }

  // Evitar denuncias dobles
  const alreadyReported = topic.reportedBy?.some(
    (uid: any) => String(uid) === String(session.user.id)
  );
  if (alreadyReported) {
    return NextResponse.json(
      { error: "Ya denunciaste esta postal" },
      { status: 409 }
    );
  }

  // Evitar auto-denuncia
  if (String(topic.author?._id ?? topic.author) === String(session.user.id)) {
    return NextResponse.json(
      { error: "No podés denunciar tu propia postal" },
      { status: 403 }
    );
  }

  // Marcar como denunciada
  topic.reported = true;
  if (!topic.reportedBy) topic.reportedBy = [];
  topic.reportedBy.push(session.user.id);
  await topic.save();

  // Notificar a todos los admins
  const admins = await User.find({ role: "admin" }).select("_id");
  const postAuthor = topic.author?.username || "un usuario";

  await Notification.insertMany(
    admins.map((admin: any) => ({
      user: admin._id,
      type: "report",
      message: `🚨 ${session.user.username} ha denunciado la publicación de ${postAuthor}`,
      link: `/tema/${id}`,
      read: false,
    }))
  );

  return NextResponse.json({ message: "Postal denunciada" });
}
