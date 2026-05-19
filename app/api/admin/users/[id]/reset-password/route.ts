import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  await connectDB();

  const hashed = await bcrypt.hash("postal", 10);

  const updated = await User.findByIdAndUpdate(
    id,
    { password: hashed, mustChangePassword: true },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Contraseña restablecida" });
}
