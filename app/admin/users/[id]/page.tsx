"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function AdminUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  //Para formatear la fecha:
  const fechaNacFormateada = user?.fecnac
    ? new Date(user.fecnac).toLocaleDateString("es-AR")
    : "";

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [id]);

  if (!user) return <p>Cargando…</p>;

  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin")}
          className="mb-6 h-12 text-base md:text-lg gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio
        </Button>

        <Card className=" max-w-4xl shadow-xl rounded-2xl m-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Perfil del usuario: {user.name} {user.lastname}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={user.profileImage}
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Columna izq. */}
              <div className="flex flex-col gap-3">
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="name"
                >
                  Nombre:
                </label>
                <Input
                  name="name"
                  value={user.name}
                  disabled
                  className=" font-bold "
                ></Input>
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="username"
                >
                  Apodo:
                </label>
                <Input
                  name="username"
                  value={user.username}
                  disabled
                  className=" font-bold "
                ></Input>
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="institucion"
                >
                  Institución:
                </label>
                <Input
                  name="institucion"
                  value={user.institucion}
                  disabled
                  className=" font-bold "
                ></Input>
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="dni"
                >
                  DNI:
                </label>
                <Input
                  name="dni"
                  value={user.dni}
                  disabled
                  className=" font-bold "
                ></Input>
              </div>
              {/* Columna Der. */}
              <div className="flex flex-col gap-3">
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="lastname"
                >
                  Apellido:
                </label>
                <Input
                  name="lastname"
                  value={user.lastname}
                  disabled
                  className=" font-bold "
                ></Input>
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="fecnac"
                >
                  Fecha de nacimiento:
                </label>
                <Input
                  name="fecnac"
                  value={fechaNacFormateada}
                  disabled
                  className=" font-bold "
                ></Input>
                <label
                  className=" text-sm font-semibold text-foreground "
                  htmlFor="provincia"
                >
                  Provincia:
                </label>
                <Input
                  name="provincia"
                  value={user.provincia}
                  disabled
                  className=" font-bold "
                ></Input>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
