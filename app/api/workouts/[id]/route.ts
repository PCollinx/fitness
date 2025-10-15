import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import {
  authenticateApiUser,
  ApiErrors,
  getCurrentUserId,
} from "@/lib/auth/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return ApiErrors.unauthorized();
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
      return ApiErrors.notFound("Workout");
    }

    // Get current user ID for ownership check
    const currentUserId = await getCurrentUserId();

    // Debug logging for ownership check

    // Transform the data
    const transformedWorkout = {
      id: workout.id,
      name: workout.name,
      description: workout.description,
      image: workout.image,
      isOwner: currentUserId ? workout.userId === currentUserId : false,
      author: workout.user.name || "Unknown",
      exerciseCount: workout.exercises.length,
      muscleGroups: [
        ...new Set(workout.exercises.map((ex) => ex.exercise.muscleGroup)),
      ],
      difficulty: workout.exercises[0]?.exercise.difficulty || null,
      timesCompleted: 0, // This would need to be calculated from WorkoutSession model
      createdAt: workout.createdAt.toISOString(),
      exercises: workout.exercises.map((workoutExercise) => ({
        id: workoutExercise.id,
        exerciseId: workoutExercise.exercise.id,
        name: workoutExercise.exercise.name,
        muscleGroup: workoutExercise.exercise.muscleGroup || "other",
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
    const { error, user } = await authenticateApiUser();

    if (error) {
      return error;
    }

    const body = await request.json();
    const { name, description, exercises, public: isPublic } = body;

    if (!name || !exercises || !Array.isArray(exercises)) {
      return ApiErrors.badRequest("Invalid request data");
    }

    // Check if the workout exists and is owned by the user
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingWorkout) {
      return ApiErrors.notFound("Workout");
    }

    if (existingWorkout.userId !== user.id) {
      return ApiErrors.forbidden();
    }

    // Update the workout in a transaction
    const updatedWorkout = await prisma.$transaction(async (tx) => {
      // Update workout basic info
      const workout = await tx.workout.update({
        where: { id: params.id },
        data: {
          name,
          description: description || null,
          public: isPublic !== undefined ? isPublic : false,
          updatedAt: new Date(),
        },
      });

      // Delete existing exercises
      await tx.workoutExercise.deleteMany({
        where: { workoutId: params.id },
      });

      // Create new exercises
      for (const [index, exercise] of exercises.entries()) {
        // Use exerciseId if provided, otherwise fall back to finding by name
        const exerciseId = exercise.exerciseId || exercise.name;

        if (!exerciseId) {
          console.warn(`Exercise at index ${index} has no exerciseId or name`);
          continue;
        }

        // Verify the exercise exists
        const dbExercise = await tx.exercise.findUnique({
          where: { id: exerciseId },
        });

        if (dbExercise) {
          await tx.workoutExercise.create({
            data: {
              workoutId: params.id,
              exerciseId: dbExercise.id,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight || null,
              order: exercise.order !== undefined ? exercise.order : index,
            },
          });
        } else {
          console.warn(`Exercise with ID ${exerciseId} not found`);
        }
      }

      return workout;
    });

    return NextResponse.json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
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
    const { error, user } = await authenticateApiUser();

    if (error) {
      return error;
    }

    // Check if the workout exists and is owned by the user
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
        name: true,
      },
    });

    if (!workout) {
      return ApiErrors.notFound("Workout");
    }

    if (workout.userId !== user.id) {
      return ApiErrors.forbidden();
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await authenticateApiUser();

    if (error) {
      return error;
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return ApiErrors.badRequest("Image URL is required");
    }

    // Check if user owns the workout
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existingWorkout) {
      return ApiErrors.notFound("Workout");
    }

    if (existingWorkout.userId !== user.id) {
      return ApiErrors.forbidden();
    }

    // Update the workout image
    const updatedWorkout = await prisma.workout.update({
      where: { id: params.id },
      data: { image },
      select: { id: true, image: true },
    });

    return NextResponse.json({
      success: true,
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error("Error updating workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
