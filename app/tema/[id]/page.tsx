"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, User, ArrowLeft, Pencil, Trash2, Flag, CheckCircle } from "lucide-react";

/**Prueba para host  **/
interface Author {
  _id: string;
  username: string;
  profileImage?: string;
}
/**Prueba para host  **/
interface Reply {
  // author: string;
  author: Author | null;
  content: string;
  createdAt: string;
  //profileImage: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  // author: string;
  author: Author | null;
  createdAt: string;
  images?: string[];
  reported?: boolean;
  reportedBy?: string[];
  replies: Reply[];
  type?: string;
}

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const isAuthor =
    session?.user?.id && topic?.author?._id
      ? String(session.user.id) === String(topic.author._id)
      : false;

  const canEdit = isAuthor && topic?.replies?.length === 0 && topic?.type !== "birthday";
  const canDelete = isAuthor || session?.user?.role === "admin";
  const alreadyReported = topic?.reportedBy?.some(
    (uid) => String(uid) === String(session?.user?.id)
  ) ?? false;
  const canReport = !isAuthor && session?.user?.role !== "admin";

  useEffect(() => {
    async function fetchTopic() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/topics/${id}`);
        if (!res.ok) throw new Error("Error al obtener el tema desde tema[ID]");
        const data = await res.json();
        setTopic(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (params.id) fetchTopic();
  }, [params.id]);

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || !topic) return;

    try {
      const res = await fetch(`/api/topics/${topic._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "Usuario demo",
          content: replyContent,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTopic(updated);
        setReplyContent("");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete() {
    if (!topic) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/topics/${topic._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  async function handleReport() {
    if (!topic || reporting) return;
    setReporting(true);
    try {
      const res = await fetch(`/api/topics/${topic._id}/report`, {
        method: "POST",
      });
      if (res.ok) {
        setTopic((prev) =>
          prev
            ? {
                ...prev,
                reported: true,
                reportedBy: [...(prev.reportedBy || []), session?.user?.id || ""],
              }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReporting(false);
    }
  }

  async function handleClearReport() {
    if (!topic || clearing) return;
    setClearing(true);
    try {
      const res = await fetch(`/api/topics/${topic._id}/clear-report`, {
        method: "POST",
      });
      if (res.ok) {
        setTopic((prev) =>
          prev ? { ...prev, reported: false, reportedBy: [] } : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (!topic)
    return (
      <div className="min-h-screen bg-secondary">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground mb-6">
                Tema no encontrado
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/")}
                className="h-14 text-lg gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );

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

        {/* Tema principal */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                {topic.title}
              </CardTitle>

              {/* Botones de editar/eliminar */}
              {(isAuthor || canDelete) && (
                <div className="flex gap-2 shrink-0 mt-1">
                  {canEdit && (
                    <button
                      onClick={() => router.push(`/editar-tema/${topic._id}`)}
                      title="Editar postal"
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  {/* Botón OK para limpiar denuncia — solo admin cuando la postal está denunciada */}
                  {session?.user?.role === "admin" && topic.reported && (
                    <button
                      onClick={handleClearReport}
                      disabled={clearing}
                      title="Marcar como revisada (sin problema)"
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      title="Eliminar postal"
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

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

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(topic.createdAt)}</span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
              {topic.content}
            </p>
            {topic.images && topic.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {topic.images.map((img, i) => (
                  <div key={i} className="aspect-video relative rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <img
                      src={img}
                      alt={`Imagen adjunta ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Respuestas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              Respuestas ({topic.replies.length})
            </h3>
            {/* Botón Denunciar — solo para quien no es autor ni admin */}
            {canReport && (
              <button
                onClick={handleReport}
                disabled={alreadyReported || reporting}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition cursor-pointer
                  ${
                    alreadyReported
                      ? "border-red-300 text-red-500 bg-red-50 opacity-70 cursor-not-allowed"
                      : "border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100"
                  }`}
              >
                <Flag className="w-4 h-4" />
                {alreadyReported ? "Denunciada" : reporting ? "Enviando..." : "Denunciar"}
              </button>
            )}
          </div>
          <div className="space-y-4">
            {topic.replies.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-lg text-muted-foreground">
                    No hay respuestas todavía. ¡Sé el primero en responder!
                  </p>
                </CardContent>
              </Card>
            ) : (
              topic.replies.map((reply, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardDescription className="text-base md:text-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={reply.author?.profileImage}
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />

                        <span className="font-semibold">
                          {reply.author?.username || "Desconocido"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{formatDate(reply.createdAt)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg leading-relaxed">
                      {reply.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Formulario para responder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              Escribe tu respuesta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="reply" className="text-lg font-medium block">
                  Tu respuesta
                </label>
                <Textarea
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="text-[#FFF] min-h-32 text-lg resize-none"
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>
              <Button
                variant="secondary"
                type="submit"
                size="lg"
                className="h-14 text-xl font-semibold mx-auto block"
              >
                Publicar Respuesta
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[380px] text-center animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Eliminar postal</h2>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro que querés eliminar la postal{" "}
              <span className="font-semibold">"{topic.title}"</span>?<br />
              Esta acción es irreversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
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
