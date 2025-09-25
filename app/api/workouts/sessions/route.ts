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
  console.log("=== POST METHOD ENTRY ===");

  try {
    // Get authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("=== USER AUTHENTICATED ===", session.user.email);

    // Parse request body
    const body = await request.json();
    const { workoutId, startTime, endTime, elapsedTime, exercises, notes } =
      body;

    console.log("=== CREATING WORKOUT SESSION ===", {
      workoutId,
      exerciseCount: exercises?.length,
    });

    // Create workout session directly without validating workout exists
    // This allows us to save sessions for any workout ID
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

    console.log("=== WORKOUT SESSION CREATED ===", workoutSession.id);

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
