"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

export default function CreateTopicPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limitar a 3 imagenes total
    const totalCurrent = imagesFiles.length;
    const availableSlots = 3 - totalCurrent;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length < files.length) {
      setError("Solo podés subir un máximo de 3 imágenes.");
    }

    const newFiles = [...imagesFiles, ...filesToAdd];
    setImagesFiles(newFiles);

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setImagesPreviews([...imagesPreviews, ...newPreviews]);
    
    // Limpiar el input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...imagesFiles];
    updatedFiles.splice(index, 1);
    setImagesFiles(updatedFiles);

    const updatedPreviews = [...imagesPreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Limpiar memoria
    updatedPreviews.splice(index, 1);
    setImagesPreviews(updatedPreviews);
  };

  async function uploadImage(file: File): Promise<string> {
    const signRes = await fetch("/api/upload/sign");
    const { timestamp, signature, apiKey, cloudName } = await signRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form }
    );

    const data = await uploadRes.json();
    return data.secure_url;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Se activo el envio");
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      setLoading(true);

      // Subir imágenes si hay
      let uploadedUrls: string[] = [];
      if (imagesFiles.length > 0) {
        uploadedUrls = await Promise.all(imagesFiles.map((file) => uploadImage(file)));
      }

      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          images: uploadedUrls,
          author: "Usuario",
        }),
      });

      if (!res.ok) {
        throw new Error("Error al crear la postal");
      }

      const data = await res.json();
      let tries = 0;
      while (tries < 5) {
        const check = await fetch(`/api/topics/${data._id}`);
        if (check.ok) break;
        await new Promise((res) => setTimeout(res, 300));
        tries++;
      }
      router.push(`/tema/${data._id}`);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la postal. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
        <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/")}
          className="mb-6 h-12 text-base md:text-lg gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Crear Nueva Postal
            </CardTitle>
            <CardDescription className="text-lg">
              Comparte tus ideas con la comunidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="title" className="text-lg font-medium block">
                  Título de la postal
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-14 text-lg text-[#FFF]"
                  placeholder="Escribe un título claro y descriptivo (obligatorio)"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="content" className="text-lg font-medium block">
                  Descripción de la postal
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="color-[var(--color-principal)] min-h-48 text-lg resize-none"
                  placeholder="Describe tu tema con detalle...(obligatorio)"
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-medium block">
                  Imágenes adjuntas (máximo 3)
                </label>
                
                <div className="flex gap-4 items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imagesFiles.length >= 3}
                    className="h-14 gap-2 cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5" />
                    Añadir imagen
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {imagesPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {imagesPreviews.map((preview, i) => (
                      <div key={i} className="relative w-32 h-32">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-base">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="secondary"
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="h-14 text-xl font-semibold flex-1"
                >
                  {loading ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
