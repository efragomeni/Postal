import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await connectDB();

  const topic = await Topic.findByIdAndUpdate(
    id,
    { $set: { reported: false, reportedBy: [] } },
    { new: true }
  );

  if (!topic) {
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Denuncia levantada" });
}
