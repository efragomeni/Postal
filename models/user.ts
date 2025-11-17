import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: false },
    dni: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    profileImage: { type: String, default: "/default.jpg" },

    // Fecha de nacimiento
    fecnac: { type: Date },

    // Última vez que se generó automáticamente un post de cumpleaños
    lastBirthdayPost: { type: Date, default: null },

    //Comprar si primera sesion
    mustChangePassword: { type: Boolean, default: true },


    institucion: { type: String },
    provincia: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

