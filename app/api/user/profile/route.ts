export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with fitness goals and calculate workout stats
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        fitnessGoals: true,
        workoutSessions: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate workout stats
    const workoutsCompleted = user.workoutSessions.length;

    // Calculate streak (simplified - consecutive days with workouts)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakDays = 0;
    let currentDate = new Date(today);

    // Get unique workout dates in descending order
    const workoutDates = [
      ...new Set(
        user.workoutSessions
          .map((session: any) => {
            const date = new Date(session.startTime);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
          })
          .sort((a: number, b: number) => b - a)
      ),
    ].map((timestamp: number) => new Date(timestamp));

    // Calculate streak from today backwards
    for (const workoutDate of workoutDates) {
      if (workoutDate.getTime() === currentDate.getTime()) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (workoutDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    // Transform user data to match frontend expectations
    const userProfile = {
      id: user.id,
      name: user.name || "Fitness Enthusiast",
      email: user.email,
      image: user.image,
      bio:
        user.bio ||
        "Fitness enthusiast passionate about strength training and nutrition.",
      weight: user.weight ? `${user.weight} kg` : "70 kg",
      height: user.height ? `${user.height} cm` : "175 cm",
      fitnessLevel: (user as any).fitnessLevel || "Beginner",
      fitnessGoals: user.fitnessGoals.map((goal: any) => goal.goalType),
      dateJoined: user.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      workoutsCompleted: workoutsCompleted,
      streakDays: streakDays,
      lastUpdated: user.updatedAt.toISOString(),
      onboardingCompleted: user.onboardingCompleted,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, weight, height, fitnessLevel, fitnessGoals } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Parse numeric values from strings (remove units)
    let weightNum: number | null = null;
    let heightNum: number | null = null;

    if (weight) {
      const weightMatch = weight.match(/(\d+(?:\.\d+)?)/);
      if (weightMatch) {
        weightNum = parseFloat(weightMatch[1]);
      }
    }

    if (height) {
      const heightMatch = height.match(/(\d+(?:\.\d+)?)/);
      if (heightMatch) {
        heightNum = parseFloat(heightMatch[1]);
      }
    }

    // Update user profile in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Upsert user (create if doesn't exist, update if exists)
      const user = await tx.user.upsert({
        where: { email: session.user!.email },
        create: {
          email: session.user!.email,
          name,
          bio,
          weight: weightNum,
          height: heightNum,
          fitnessLevel,
          onboardingCompleted: false,
        } as any,
        update: {
          name,
          bio,
          weight: weightNum,
          height: heightNum,
          fitnessLevel,
          updatedAt: new Date(),
        } as any,
      });

      // Update fitness goals if provided
      if (fitnessGoals && Array.isArray(fitnessGoals)) {
        // Delete existing fitness goals
        await tx.userFitnessGoal.deleteMany({
          where: { userId: user.id },
        });

        // Create new fitness goals
        if (fitnessGoals.length > 0) {
          await tx.userFitnessGoal.createMany({
            data: fitnessGoals.map((goalType: string) => ({
              userId: user.id,
              goalType,
            })),
          });
        }
      }

      return user;
    });

    // Fetch updated user with fitness goals for response
    const userWithGoals = await prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        fitnessGoals: true,
      },
    });

    if (!userWithGoals) {
      throw new Error("User not found after update");
    }

    // Transform response to match frontend expectations
    const userProfile = {
      id: userWithGoals.id,
      name: userWithGoals.name || "Fitness Enthusiast",
      email: userWithGoals.email,
      image: userWithGoals.image,
      bio: userWithGoals.bio || "",
      weight: userWithGoals.weight ? `${userWithGoals.weight} kg` : "70 kg",
      height: userWithGoals.height ? `${userWithGoals.height} cm` : "175 cm",
      fitnessLevel: (userWithGoals as any).fitnessLevel || "Beginner",
      fitnessGoals: userWithGoals.fitnessGoals.map(
        (goal: any) => goal.goalType
      ),
      dateJoined: userWithGoals.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      workoutsCompleted: (userWithGoals as any).workoutsCompleted || 0,
      streakDays: (userWithGoals as any).streakDays || 0,
      lastUpdated: userWithGoals.updatedAt.toISOString(),
      onboardingCompleted: userWithGoals.onboardingCompleted,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        error: "Failed to update user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
