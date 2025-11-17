import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      lastname: string;
      username: string;
      dni: string;
      role: string;
      institucion?: string;
      provincia?: string;
      fecnac?: string;
      profileImage?: string;
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    lastname: string;
    username: string;
    dni: string;
    role: string;
    institucion?: string;
    provincia?: string;
    fecnac?: string;
    profileImage?: string;
    mustChangePassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    lastname: string;
    username: string;
    dni: string;
    role: string;
    institucion?: string;
    provincia?: string;
    fecnac?: string;
    profileImage?: string;
    mustChangePassword?: boolean;
  }
}
