import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch workout sessions from database
    const workoutSessions = await prisma.workoutSession.findMany({
      where: { userId: session.user.id },
      take: 10,
      orderBy: { startTime: "desc" },
      include: {
        workout: { select: { id: true, name: true } },
        exercises: {
          include: {
            exercise: { select: { id: true, name: true } },
            sets: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessions: workoutSessions,
    });
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { workoutId, startTime, endTime, elapsedTime, exercises, notes } =
      body;

    // First, ensure user exists in database
    await prisma.user.upsert({
      where: { id: session.user.id as string },
      update: {},
      create: {
        id: session.user.id as string,
        email: session.user.email!,
        name: session.user.name || session.user.email!,
      },
    });

    // Check if workout exists, create if not
    let workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      // Create a basic workout record to satisfy foreign key constraint
      workout = await prisma.workout.create({
        data: {
          id: workoutId,
          name: "Completed Workout",
          description: "Auto-generated workout from session",
          userId: session.user.id as string,
        },
      });
    } else {
      console.log("=== WORKOUT EXISTS ===", workout.name);
    }

    // Ensure all exercises exist in database
    for (const exercise of exercises || []) {
      if (exercise.exerciseId) {
        await prisma.exercise.upsert({
          where: { id: exercise.exerciseId },
          update: {},
          create: {
            id: exercise.exerciseId,
            name: exercise.name || "Unknown Exercise",
            description: "Auto-generated exercise from session",
            muscleGroup: "OTHER",
            difficulty: "BEGINNER",
          },
        });
      }
    }

    // Now create workout session
    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id as string,
        workoutId: workoutId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: elapsedTime,
        notes: notes || null,
        exercises: {
          create:
            exercises?.map((exercise: any, exerciseIndex: number) => ({
              exerciseId: exercise.exerciseId,
              order: exerciseIndex + 1,
              sets: {
                create:
                  exercise.sets?.map((set: any, setIndex: number) => ({
                    setNumber: setIndex + 1,
                    targetReps: set.targetReps || 0,
                    actualReps: set.actualReps,
                    targetWeight: set.targetWeight,
                    actualWeight: set.actualWeight,
                    completed: set.completed,
                    notes: set.notes,
                  })) || [],
              },
            })) || [],
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: workoutSession.id,
      message: "Workout session saved successfully",
      session: workoutSession,
    });
  } catch (error) {
    console.error("=== POST ERROR ===", error);
    return NextResponse.json(
      {
        error: "Failed to save workout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
