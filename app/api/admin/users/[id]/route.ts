import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import User from "@/models/user";


export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  console.log("ID RECIBIDO:", id);

  const session = await getServerSession(authOptions);

  await connectDB();

  const user = await User.findById(id).select("-password");

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  await connectDB();

  const { name, lastname, username, dni, email, fecnac, institucion, provincia } = await req.json();

  const updated = await User.findByIdAndUpdate(
    id,
    { name, lastname, username, dni, email, fecnac, institucion, provincia },
    { new: true }
  ).select("-password");

  if (!updated) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ message: "Usuario actualizado", user: updated });
}
