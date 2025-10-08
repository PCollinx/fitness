import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Check database state
    const [
      workoutCount,
      exerciseCount,
      workoutExerciseCount,
      userCount,
      sampleWorkouts,
      sampleExercises
    ] = await Promise.all([
      prisma.workout.count(),
      prisma.exercise.count(),
      prisma.workoutExercise.count(),
      prisma.user.count(),
      prisma.workout.findMany({
        take: 3,
        include: {
          exercises: {
            include: {
              exercise: {
                select: { id: true, name: true, muscleGroup: true }
              }
            }
          }
        }
      }),
      prisma.exercise.findMany({
        take: 5,
        select: { id: true, name: true, muscleGroup: true }
      })
    ]);

    return NextResponse.json({
      counts: {
        workouts: workoutCount,
        exercises: exerciseCount,
        workoutExercises: workoutExerciseCount,
        users: userCount
      },
      sampleData: {
        workouts: sampleWorkouts,
        exercises: sampleExercises
      }
    });
  } catch (error) {
    console.error("Database debug error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}