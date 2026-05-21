"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MessageCircle } from "lucide-react";
import { useChat } from "./ChatContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface UserResult {
  _id: string;
  name: string;
  lastname: string;
  username: string;
  profileImage?: string;
}

export function UserSearch() {
  const { data: session } = useSession();
  const { openChat } = useChat();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cerrar al click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.users);
          setOpen(true);
        }
      } catch (err) {
        console.error("Error en búsqueda:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  if (!session?.user || session.user.role === "admin") return null;

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    // No me convence el w-full me queda raro en mobile. 
    <div ref={containerRef} className="relative w-full md:w-auto"> 
      {/* Input */}
      <div className="flex items-center gap-2 bg-white border border-[#0f2e59] rounded-full px-3 py-2 focus-within:border-[#0f2e59] transition w-36 lg:w-72">
        <Search size={16} className="text-[#0f2e59] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuario..."
          className="bg-transparent text-[#0f2e59] placeholder:text-[#0f2e59]/70 text-base font-semibold outline-none w-36 lg:w-52"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="text-[#0f2e59] hover:text-[#0f2e59]/70 transition shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown resultados */}
      {open && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[300] overflow-hidden">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-5">
              Buscando...
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-5">
              Sin resultados para "{query}"
            </p>
          ) : (
            <ul>
              {results.map((user) => (
                <li key={user._id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50 transition flex items-center justify-between px-4 py-3">
                  {/* Navega a las postales del usuario */}
                  <Link
                    href={`/postales-de/${user._id}`}
                    onClick={clearSearch}
                    className="flex items-center gap-3 min-w-0 flex-1 group cursor-pointer"
                  >
                    <img
                      src={user.profileImage || "/default.jpg"}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="relative inline-block">
                        <p className="text-sm font-semibold text-gray-800 transition">
                          {user.name} {user.lastname}
                        </p>
                        <span className="absolute bottom-0 left-1/2 h-[1px] w-0 bg-[#0f2e59] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                      </div>
                      <p className="text-xs text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                  
                  {/* Botón para iniciar chat */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openChat({
                        id: user._id,
                        name: user.name,
                        lastname: user.lastname,
                        profileImage: user.profileImage,
                      });
                      clearSearch();
                    }}
                    title="Enviar mensaje"
                    className="shrink-0 ml-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-color-principal hover:bg-primary/20 transition cursor-pointer font-medium text-xs border border-color-principal/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
