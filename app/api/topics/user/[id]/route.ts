import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";
import User from "@/models/user";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(id).select("name lastname username profileImage");
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const topics = await Topic.find({ author: id }).sort({ createdAt: -1 });

  return NextResponse.json({ user, topics });
}
