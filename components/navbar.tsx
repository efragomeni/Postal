"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Plus, User, Bell, Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const dropdownRef=useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n: any) => n._id !== id));
    } catch (err) {
      console.error("Error al borrar notificación", err);
    }
  };

  // Cargar notificaciones iniciales y cada 60 segundos
  useEffect(() => {
    if (!user || user.role === "admin") return;

    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    const interval = setInterval(load, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, [user]);

  // Marcar como leídas al abrir el dropdown
  useEffect(() => {
    if (open) {
      fetch("/api/notifications", { method: "PATCH" }).catch(console.error);
    }
  }, [open]);

  // efecto para cerrar dropdown al hacer click fuera
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdownRef]);

  if (!user) return null;
  const isAdmin = user.role === "admin";
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <nav className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center md:flex-row md:justify-between md:items-center">
        <div className="cursor-pointer mb-3 md:mb-0" onClick={() => router.push(isAdmin ? "/admin" : "/")}>
          <img className="h-20 mx-auto" src="/img/Postal.svg" alt="Logo Postal" />
        </div>

        <div className="hidden md:flex items-center gap-7">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push(isAdmin ? "/admin" : "/")}
            className="h-12 text-base md:text-lg gap-2 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Inicio
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push(`/perfil/${user.id}`)}
            className="h-12 text-base md:text-lg gap-2 cursor-pointer"
          >
            <User className="w-5 h-5" />
            Perfil
          </Button>

          {!isAdmin && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/crear-tema")}
              className="h-12 text-base md:text-lg gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Nueva postal
            </Button>
          )}

          {!isAdmin && (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant={hasUnread ? "destructive" : "secondary"} // cambia color si hay notificaciones nuevas
                size="lg"
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-haspopup="true"
                className={`h-12 text-base md:text-lg gap-2 flex items-center transition-colors duration-300 cursor-pointer`}
              >
                <span className="hidden sm:inline">Avisos</span>
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse pointer-events-none cursor-pointer">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-3 space-y-2 z-50"
                  role="menu"
                  aria-label="Notificaciones"
                >
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No tenés notificaciones</p>
                  ) : (
                    notifications.map((n: any) => (
                      <div
                        key={n._id}
                        className={`p-2 rounded flex justify-between items-start ${n.read ? "bg-gray-100" : "bg-blue-100"}`}
                        role="menuitem"
                      >
                        <div
                          className="cursor-pointer flex-1 pr-2"
                          onClick={() => {
                            setOpen(false);
                            router.push(n.link);
                          }}
                        >
                          <p className="text-sm">{n.message}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(n.createdAt).toLocaleString("es-AR")}
                          </span>
                        </div>

                        <button
                          title="Eliminar notificación"
                          className="ml-2 mt-1 text-gray-600 hover:text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n._id);
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <Button
            variant="secondary"
            size="lg"
            onClick={handleLogout}
            className="h-12 text-base md:text-lg gap-2 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </Button>
        </div>
      </div>
    </nav>
  );
}