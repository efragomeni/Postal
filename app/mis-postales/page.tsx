"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, MessageSquare } from "lucide-react";

interface Topic {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  replies: any[];
}

export default function MisPostales() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status]);

  useEffect(() => {
    async function fetchMyPosts() {
      const res = await fetch("/api/topics/my-posts");
      const data = await res.json();
      setTopics(data.topics);
    }
    fetchMyPosts();
  }, []);

  if (status === "loading") return <p>Cargando…</p>;
  if (!session) return <p>Debes iniciar sesión</p>;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen w-full bg-secondary ">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Mis Postales
        </h1>

        {topics.length === 0 ? (
          <p className="text-lg text-gray-600">
            Todavía no creaste ninguna postal.
          </p>
        ) : (
          topics.map((topic) => (
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
                      src={session.user.profileImage || "/default.jpg"}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{session.user.name}</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Calendar className="w-5 h-5" />
                    {formatDate(topic.createdAt)}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{topic.content}</p>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  {topic.replies.length} comentarios
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
