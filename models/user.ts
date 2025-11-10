import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true },

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  // El select false del pass hace que no se devuelva por defecto en las consultas el pass.
  role: { type: String, default: "user" },
});

// Evita volver a compilar el modelo en hot reload
const User = models.User || mongoose.model("User", UserSchema);

export default User;
