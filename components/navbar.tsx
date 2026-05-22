"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  Plus,
  User,
  Bell,
  Trash,
  LayoutList,
  Gamepad2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { UserSearch } from "@/components/UserSearch";

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

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

  // Cargar notificaciones admin (denuncias)
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadAdmin = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setAdminNotifs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    loadAdmin();
    const interval = setInterval(loadAdmin, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Marcar como leídas al abrir el dropdown de usuario
  useEffect(() => {
    if (open) {
      fetch("/api/notifications", { method: "PATCH" }).catch(console.error);
    }
  }, [open]);

  // Marcar como leídas al abrir el dropdown de admin
  useEffect(() => {
    if (adminOpen) {
      fetch("/api/admin/notifications", { method: "PATCH" }).catch(
        console.error,
      );
    }
  }, [adminOpen]);

  // efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target as Node)
      ) {
        setAdminOpen(false);
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
  const hasAdminUnread = adminNotifs.some((n) => !n.read);

  return (
    <nav className="bg-primary text-primary-foreground shadow-sm w-full">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center md:flex-row md:justify-between md:items-center gap-3">
        {/* Logo postal */}
        <div
          className="cursor-pointer"
          onClick={() => router.push(isAdmin ? "/admin" : "/")}
        >
          {/* <img
            className="h-16 mx-auto"
            src="/img/Postal.svg"
            alt="Logo Postal"
          /> */}
          <img
            className="h-16 mx-auto"
            src="/img/Postal2.svg"
            alt="Logo Postal"
          />
        </div>

        {/* Búsqueda visible en móvil */}
        {/*!isAdmin && (
          <div className="flex w-full max-w-xs">
            <UserSearch />
          </div>
        )*/}
        {/* Búsqueda en desktop */}
        {!isAdmin && <UserSearch />}
        <div className="md:flex items-center gap-7 hidden">
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
              onClick={() => router.push("/juego-del-dia")}
              className="h-12 text-base md:text-lg gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-5 h-5" />
              Juego del día
            </Button>
          )}

          {/* Botones solo para admin */}
          {isAdmin && (
            <>
              {/* Ver todas las postales */}
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/postales")}
                className="h-12 text-base md:text-lg gap-2 cursor-pointer"
              >
                <LayoutList className="w-5 h-5" />
                Ver postales
              </Button>

              {/* Avisos admin (denuncias) */}
              <div className="relative" ref={adminDropdownRef}>
                <Button
                  variant={hasAdminUnread ? "destructive" : "secondary"}
                  size="lg"
                  onClick={() => setAdminOpen((s) => !s)}
                  className="h-12 text-base md:text-lg gap-2 flex items-center cursor-pointer"
                >
                  <span className="hidden sm:inline">Avisos</span>
                  <Bell className="w-5 h-5" />
                  {hasAdminUnread && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse pointer-events-none">
                      {adminNotifs.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>

                {adminOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-3 space-y-2 z-50">
                    {adminNotifs.length === 0 ? (
                      <p className="text-sm text-gray-500">No hay denuncias</p>
                    ) : (
                      adminNotifs.map((n: any) => (
                        <div
                          key={n._id}
                          className={`p-2 rounded flex justify-between items-start cursor-pointer ${
                            n.read ? "bg-gray-100" : "bg-orange-100"
                          }`}
                          onClick={() => {
                            setAdminOpen(false);
                            router.push(n.link);
                          }}
                        >
                          <div className="flex-1 pr-2">
                            <p className="text-sm">{n.message}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(n.createdAt).toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Bell para usuarios normales */}
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
                    <p className="text-sm text-gray-500">
                      No tenés notificaciones
                    </p>
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
