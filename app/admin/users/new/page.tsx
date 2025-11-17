"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface UserForm {
  name: string;
  lastname: string;
  username: string;
  dni: string;
  email: string;
  password: string;
  fecnac: string;
  institucion: string;
  provincia: string;
}

export default function AddUserPage() {
  // lista de provincias
  const provincias = [
    "Buenos Aires",
    "Córdoba",
    "Santa Fe",
    "Mendoza",
    "Tucumán",
    "Salta",
    "Entre Ríos",
    "Misiones",
    "Chaco",
    "Formosa",
    "Jujuy",
    "Río Negro",
    "Neuquén",
    "Chubut",
    "San Juan",
    "San Luis",
    "La Pampa",
    "La Rioja",
    "Catamarca",
    "Santiago del Estero",
    "Corrientes",
    "Tierra del Fuego",
  ];

  //el useState para el form con la contraseña precargada
  const [form, setForm] = useState<UserForm>({
    name: "",
    lastname: "",
    username: "",
    dni: "",
    email: "",
    password: "postal",
    fecnac: "",
    institucion: "",
    provincia: provincias[0],
  });

  const [success, setSuccess] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //Que campos se exigen asi cambia el boton
  const requiredFields: (keyof UserForm)[] = [
    "name",
    "lastname",
    "username",
    "dni",
    "password",
  ];

  //Comprobación que el form este lleno
  const isFormValid = requiredFields.every(
    (k) => form[k] !== undefined && form[k].trim() !== ""
  );

  //Manejar el cambio en el form
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  //Envio del form
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Control del DNI
    const dniRegex = /^[0-9]{8}[FM]$/;
    if (!dniRegex.test(form.dni)) {
      setErrorMsg("El DNI debe tener 8 números seguidos de una letra F o M.");
      return;
    }

    //Control de fecha de nacimiento:
    const birthDate = new Date(form.fecnac);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Ajuste si aún no cumplió años este año
    const realAge =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0) ? age : age - 1;

    if (realAge < 40 || realAge > 115) {
      setErrorMsg("La fecha de nacimiento no es válida.");
      return;
    }

    //Si el form no es valido
    if (!isFormValid) return;

    //Si todo sale bien
    setLoading(true);
    setErrorMsg(null);

    //Intento del POST nuevo usuario
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      // console.log(data);

      // Si todo sale bien pongo el form en blanco. Excepto la contraseña.
      if (res.ok) {
        // guardo el nombre que creó para mostrar en el modal
        setCreatedName(form.name);

        // limpio el form
        setForm({
          name: "",
          lastname: "",
          username: "",
          dni: "",
          email: "",
          password: "postal",
          fecnac: "",
          institucion: "",
          provincia: "",
        });

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setCreatedName(null);
        }, 3500);
      } else {
        // mostrar mensaje de error si lo devuelve el backend
        setErrorMsg(data?.message || "Error al crear usuario");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-[700px]"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/default.jpg"
            alt="default profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col gap-3">
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="username"
              placeholder="Apodo"
              value={form.username=form.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="institucion"
              placeholder="Institución"
              value={form.institucion}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="dni"
              placeholder="DNI"
              value={form.dni}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="flex flex-col gap-3">
            <input
              name="lastname"
              placeholder="Apellido"
              value={form.lastname}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="date"
              name="fecnac"
              placeholder="Fecha de nacimiento"
              value={form.fecnac}
              onChange={handleChange}
              className="border p-2 rounded"
            />

             <select
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Seleccioná tu provincia</option>
              {provincias.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>

            <input
              name="password"
              placeholder="Contraseña"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={true}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 text-red-600 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`px-6 py-2 rounded-lg text-white 
              ${
                isFormValid && !loading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>

      {success && createdName && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[350px] animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold mb-3">Usuario agregado</h2>
            <p className="text-gray-600">
              El usuario <span className="font-semibold">{createdName}</span>{" "}
              fue creado con éxito.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
