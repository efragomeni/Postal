// Aca tengo q verificar la sesion, conectar a la BD, Hashear la contraseña si viene una nueva y guardar los cambios.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Sesión obtenida:", session);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { newPassword, newPhoto, newUsername } = await req.json();

    await connectDB();
    // const user = await User.findOne({ email: session.user.email });
    const userId = session.user.id;
    const user = await User.findById(userId);
    // console.log("newphoto", newPhoto);

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Si envía nueva contraseña
    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;

      user.mustChangePassword = false;
    }
    // Si envía nueva foto
    if (newPhoto) {
      user.profileImage = newPhoto;
    }

    //Si envia un nuevo Username= apodo
    if (newUsername) {
      user.username = newUsername;
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Datos actualizados correctamente",
        profileImage: user.profileImage,
        username: user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error en update", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
