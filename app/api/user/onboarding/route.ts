export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { completed } = await request.json();

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: "Completed must be a boolean value" },
        { status: 400 }
      );
    }

    // Get or create user and update onboarding status
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { onboardingCompleted: completed },
      create: {
        email: session.user.email,
        name: session.user.name || "Unknown",
        image: session.user.image,
        onboardingCompleted: completed,
      },
    });

    return NextResponse.json({
      success: true,
      onboardingCompleted: user.onboardingCompleted,
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding status" },
      { status: 500 }
    );
  }
}