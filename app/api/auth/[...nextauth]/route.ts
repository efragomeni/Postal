import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        //Buscamos el email
        //En mongoose, si en el modelo el campo tiene opcion select:false no se devuelve por defecto cuando se hace el .findOne(). el +password fuerza a mongoose q me incluya el campo en el resultado.
        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );
        if (!user) throw new Error("Usuario no encontrado");
        const valid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!valid) throw new Error("Contraseña incorrecta");

        //Si todo sale bien el us existe y el pass coincide, devolvemos los datos y los almacenamos en un token:
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    //Cuando se genera o renueva un token
    async jwt({ token, user }) {
      await connectDB();

      //Si acaba de iniciar sesion se asigna el token
      if (user) token.id = user.id;

      //Se verifica si el usuario sigue existiendo en la BD.
      const existingUser = await User.findById(token.id);
      if (!existingUser) {
        console.log("Usuario eliminado, token invalido");
        //Devuelve el token vacio --> queda invalidado
        return {};
      }

      return token;
    },
    //Por cada vez q se crea una sesion en el cliente.
    async session({ session, token }) {
      if (token && token.id) {
        session.user.id = token.id as string;
        return session
      } 
      return null;
    },
    /*async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },*/
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
