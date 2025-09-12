import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

const handler = NextAuth(authOptions);

// Export Next.js 14 App Router compatible handlers
export { handler as GET, handler as POST };
