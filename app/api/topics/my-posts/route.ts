import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Topic from "@/models/topic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
  //sort createdAt:-1 los ordena del más nuevo al más viejo
  const topics = await Topic.find({ author: session.user.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ topics });
}
