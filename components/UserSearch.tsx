"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useChat } from "./ChatContext";
import { useSession } from "next-auth/react";

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
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="flex items-center gap-2 bg-black/10 border border-white/20 rounded-full px-3 py-1.5 focus-within:border-white/60 focus-within:bg-white/20 transition">
        <Search size={14} className="text-white/60 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuario..."
          className="bg-transparent text-white placeholder:text-white/50 text-sm outline-none w-32 lg:w-44"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="text-white/60 hover:text-white transition shrink-0"
          >
            <X size={13} />
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
                <li key={user._id}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left border-b border-gray-50 last:border-0"
                    onClick={() => {
                      openChat({
                        id: user._id,
                        name: user.name,
                        lastname: user.lastname,
                        profileImage: user.profileImage,
                      });
                      clearSearch();
                    }}
                  >
                    <img
                      src={user.profileImage || "/default.jpg"}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name} {user.lastname}
                      </p>
                      <p className="text-xs text-gray-400">
                        @{user.username}
                      </p>
                    </div>
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
