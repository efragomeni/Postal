import { NextResponse } from "next/server";
import Notification from "@/models/notification";
import { connectDB } from "@/lib/db";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await connectDB();

    const { params } = context;
    // const id = params.id; 

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al borrar notificación" }, { status: 500 });
  }
}
