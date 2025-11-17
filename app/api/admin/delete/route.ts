import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const { id } = await req.json();

  await connectDB();
  await User.findByIdAndDelete(id);

  return NextResponse.json({ message: "Usuario eliminado" });
}
