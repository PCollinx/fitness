import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

        // Transform the data
    const transformedWorkout = {
      id: workout.id,
      name: workout.name,
      description: workout.description,
      image: workout.image,
      isOwner: workout.userId === session.user?.id,
      author: workout.user.name || "Unknown",
      exerciseCount: workout.exercises.length,
      muscleGroups: [...new Set(workout.exercises.map((ex) => ex.exercise.muscleGroup))],
      difficulty: workout.exercises[0]?.exercise.difficulty || null,
      timesCompleted: 0, // This would need to be calculated from WorkoutSession model
      createdAt: workout.createdAt.toISOString(),
      exercises: workout.exercises.map((workoutExercise) => ({
        id: workoutExercise.id,
        exerciseId: workoutExercise.exercise.id,
        name: workoutExercise.exercise.name,
        muscleGroup: workoutExercise.exercise.muscleGroup || 'other',
        sets: workoutExercise.sets,
        reps: workoutExercise.reps,
        weight: workoutExercise.weight,
        order: workoutExercise.order,
      })),
    };

    return NextResponse.json(transformedWorkout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, exercises } = body;

    if (!name || !exercises || !Array.isArray(exercises)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Check if the workout exists and is owned by the user
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        userId: true 
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (existingWorkout.userId !== session.user?.id) {
      return NextResponse.json({ error: "Not authorized to update this workout" }, { status: 403 });
    }

    // Update the workout in a transaction
    const updatedWorkout = await prisma.$transaction(async (tx) => {
      // Update workout basic info
      const workout = await tx.workout.update({
        where: { id: params.id },
        data: {
          name,
          description: description || null,
          updatedAt: new Date(),
        },
      });

      // Delete existing exercises
      await tx.workoutExercise.deleteMany({
        where: { workoutId: params.id },
      });

      // Create new exercises
      for (const [index, exercise] of exercises.entries()) {
        // Find the exercise in the database
        const dbExercise = await tx.exercise.findFirst({
          where: { name: exercise.name },
        });

        if (dbExercise) {
          await tx.workoutExercise.create({
            data: {
              workoutId: params.id,
              exerciseId: dbExercise.id,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight || null,
              order: index,
            },
          });
        }
      }

      return workout;
    });

    return NextResponse.json({ message: "Workout updated successfully", workout: updatedWorkout });
  } catch (error) {
    console.error("Error updating workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

        // Check if the workout exists and is owned by the user
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        userId: true, 
        name: true 
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (workout.userId !== session.user?.id) {
      return NextResponse.json({ error: "Not authorized to delete this workout" }, { status: 403 });
    }

    // Delete the workout (exercises will be deleted due to CASCADE)
    await prisma.workout.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}