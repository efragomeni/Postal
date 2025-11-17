"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export default function AdminHome() {
  type Usuario = {
    _id: string;
    dni: string;
    lastname: string;
    name: string;
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  const [dni, setDni] = useState("");
  const [lastname, setLastname] = useState("");

  //Para el modal del delete:
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);

  //Funcion para mostrar el modal de eliminar y si esta seguro eliminar:
  async function eliminarUsuario() {
    if (!userToDelete) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userToDelete._id }),
      });

      if (!res.ok) throw new Error("Falló el borrado");

      // Actualiza la tabla
      setResultados((prev) => prev.filter((u) => u._id !== userToDelete._id));

      // Cerrar modal
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error al borrar usuario:", err);
    } finally {
      setDeleting(false);
    }
  }

  const [resultados, setResultados] = useState<Usuario[]>([]);

  if (status === "loading")
    return <p className="mt-20 text-center text-xl">Cargando…</p>;

  if (session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const buscar = async () => {
    const res = await fetch("/api/admin/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni, lastname }),
    });
    console.log(res);
    const data = await res.json();
    console.log(data.usuarios);

    setResultados(data.usuarios || []);
  };

  return (
    <div className="p-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">
        Panel de Administración 🛡️
      </h1>

      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => router.push("/admin/users/new")}
        >
          Agregar nuevo usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BUSCADOR A LA IZQUIERDA */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Buscar usuario</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">DNI</label>
              <Input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 40233444"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Apellido</label>
              <Input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Ej: González"
              />
            </div>

            <Button
              variant="outline"
              onClick={buscar}
              className="mt-2 cursor-pointer"
            >
              Buscar
            </Button>
          </CardContent>
        </Card>

        {/* TABLA A LA DERECHA */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>

          <CardContent>
            {resultados.length === 0 ? (
              <p className="text-muted-foreground">
                No hay resultados. Realizá una búsqueda.
              </p>
            ) : (
              <table className="w-full text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border text-center ">DNI</th>
                    <th className="p-2 border text-center ">Apellido</th>
                    <th className="p-2 border text-center ">Nombre</th>
                    <th className="p-2 border text-center ">Perfil</th>
                    <th className="p-2 border text-center ">Eliminar</th>
                  </tr>
                </thead>

                <tbody>
                  {resultados.map((u) => (
                    <tr key={u._id}>
                      <td className="p-2 border text-center ">{u.dni}</td>
                      <td className="p-2 border text-center ">{u.lastname}</td>
                      <td className="p-2 border text-center ">{u.name}</td>
                      <td className="p-2 border text-center">
                        {/* Boton para ver el perfil */}
                        <Button
                          className="cursor-pointer"
                          variant="secondary"
                          onClick={() => router.push(`/admin/users/${u._id}`)}
                        >
                          Ver
                        </Button>
                      </td>

                      <td className="p-2 border text-center">
                        {/* Boton para eliminar usuarios */}
                        <Button
                          className="cursor-pointer"
                          variant="destructive"
                          onClick={() => {
                            setUserToDelete(u);
                            setShowDeleteModal(true);
                          }}
                        >
                          <X />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[380px] text-center animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold mb-4">Eliminar usuario</h2>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro que querés eliminar a{" "}
              <span className="font-semibold">
                {userToDelete.name} {userToDelete.lastname}
              </span>
              ?<br />
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
                onClick={eliminarUsuario}
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
