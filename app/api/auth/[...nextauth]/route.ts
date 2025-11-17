//Archivo Bisagra/puente entre authOptions y el enrutador de Next.js. Expone la logica.
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
