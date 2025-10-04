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

    const { goals } = await request.json();

    if (!Array.isArray(goals) || goals.length === 0) {
      return NextResponse.json(
        { error: "Goals array is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create user if not exists (for OAuth users)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || "Unknown",
          image: session.user.image,
          onboardingCompleted: false, // Explicitly set to false for new users
        },
      });
    }

    // Delete existing fitness goals for this user
    await prisma.userFitnessGoal.deleteMany({
      where: { userId: user.id },
    });

    // Create new fitness goals
    const fitnessGoals = await prisma.userFitnessGoal.createMany({
      data: goals.map((goalType: string) => ({
        userId: user.id,
        goalType,
      })),
    });

    return NextResponse.json({
      success: true,
      goalsCreated: fitnessGoals.count,
    });
  } catch (error) {
    console.error("Error saving fitness goals:", error);
    return NextResponse.json(
      { error: "Failed to save fitness goals" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with their fitness goals
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        fitnessGoals: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      goals: user.fitnessGoals.map(goal => goal.goalType),
      onboardingCompleted: user.onboardingCompleted,
    });
  } catch (error) {
    console.error("Error fetching fitness goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch fitness goals" },
      { status: 500 }
    );
  }
}