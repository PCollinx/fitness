export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received workout session data:", JSON.stringify(body, null, 2));
    
    const { workoutId, startTime, endTime, duration, exercises } = body;

    if (!workoutId || !startTime || !endTime || !duration) {
      console.error("Missing required data:", { workoutId, startTime, endTime, duration });
      return NextResponse.json({ error: "Missing required session data" }, { status: 400 });
    }

    // Verify the workout exists first
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: workoutId }
    });

    if (!existingWorkout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Validate and filter exercises before transaction
    const validExercises: any[] = [];
    if (exercises && Array.isArray(exercises)) {
      for (const [exerciseIndex, exercise] of exercises.entries()) {
        if (!exercise.exerciseId) {
          console.warn(`Skipping exercise ${exerciseIndex} - no exerciseId provided`);
          continue;
        }

        // Verify exercise exists
        const existingExercise = await prisma.exercise.findUnique({
          where: { id: exercise.exerciseId },
          select: { id: true } // Only select id for efficiency
        });

        if (existingExercise) {
          validExercises.push({ ...exercise, order: exerciseIndex });
        } else {
          console.warn(`Exercise ${exercise.exerciseId} not found, skipping`);
        }
      }
    }

    // Create the workout session - simplified transaction
    const workoutSession = await prisma.$transaction(async (tx) => {
      // Create the main session record
      const newSession = await tx.workoutSession.create({
        data: {
          workoutId,
          userId: session.user.id as string,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          duration: Math.floor(duration / 1000), // Convert to seconds
          notes: null,
        },
      });

      // Create session exercises and sets for valid exercises only
      for (const exercise of validExercises) {
        const sessionExercise = await tx.workoutSessionExercise.create({
          data: {
            sessionId: newSession.id,
            exerciseId: exercise.exerciseId,
            order: exercise.order,
          },
        });

        // Create sets for this exercise
        if (exercise.sets && Array.isArray(exercise.sets)) {
          for (const [setIndex, set] of exercise.sets.entries()) {
            await tx.workoutSessionSet.create({
              data: {
                sessionExerciseId: sessionExercise.id,
                setNumber: setIndex + 1,
                targetReps: set.targetReps || 0,
                actualReps: set.actualReps || set.targetReps || 0,
                targetWeight: set.targetWeight || null,
                actualWeight: set.actualWeight || set.targetWeight || null,
                completed: set.completed || false,
                notes: null,
                restTime: null,
              },
            });
          }
        }
      }

      return newSession;
    }, {
      timeout: 10000, // Increase timeout to 10 seconds
    });

    return NextResponse.json({ 
      message: "Workout session saved successfully", 
      sessionId: workoutSession.id 
    });

  } catch (error) {
    console.error("Error saving workout session:", error);
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}