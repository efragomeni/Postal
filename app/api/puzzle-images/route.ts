import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const puzzleDir = path.join(process.cwd(), "public", "img", "Puzzle");
    
    // Si el directorio no existe, devolver array vacío
    if (!fs.existsSync(puzzleDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(puzzleDir);
    
    // Filtrar por extensiones comunes de imagen
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((file) => `/img/Puzzle/${file}`);

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error reading puzzle directory:", error);
    return NextResponse.json([], { status: 500 });
  }
}
