"use client";

import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";

export default function CreateTopicPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
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
          className="mb-6 h-12 text-base md:text-lg gap-2"
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
