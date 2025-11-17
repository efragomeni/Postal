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

interface Reply {
  author: string;
  content: string;
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  author: any;
  type: string;
  createdAt: string;
  replies: Reply[];
  provincia: string; //probando
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);

  // --------------------------
  // 1) Redirección si NO está logueado
  // --------------------------
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // --------------------------
  // 2) Fetch de temas
  // --------------------------
  useEffect(() => {
    if (status !== "authenticated") return;

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
  }, [status]);

  // --------------------------
  // 3) Si sigue cargando sesión
  // --------------------------
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h1 className="text-2xl font-semibold">Verificando sesión...</h1>
      </div>
    );
  }

  // --------------------------
  // 4) Si por alguna razón no existe session (token inválido)
  // --------------------------
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h1 className="text-2xl font-semibold">
          Debes iniciar sesión para acceder al foro.
        </h1>
      </div>
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="contenedor-principal min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <div className="contenedor-titulo mb-8 flex sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-3">
              Temas del Foro
            </h2>
            <h3 className="text-sm sm:text-lg md:text-xl text-muted-foreground">
              Explora las conversaciones de la comunidad
            </h3>
          </div>
          <div className="shrink-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/mis-postales")}
              className="h-10 sm:h-12 text-sm sm:text-base md:text-lg gap-2 cursor-pointer"
            >
              <span>Mis postales</span>
            </Button>
          </div>
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
                  variant="outline"
                >
                  Crear Primera Postal
                </Button>
              </CardContent>
            </Card>
          ) : (
            topics.map((topic) => {
              const isBirthday = topic.type === "birthday";

              return (
                <Card
                  key={topic._id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    isBirthday ? "h-[350px]" : ""
                  }`}
                  onClick={() => router.push(`/tema/${topic._id}`)}
                >
                  <CardHeader>
                    {isBirthday ? (
                      <CardTitle className="text-2xl md:text-3xl mb-3 text-center">
                        {topic.title}
                      </CardTitle>
                    ) : (
                      <CardTitle className="text-3xl md:text-4xl mb-4">
                        {topic.title}
                      </CardTitle>
                    )}
                    {isBirthday && (
                      <CardDescription className="text-base md:text-lg space-y-2 flex flex-col items-center">
                        {isBirthday && topic.author?.profileImage && (
                          <img
                            src={topic.author.profileImage}
                            alt={topic.author.username}
                            className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 shadow-lg"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                      </CardDescription>
                    )}
                    {!isBirthday && (
                      <CardDescription className="text-base md:text-lg space-y-2">
                        <div className="flex items-center gap-2">
                          {topic.author?.profileImage ? (
                            <img
                              src={topic.author.profileImage}
                              alt={topic.author.username}
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {topic.author?.username || "Usuario desconocido"}
                          </span>
                        </div>

                        <div className="flex mt-2 text-md gap-3 text-muted-foreground">
                          <span>
                            {topic.author?.institucion ||
                              "Institución desconocida"}
                          </span>
                          <span>-</span>
                          <span>
                            {topic.author?.provincia || "Provincia desconocida"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    {isBirthday ? (
                      <div className="flex justify-center mt-4">
                        <Button
                          size="lg"
                          className="text-lg hover:bg-blue-200"
                          variant="outline"
                          onClick={() => router.push(`/tema/${topic._id}`)}
                        >
                          Saludar 🎉
                        </Button>
                      </div>
                    ) : (
                      // No es cumpleaño
                      <>
                        <p className="text-base md:text-lg mb-4 line-clamp-2">
                          {topic.content}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-base md:text-lg font-medium">
                            {topic.replies.length}{" "}
                            {topic.replies.length === 1
                              ? "respuesta"
                              : "respuestas"}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
