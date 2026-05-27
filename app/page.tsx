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
import { PageTopBar } from "@/components/PageTopBar";

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
  reported?: boolean;
  reportedBy?: string[];
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
        <PageTopBar hideBack={true} />
        
        <div className="contenedor-titulo mb-8 flex sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-3">
              Temas del Foro
            </h2>
            <h3 className="text-sm sm:text-lg md:text-xl text-muted-foreground">
              Explora las postales de la comunidad
            </h3>
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
                    isBirthday ? "min-h-[280px] py-4 flex flex-col justify-between" : ""
                  }`}
                  onClick={() => router.push(`/tema/${topic._id}`)}
                >
                  <CardHeader>
                    {isBirthday ? (
                      <CardTitle className="text-lg sm:text-xl md:text-2xl mb-3 text-center">
                        {topic.title}
                      </CardTitle>
                    ) : (
                      <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-4">
                        {topic.title}
                      </CardTitle>
                    )}
                    {isBirthday && (
                      <CardDescription className="text-sm sm:text-base md:text-lg space-y-2 flex flex-col items-center">
                        {isBirthday && topic.author?.profileImage && (
                          <img
                            src={topic.author.profileImage}
                            alt={topic.author.username}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-pink-400 shadow-lg"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                      </CardDescription>
                    )}
                    {!isBirthday && (
                      <CardDescription className="text-sm sm:text-base md:text-lg space-y-2">
                        <div className="flex items-center gap-2">
                          {topic.author?.profileImage ? (
                            <img
                              src={topic.author.profileImage}
                              alt={topic.author.username}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {topic.author?.username || "Usuario desconocido"}
                          </span>
                        </div>

                        <div className="flex mt-2 text-xs sm:text-sm md:text-base gap-3 text-muted-foreground flex-wrap">
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
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    {isBirthday ? (
                      <div className="flex justify-center mt-2">
                        <Button
                          size="lg"
                          className="text-base sm:text-lg hover:bg-blue-200"
                          variant="outline"
                          onClick={() => router.push(`/tema/${topic._id}`)}
                        >
                          Saludar 🎉
                        </Button>
                      </div>
                    ) : (
                      // No es cumpleaño
                      <>
                        <p className="text-sm sm:text-base md:text-lg mb-4 line-clamp-2">
                          {topic.content}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base md:text-lg font-medium">
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
