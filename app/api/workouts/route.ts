export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

interface WorkoutExerciseInput {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
  order: number;
}

interface CreateWorkoutInput {
  name: string;
  description?: string;
  exercises: WorkoutExerciseInput[];
  image?: string;
  public?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session in workout POST:", session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const { name, description, exercises, image, public: isPublic }: CreateWorkoutInput = await request.json();

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Workout name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(exercises) || exercises.length < 3) {
      return NextResponse.json(
        { error: "Workout must contain at least 3 exercises" },
        { status: 400 }
      );
    }

    // Validate each exercise
    for (const exercise of exercises) {
      if (!exercise.exerciseId || exercise.sets <= 0 || exercise.reps <= 0) {
        return NextResponse.json(
          { error: "Each exercise must have valid exerciseId, sets, and reps" },
          { status: 400 }
        );
      }
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found, creating new user for:", session.user.email);
      // Create user if not exists (for OAuth users)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || "Unknown",
          image: session.user.image,
        },
      });
    }

    // Verify all exercises exist
    const exerciseIds = exercises.map(e => e.exerciseId);
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true, name: true, muscleGroup: true },
    });

    if (existingExercises.length !== exerciseIds.length) {
      return NextResponse.json(
        { error: "One or more exercises not found" },
        { status: 400 }
      );
    }

    // Create workout with exercises
    const workout = await prisma.workout.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        image: image,
        userId: user.id,
        public: isPublic || false,
        exercises: {
          create: exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            notes: exercise.notes?.trim(),
            order: exercise.order,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                muscleGroup: true,
                difficulty: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      workout: {
        id: workout.id,
        name: workout.name,
        description: workout.description,
        exerciseCount: workout.exercises.length,
        muscleGroups: [...new Set(workout.exercises.map(e => e.exercise.muscleGroup))],
        createdAt: workout.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get("muscleGroup");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let whereClause: any;
    
    if (session?.user?.email) {
      // Authenticated user: show their workouts + public workouts
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      whereClause = {
        OR: [
          { userId: user.id }, // User's own workouts
          { public: true },    // Public workouts
        ],
      };
    } else {
      // Unauthenticated user: only show public workouts
      whereClause = {
        public: true,
      };
    };

    // Filter by muscle group if specified
    if (muscleGroup) {
      whereClause.exercises = {
        some: {
          exercise: {
            muscleGroup: muscleGroup,
          },
        },
      };
    }

    const workouts = await prisma.workout.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        public: true,
        userId: true,
        user: {
          select: { id: true, name: true },
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                muscleGroup: true,
                difficulty: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Get current user ID for ownership check
    const currentUserId = session?.user?.email ? 
      (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id : 
      null;

    const workoutsWithStats = workouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      description: workout.description,
      image: workout.image,
      isOwner: currentUserId ? workout.userId === currentUserId : false,
      author: workout.user.name,
      exerciseCount: workout.exercises.length,
      muscleGroups: [...new Set(workout.exercises.map(e => e.exercise.muscleGroup))],
      difficulty: workout.exercises.length > 0 
        ? workout.exercises[0].exercise.difficulty 
        : 'Beginner',
      timesCompleted: workout._count.sessions,
      createdAt: workout.createdAt,
      exercises: workout.exercises.map(e => ({
        id: e.id,
        name: e.exercise.name,
        muscleGroup: e.exercise.muscleGroup,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        order: e.order,
      })),
    }));

    return NextResponse.json({
      workouts: workoutsWithStats,
      hasMore: workouts.length === limit,
    });

  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}