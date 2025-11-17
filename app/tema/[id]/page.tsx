"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, User, ArrowLeft } from "lucide-react";

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
  replies: Reply[];
}

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    async function fetchTopic() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        //console.log("Id desde TEMA", id);
        const res = await fetch(`/api/topics/${id}`);
        //console.log("Que es res?", res);
        if (!res.ok) throw new Error("Error al obtener el tema desde tema[ID]");
        const data = await res.json();
        setTopic(data)
        // setTopic({
        //   _id: data._id,
        //   title: data.title,
        //   content: data.content,
        //   author: data.author,
        //   createdAt: data.createdAt,
        //   replies: data.replies || [],
        // });
      } catch (error) {
        console.log(error);
      }
    }
    console.log("params", params);
    console.log("ID", params?.id);
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
            <CardTitle className="text-3xl md:text-4xl mb-4">
              {topic.title}
            </CardTitle>

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
            <p className="text-lg md:text-xl leading-relaxed">
              {topic.content}
            </p>
          </CardContent>
        </Card>

        {/* Respuestas */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Respuestas ({topic.replies.length})
          </h3>
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
    </div>
  );
}
