"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";

const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santiago del Estero",
  "Santa Fe",
  "Tierra del Fuego",
  "Tucumán",
];

export default function AdminUserPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    dni: "",
    email: "",
    fecnac: "",
    institucion: "",
    provincia: "",
    profileImage: "",
  });

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      setForm({
        name: data.name ?? "",
        lastname: data.lastname ?? "",
        username: data.username ?? "",
        dni: data.dni ?? "",
        email: data.email ?? "",
        fecnac: data.fecnac ? data.fecnac.slice(0, 10) : "",
        institucion: data.institucion ?? "",
        provincia: data.provincia ?? "",
        profileImage: data.profileImage ?? "",
      });
    }
    if (id) fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSave() {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Error al guardar");
        return;
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      setErrorMsg("Error de red");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    setResetting(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "Error al restablecer");
        return;
      }
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 5000);
    } catch {
      setErrorMsg("Error de red");
    } finally {
      setResetting(false);
    }
  }

  if (!form.name && !form.lastname)
    return <p className="mt-20 text-center text-xl">Cargando…</p>;

  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin")}
          className="mb-4 md:mb-6 h-9 md:h-12 text-sm md:text-lg gap-1 md:gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver al Inicio</span>
          <span className="sm:hidden">Volver</span>
        </Button>

        <Card className="max-w-4xl shadow-xl rounded-2xl m-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Perfil del usuario: {form.name} {form.lastname}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Foto de perfil */}
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={form.profileImage || "/default.jpg"}
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>

            {/* Campos editables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Columna izquierda */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground">
                  Nombre:
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  Apodo:
                </label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  Institución:
                </label>
                <Input
                  name="institucion"
                  value={form.institucion}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  DNI:
                </label>
                <Input
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  Email:
                </label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="font-bold"
                  placeholder="Sin email"
                />
              </div>

              {/* Columna derecha */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground">
                  Apellido:
                </label>
                <Input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  Fecha de nacimiento:
                </label>
                <Input
                  type="date"
                  name="fecnac"
                  value={form.fecnac}
                  onChange={handleChange}
                  className="font-bold"
                />

                <label className="text-sm font-semibold text-foreground">
                  Provincia:
                </label>
                <select
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm font-bold bg-background"
                >
                  <option value="">Seleccioná una provincia</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* Botón restablecer contraseña */}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100 transition font-semibold text-sm cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {resetting ? "Restableciendo…" : "Restablecer contraseña"}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}

            {/* Botón guardar */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-12 px-10 gap-2 text-base font-semibold cursor-pointer"
              >
                <Save className="w-5 h-5" />
                {saving ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modal "Cambios guardados" */}
      {saveSuccess && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold mb-2">✅ Cambios guardados</h2>
            <p className="text-gray-600">
              El perfil de{" "}
              <span className="font-semibold">
                {form.name} {form.lastname}
              </span>{" "}
              fue actualizado con éxito.
            </p>
          </div>
        </div>
      )}

      {/* Modal "Contraseña restablecida" */}
      {resetSuccess && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold mb-2">
              🔑 Contraseña restablecida
            </h2>
            <p className="text-gray-600">
              La contraseña de{" "}
              <span className="font-semibold">{form.name}</span> fue
              restablecida a <span className="font-mono font-bold">postal</span>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
