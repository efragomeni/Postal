"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useChat } from "./ChatContext";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

export function ChatWindow() {
  const { activeChat, closeChat } = useChat();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    if (!activeChat) return;
    try {
      const res = await fetch(`/api/messages/${activeChat.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      setInput("");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChat || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${activeChat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        setInput("");
        await fetchMessages();
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    } finally {
      setSending(false);
    }
  };

  if (!activeChat) return null;

  const myId = session?.user?.id;

  return (
    <div className="fixed bottom-20 right-2 md:bottom-6 md:right-6 w-[calc(100vw-1rem)] max-w-[320px] md:w-80 h-[360px] md:h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col z-[200] border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: "var(--color-principal)" }}
      >
        <img
          src={activeChat.profileImage || "/default.jpg"}
          alt={activeChat.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-white/40 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">
            {activeChat.name} {activeChat.lastname}
          </p>
          <p className="text-[10px] text-white/60">Mensaje directo</p>
        </div>
        <button
          onClick={closeChat}
          className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1 transition shrink-0"
          title="Cerrar chat"
        >
          <X size={17} />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-400 text-sm">
              Empezá la conversación 👋
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe =
            msg.sender === myId || String(msg.sender) === String(myId);
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-snug break-words ${
                  isMe
                    ? "text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                }`}
                style={isMe ? { background: "var(--color-principal)" } : {}}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-2 bg-white flex gap-2 items-center shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && sendMessage()
          }
          placeholder="Escribí un mensaje..."
          className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-[var(--color-acento)] bg-gray-50 transition"
        />
        {/* Boton de enviar */}
        <Button
          size="sm"
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="inline-flex items-center justify-center rounded-full w-9 h-9 p-0 shrink-0 transition text-white"
          style={{ background: "var(--color-principal)" }}
          title="Enviar"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
