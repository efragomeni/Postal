import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Falta uno o todos los campos" },
        { status: 400 }
      );
    }

    await connectDB();

    // Hay que verificar si el email esta registrado ya.

    const existeUser = await User.findOne({ email });
    if (existeUser) {
      return NextResponse.json(
        { message: "Usuario ya existe" },
        { status: 409 }
      );
    }

    //Si no existe vamos a guardarlo, primero encriptamos la contraseña:

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      { message: "usuario creado ok", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error en registro", error);
    return NextResponse.json(
      { message: "error del servidor" },
      { status: 500 }
    );
  }
}
