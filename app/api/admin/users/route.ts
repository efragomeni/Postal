import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/user";

/*.*.*.* GET *.*.*.*/
export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  await connectDB();
  const users = await User.find().select("-password");

  return NextResponse.json({ users });
}

/*.*.*.* POST *.*.*.*/
export async function POST(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    const data = await req.json();
    console.log("DATA RECIBIDA:", data);

    const {
      name,
      lastname,
      username,
      dni,
      email,
      password,
      fecnac,
      institucion,
      provincia,
    } = data;

    if (!name || !lastname || !username || !dni || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const existe = await User.findOne({ $or: [{ dni }] });

    if (existe) {
      return NextResponse.json(
        { message: "Usuario ya existente" },
        { status: 409 }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      name,
      lastname,
      username,
      dni,
      email: email?.trim()!=""?email:undefined,
      password: hashedPass,
      role: "user",
      profileimage: "/default.jpg",
      fecnac,
      institucion,
      provincia,
    });

    return NextResponse.json(
      { message: "Usuario creado", user: nuevoUsuario._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR EN CREAR USUARIO:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
