"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/navbar";

interface Reply {
  author: string;
  content: string;
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: Reply[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);

  //Si el usuario no está autenticado, lo redirigimos
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Mientras verifica la sesión, mostramos un loader
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h1 className="text-2xl font-semibold">Verificando sesión...</h1>
      </div>
    );
  }

  // Si la sesión no existe (token inválido ó user borrado)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h1 className="text-2xl font-semibold">
          Debes iniciar sesión para acceder al foro.
        </h1>
      </div>
    );
  }

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch("/api/topics");
        if (!res.ok) throw new Error("Error al obtener los temas");
        const data = await res.json();
        setTopics(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTopics();
    // if (status === "authenticated") {
    // }
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
 
  if (status === "loading") {
     return <h1>Cargando...</h1>;
   }
 
   // Si no está logueado (o fue borrado), mostrar mensaje
  if (status === "unauthenticated") {
    return <h1>Debes iniciar sesión para acceder al foro</h1>;
  }

  // Si está logueado, mostrar el contenido del foro
  return (
    <div className="contenedor-principal min-h-screen bg-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="contenedor-titulo mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Temas del Foro
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Explora las conversaciones de la comunidad
          </p>
        </div>

        <div className="space-y-4">
          {topics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-xl text-muted-foreground mb-6">
                  No hay temas todavía. ¡Sé el primero en crear uno!
                </p>
                <Button
                  size="lg"
                  onClick={() => router.push("/crear-tema")}
                  className="h-14 text-lg"
                >
                  Crear Primer Tema
                </Button>
              </CardContent>
            </Card>
          ) : (
            topics.map((topic) => (
              <Card
                key={topic._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/tema/${topic._id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl mb-3">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span>Por {topic.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(topic.createdAt)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base md:text-lg mb-4 line-clamp-2">
                    {topic.content}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-base md:text-lg font-medium">
                      {topic.replies.length}{" "}
                      {topic.replies.length === 1 ? "respuesta" : "respuestas"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
