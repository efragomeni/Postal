"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Perfil() {
  const router = useRouter();

  const { data: session, update } = useSession();
  //Para ver q usuario esta si admin o user
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  //Para formatear la fecha:
  const fechaNacFormateada = user?.fecnac
    ? new Date(user.fecnac).toLocaleDateString("es-AR")
    : "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [msg, setMsg] = useState("");

  const [newPhotoPreview, setNewPhotoPreview] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newUsername, setNewUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //-----------------
  //--------- PRUEBAS
  //-----------------

  useEffect(() => {
    if (session?.user?.username) {
      setNewUsername(session.user.username);
    }
  }, [session?.user?.username]);

  //-----------------
  //--------- PRUEBAS
  //-----------------
  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewPhotoFile(file);
    setNewPhotoPreview(URL.createObjectURL(file)); // preview inmediata
  }

  async function uploadImage(file: File): Promise<string> {
    const signRes = await fetch("/api/upload/sign");
    const { timestamp, signature, apiKey, cloudName } = await signRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form }
    );

    const data = await uploadRes.json();
    return data.secure_url;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMsg("");

    let updatedPhoto = false;
    let updatedPassword = false;
    let updateUsername = false;

    setLoading(true);

    // Validar contraseña si se intenta modificar
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
      setPasswordError("");
    }

    const updates: any = {};

    // Foto
    if (newPhotoFile) {
      const imageUrl = await uploadImage(newPhotoFile);
      updates.newPhoto = imageUrl;
      console.log("imagenUrl", imageUrl);
      updatedPhoto = true;
    }

    // Contraseña
    if (newPassword) {
      updates.newPassword = newPassword;
      updatedPassword = true;
    }

    if (newUsername) {
      updates.newUsername = newUsername;
      updateUsername = true;
    }

    // Si no hay nada que actualizar
    if (!updatedPhoto && !updatedPassword && !updateUsername) {
      setMsg("No hay cambios para guardar");
      setLoading(false);
      return;
    }

    // Enviar PATCH
    const res = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();

    if (res.ok) {
      await update({
        user: {
          ...session!.user,
          profileImage: data.profileImage,
          mustChangePassword: false,
          username: data.username,
        },
      });
      console.log("session after update:", {
        ...session,
        user: {
          ...session?.user,
          profileImage: data.profileImage,
          username: data.username,
        },
      });

      if (updatedPhoto || updatedPassword || updateUsername)
        setMsg("Perfil actualizado con éxito");
      // else if (updatedPhoto) setMsg("Foto actualizada");
      // else if (updatedPassword) setMsg("Contraseña actualizada");

      // limpiar campos
      setNewPhotoFile(null);
      setNewPhotoPreview("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMsg("Error al guardar cambios");
    }

    setLoading(false);
  }

  const displayImage =
    newPhotoPreview || session?.user?.profileImage || "/default.jpg";
  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/admin")}
            className="mb-6 h-12 text-base md:text-lg gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="mb-6 h-12 text-base md:text-lg gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Button>
        )}

        <Card className="max-w-4xl shadow-xl rounded-2xl m-auto">
          <CardHeader className="text-center">
            {isAdmin && (
              <CardTitle className="text-xl font-bold">
                Perfil de administrador de:
              </CardTitle>
            )}
            {!isAdmin && (
              <CardTitle className="text-xl font-bold">Perfil de:</CardTitle>
            )}
            <span className="text-gray-500">{session?.user?.name}</span>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Foto */}
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={displayImage}
                className="w-full h-full object-cover rounded-full shadow-md"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
            {!isAdmin && (
              <CardContent className="space-y-8">
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
                      value={user?.name}
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
                      placeholder={user?.username}
                      value={newUsername}
                      // value={user?.username}
                      onChange={(e) => setNewUsername(e.target.value)}
                    
                      className="text-foreground font-bold"
                    ></Input>
                    <label
                      className=" text-sm font-semibold text-foreground "
                      htmlFor="institucion"
                    >
                      Institución:
                    </label>
                    <Input
                      name="institucion"
                      value={user?.institucion}
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
                      value={user?.dni}
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
                      value={user?.lastname}
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
                      value={user?.provincia}
                      disabled
                      className=" font-bold "
                    ></Input>
                  </div>
                </div>
              </CardContent>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-full w-4xl m-auto"
            >
              {/* Nueva contraseña */}
              <div>
                <p className="text-sm font-medium mb-1">Nueva contraseña</p>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Repetir contraseña */}
              <div>
                <p className="text-sm font-medium mb-1">Repetir contraseña</p>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full cursor-pointer" variant="outline">
                Guardar cambios
              </Button>
            </form>

            {msg && (
              <p className="text-center text-sm text-green-600 font-medium">
                {msg}
              </p>
            )}
            {passwordError && (
              <p className="text-center text-sm text-red-600 font-medium">
                {passwordError}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
