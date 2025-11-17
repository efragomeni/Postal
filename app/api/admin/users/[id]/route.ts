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
