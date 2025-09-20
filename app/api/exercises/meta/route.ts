import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get unique muscle groups and difficulties from exercises
    const muscleGroups = await prisma.exercise.findMany({
      select: {
        muscleGroup: true,
      },
      distinct: ["muscleGroup"],
      where: {
        muscleGroup: {
          not: null,
        },
      },
    });

    const difficulties = await prisma.exercise.findMany({
      select: {
        difficulty: true,
      },
      distinct: ["difficulty"],
      where: {
        difficulty: {
          not: null,
        },
      },
    });

    // Get exercise count by muscle group
    const muscleGroupCounts = await prisma.exercise.groupBy({
      by: ["muscleGroup"],
      _count: {
        muscleGroup: true,
      },
      where: {
        muscleGroup: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      muscleGroups: muscleGroups.map((mg) => mg.muscleGroup).filter(Boolean),
      difficulties: difficulties.map((d) => d.difficulty).filter(Boolean),
      stats: {
        totalExercises: await prisma.exercise.count(),
        byMuscleGroup: muscleGroupCounts.reduce((acc, item) => {
          if (item.muscleGroup) {
            acc[item.muscleGroup] = item._count.muscleGroup;
          }
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Error fetching exercise metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise metadata" },
      { status: 500 }
    );
  }
}
