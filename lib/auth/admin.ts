import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function isUserAdmin(email?: string): Promise<boolean> {
  if (!email) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Use type assertion to access the role field until TypeScript is updated
    return (user as any)?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized - No session");
  }

  const isAdmin = await isUserAdmin(session.user.email);

  if (!isAdmin) {
    throw new Error("Forbidden - Admin access required");
  }

  return session;
}

export async function getAdminSession() {
  try {
    return await requireAdmin();
  } catch (error) {
    return null;
  }
}