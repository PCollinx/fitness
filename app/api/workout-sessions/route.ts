export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApiUser, ApiErrors } from "@/lib/auth/api-auth";

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await authenticateApiUser();
    
    if (error) {
      return error;
    }

    const body = await request.json();

    const { workoutId, startTime, endTime, duration, exercises } = body;

    if (!workoutId || !startTime || !endTime || !duration) {
      return ApiErrors.badRequest("Missing required session data");
    }

    // Verify the workout exists first
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!existingWorkout) {
      return ApiErrors.notFound("Workout");
    }

    // Validate and filter exercises before transaction
    const validExercises: any[] = [];
    if (exercises && Array.isArray(exercises)) {
      for (const [exerciseIndex, exercise] of exercises.entries()) {
        if (!exercise.exerciseId) {
          console.warn(
            `Skipping exercise ${exerciseIndex} - no exerciseId provided`
          );
          continue;
        }

        // Verify exercise exists
        const existingExercise = await prisma.exercise.findUnique({
          where: { id: exercise.exerciseId },
          select: { id: true }, // Only select id for efficiency
        });

        if (existingExercise) {
          validExercises.push({ ...exercise, order: exerciseIndex });
        } else {
          console.warn(`Exercise ${exercise.exerciseId} not found, skipping`);
        }
      }
    }

    // Create the workout session - simplified transaction
    const workoutSession = await prisma.$transaction(
      async (tx) => {
        // Create the main session record
        const newSession = await tx.workoutSession.create({
          data: {
            workoutId,
            userId: user.id,
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
      },
      {
        timeout: 10000, // Increase timeout to 10 seconds
      }
    );

    return NextResponse.json({
      success: true,
      message: "Workout session saved successfully",
      sessionId: workoutSession.id,
    });
  } catch (error) {
    console.error("Error saving workout session:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
