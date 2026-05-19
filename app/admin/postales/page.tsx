"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  User,
  ArrowLeft,
  Trash2,
  Flag,
  CheckCircle,
} from "lucide-react";

interface Reply {
  _id: string;
}

interface Author {
  _id: string;
  username: string;
  profileImage?: string;
  institucion?: string;
  provincia?: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  author: Author | null;
  type: string;
  createdAt: string;
  replies: Reply[];
  reported?: boolean;
  reportedBy?: string[];
}

export default function AdminPostalesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState<string | null>(null); // id del topic que se está limpiando

  // Protección
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    async function fetchTopics() {
      const res = await fetch("/api/topics");
      if (!res.ok) return;
      const data = await res.json();
      setTopics(data);
    }
    fetchTopics();
  }, [status]);

  async function handleDelete() {
    if (!topicToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/topics/${topicToDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setTopics((prev) => prev.filter((t) => t._id !== topicToDelete._id));
      setTopicToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleClearReport(id: string) {
    setClearing(id);
    try {
      const res = await fetch(`/api/topics/${id}/clear-report`, { method: "POST" });
      if (res.ok) {
        setTopics((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, reported: false, reportedBy: [] } : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-xl">Cargando…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin")}
          className="mb-6 h-12 text-base md:text-lg gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al panel
        </Button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-1">
              Todas las postales
            </h2>
            <p className="text-muted-foreground text-lg">
              {topics.length} publicaciones en el foro
            </p>
          </div>
          {topics.filter((t) => t.reported).length > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
              <Flag className="w-4 h-4 text-orange-500" />
              <span className="text-orange-700 font-medium text-sm">
                {topics.filter((t) => t.reported).length} denunciada
                {topics.filter((t) => t.reported).length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {topics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-xl text-muted-foreground">
                  No hay postales publicadas.
                </p>
              </CardContent>
            </Card>
          ) : (
            topics.map((topic) => {
              const isBirthday = topic.type === "birthday";
              return (
                <Card
                  key={topic._id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer relative ${
                    topic.reported
                      ? "border-orange-400 border-2"
                      : ""
                  }`}
                  onClick={() => router.push(`/tema/${topic._id}`)}
                >
                  {/* Badge denunciada */}
                  {topic.reported && (
                    <div className="absolute top-3 right-14 flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full border border-orange-300">
                      <Flag className="w-3 h-3" />
                      Denunciada
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-2xl md:text-3xl">
                        {topic.title}
                        {isBirthday && (
                          <span className="ml-2 text-sm font-normal text-pink-500">
                            🎂 Cumpleaños automático
                          </span>
                        )}
                      </CardTitle>

                      {/* Botón OK — solo en denunciadas */}
                      {topic.reported && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearReport(topic._id);
                          }}
                          disabled={clearing === topic._id}
                          title="Marcar como revisada (sin problema)"
                          className="shrink-0 p-2 rounded-lg text-green-600 hover:bg-green-50 transition cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {/* Botón eliminar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopicToDelete(topic);
                        }}
                        title="Eliminar postal"
                        className="shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {!isBirthday && (
                      <CardDescription className="text-base space-y-1">
                        <div className="flex items-center gap-2">
                          {topic.author?.profileImage ? (
                            <img
                              src={topic.author.profileImage}
                              alt={topic.author.username}
                              className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-500" />
                          )}
                          <span className="font-medium">
                            {topic.author?.username || "Usuario desconocido"}
                          </span>
                          {topic.author?.institucion && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-muted-foreground text-sm">
                                {topic.author.institucion}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    {!isBirthday && (
                      <>
                        <p className="text-base mb-3 line-clamp-2 text-muted-foreground">
                          {topic.content}
                        </p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">
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

      {/* Modal de eliminación */}
      {topicToDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setTopicToDelete(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[380px] text-center animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Eliminar postal</h2>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro que querés eliminar la postal{" "}
              <span className="font-semibold">"{topicToDelete.title}"</span>?
              <br />
              Esta acción es irreversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setTopicToDelete(null)}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
