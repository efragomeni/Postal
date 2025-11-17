import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { dni, lastname } = body || {};

    // normalizar
    const cleanDni = typeof dni === "string" ? dni.trim() : "";
    const cleanLastname = typeof lastname === "string" ? lastname.trim() : "";

    await connectDB();

    // si ambos vacíos -> devolver todos
    if (cleanDni === "" && cleanLastname === "") {
      const usuarios = await User.find().select("-password");
      return NextResponse.json({ usuarios }, { status: 200 });
    }

    // armar query con lo que venga
    const query: any = {};
    if (cleanDni !== "") query.dni = cleanDni;
    if (cleanLastname !== "") query.lastname = new RegExp(cleanLastname, "i");

    const usuarios = await User.find(query).select("-password");
    return NextResponse.json({ usuarios }, { status: 200 });
  } catch (error) {
    console.error("Error en /api/admin/search:", error);
    return NextResponse.json({ error: "Error buscando usuarios" }, { status: 500 });
  }
}
