"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
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

export default function EditTopicPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authorId, setAuthorId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Cargar datos del tema
  useEffect(() => {
    if (!id) return;
    async function fetchTopic() {
      const res = await fetch(`/api/topics/${id}`);
      if (!res.ok) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setExistingImages(data.images || []);
      setAuthorId(data.author?._id ?? null);
    }
    fetchTopic();
  }, [id]);

  // Protección: redirigir si no es el autor
  useEffect(() => {
    if (status === "loading" || !authorId) return;
    if (!session?.user?.id || String(session.user.id) !== String(authorId)) {
      router.push("/");
    }
  }, [session, status, authorId]);

  const totalImages = existingImages.length + newFiles.length;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const available = 3 - totalImages;
    const toAdd = files.slice(0, available);
    if (toAdd.length < files.length) {
      setError("Solo podés tener un máximo de 3 imágenes en total.");
    }

    setNewFiles([...newFiles, ...toAdd]);
    setNewPreviews([...newPreviews, ...toAdd.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExisting = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNew = (index: number) => {
    const updatedFiles = [...newFiles];
    const updatedPreviews = [...newPreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setNewFiles(updatedFiles);
    setNewPreviews(updatedPreviews);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      // Subir nuevas imágenes a Cloudinary
      const uploaded = await Promise.all(newFiles.map(uploadImage));
      const finalImages = [...existingImages, ...uploaded];

      const res = await fetch(`/api/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, images: finalImages }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar los cambios.");
        return;
      }

      router.push(`/tema/${id}`);
    } catch (err) {
      console.error(err);
      setError("Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading")
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="mb-6 h-12 text-base md:text-lg gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Editar Postal
            </CardTitle>
            <CardDescription className="text-lg">
              Modificá el contenido de tu postal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
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
                  placeholder="Título de la postal"
                />
              </div>

              {/* Contenido */}
              <div className="space-y-3">
                <label htmlFor="content" className="text-lg font-medium block">
                  Descripción de la postal
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-48 text-lg resize-none"
                  placeholder="Descripción de tu postal..."
                />
              </div>

              {/* Imágenes */}
              <div className="space-y-3">
                <label className="text-lg font-medium block">
                  Imágenes ({totalImages}/3)
                </label>

                {/* Existentes */}
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {existingImages.map((img, i) => (
                      <div key={`ex-${i}`} className="relative w-32 h-32">
                        <img
                          src={img}
                          alt={`Imagen ${i + 1}`}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExisting(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nuevas (preview) */}
                {newPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {newPreviews.map((preview, i) => (
                      <div key={`new-${i}`} className="relative w-32 h-32">
                        <img
                          src={preview}
                          alt="Nueva imagen"
                          className="w-full h-full object-cover rounded-md border border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNew(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-blue-500/80 text-white py-0.5 rounded-b-md">
                          Nueva
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón agregar */}
                {totalImages < 3 && (
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 gap-2 cursor-pointer"
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
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-base">
                  {error}
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={loading}
                  className="h-14 text-xl font-semibold flex-1 cursor-pointer"
                >
                  {loading ? "Guardando…" : "Guardar cambios"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="h-14 text-xl flex-1  cursor-pointer"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
