"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { PageTopBar } from "@/components/PageTopBar";

interface Topic {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  replies: any[];
}

interface UserInfo {
  name: string;
  lastname: string;
  username: string;
  profileImage?: string;
}

export default function PostalesDeUsuario() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || !id) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/topics/user/${id}`);
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setUserInfo(data.user);
        setTopics(data.topics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status, id]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando…</p>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <PageTopBar />

        {/* Título */}
        <div className="flex items-center gap-3 mb-8">
          {userInfo?.profileImage && (
            <img
              src={userInfo.profileImage}
              alt={userInfo.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          )}
          <h1 className="text-3xl font-bold text-foreground">
            Postales de{" "}
            <span className="text-color-principal">
              {userInfo ? `${userInfo.name} ${userInfo.lastname}` : "…"}
            </span>
          </h1>
        </div>

        {/* Postales */}
        {topics.length === 0 ? (
          <p className="text-lg text-gray-600">
            Este usuario todavía no creó ninguna postal.
          </p>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <Card
                key={topic._id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/tema/${topic._id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-3xl md:text-4xl mb-4">
                    {topic.title}
                  </CardTitle>

                  <CardDescription className="text-base md:text-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={userInfo?.profileImage || "/default.jpg"}
                        alt={userInfo?.name || ""}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>
                        {userInfo
                          ? `${userInfo.name} ${userInfo.lastname}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4 items-center">
                      <Calendar className="w-5 h-5" />
                      {formatDate(topic.createdAt)}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-2 mb-3">{topic.content}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-5 h-5" />
                    {topic.replies.length}{" "}
                    {topic.replies.length === 1 ? "comentario" : "comentarios"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
