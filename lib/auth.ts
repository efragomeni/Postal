import { type NextAuthOptions } from "next-auth"; //"molde" xa q NextAuth lo reconozca.
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "./db";
import User from "@/models/user";

export const authOptions: NextAuthOptions = {
  //Proveedor:valido mis propias credenciales
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        dni: { label: "DNI", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //Autorizo o no dependiendo mis reglas.
      async authorize(credentials) {
        try {
          const { dni, password } = credentials;

          if (!dni || !password) return null;

          await connectDB();

          const user = await User.findOne({ dni }).select("+password");
          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          // DEVOLVEMOS TODO LO QUE QUEREMOS TENER EN SESSION.USER
          return {
            id: user._id.toString(),
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            dni: user.dni,
            role: user.role,
            email: user.email,
            profileImage: user.profileImage,
            institucion: user.institucion,
            provincia: user.provincia,
            fecnac: user.fecnac ? user.fecnac.toISOString() : "",
            mustChangePassword: user.mustChangePassword,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],

  //Pagina de login propia
  pages: { signIn: "/login" },
  //Las sesiones son via JWT no BD
  session: { strategy: "jwt" },
  //Clave secreta para firmar los tokens.
  secret: process.env.NEXTAUTH_SECRET,

  //Funciones llamadas automagicamente en momentos especificos.
  callbacks: {
    async session({ session, token }) {
      // El front solo va a leer los datos q se le pasan aca.
      session.user = {
        id: token.id,
        name: token.name,
        lastname: token.lastname,
        username: token.username,
        dni: token.dni,
        institucion: token.institucion,
        provincia: token.provincia,
        fecnac: token.fecnac,
        role: token.role,
        //email: token.email,
        profileImage: token.profileImage,
        mustChangePassword: token.mustChangePassword,
      };

      return session;
    },
    //Como se genera y actualiza el token
    async jwt({ token, user, trigger, session }) {
      // Nace el token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.lastname = user.lastname;
        token.username = user.username;
        token.dni = user.dni;
        token.institucion = user.institucion;
        token.provincia = user.provincia;
        token.fecnac = user.fecnac;
        token.role = user.role;
        //token.email = user.email;
        token.profileImage = user.profileImage;
        token.mustChangePassword = user.mustChangePassword;
      }

      // Cuando update() es llamado desde el front
      if (trigger === "update" && session?.user) {
        token.profileImage = session.user.profileImage;
        token.mustChangePassword = session.user.mustChangePassword;
        token.username = session.user.username;
      }

      return token;
    },
  },
};
