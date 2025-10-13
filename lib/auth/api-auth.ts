import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Standard authentication and user lookup for API routes
 * Returns the authenticated user's database record or throws an appropriate error response
 */
export async function authenticateApiUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      ),
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      ),
      user: null,
    };
  }

  return {
    error: null,
    user,
    session,
  };
}

/**
 * Get current user ID for ownership checks (lightweight version)
 * Returns null if user is not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id || null;
}

/**
 * Standard error responses for consistency
 */
export const ApiErrors = {
  unauthorized: () =>
    NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    ),
  userNotFound: () =>
    NextResponse.json({ error: "User not found" }, { status: 404 }),
  forbidden: () =>
    NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  notFound: (resource = "Resource") =>
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),
  badRequest: (message = "Invalid request data") =>
    NextResponse.json({ error: message }, { status: 400 }),
  internalError: (message = "Internal server error") =>
    NextResponse.json({ error: message }, { status: 500 }),
};