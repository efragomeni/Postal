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

  const updateData: any = { name, lastname, username, dni, institucion, provincia };

  // Manejar el email vacío para que no rompa el unique:true (sparse)
  if (email && email.trim() !== "") {
    updateData.email = email.trim();
  } else {
    updateData.$unset = { email: 1 };
  }

  // Manejar fecnac vacío
  if (fecnac && fecnac.trim() !== "") {
    updateData.fecnac = fecnac;
  } else {
    updateData.$unset = { ...updateData.$unset, fecnac: 1 };
  }

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuario actualizado", user: updated });
  } catch (error: any) {
    console.error("Error actualizando usuario:", error);
    if (error.code === 11000) {
      return NextResponse.json({ message: "El DNI o Email ya está en uso por otro usuario" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
