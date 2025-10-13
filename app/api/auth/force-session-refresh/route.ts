export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

/**
 * Force a session refresh by updating the user's timestamp
 * This causes the JWT callback to re-fetch user data on next request
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user's updatedAt timestamp to force JWT refresh
    await prisma.user.update({
      where: { email: session.user.email },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message:
        "Session refresh triggered. Please sign out and sign back in to see updated role.",
    });
  } catch (error) {
    console.error("Error forcing session refresh:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
