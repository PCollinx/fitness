import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the recent workouts for the current user
    const recentWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 3, // Limit to 3 most recent workouts
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        exercises: {
          select: {
            id: true,
          },
        },
      },
    });

    // Format the workouts to match the WorkoutSummary type
    const formattedWorkouts = recentWorkouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      date: workout.updatedAt.toISOString(),
      exercises: workout.exercises.length,
    }));

    // Return an empty array if no workouts found, but with 200 status
    return NextResponse.json(formattedWorkouts);
  } catch (error) {
    console.error("Error fetching recent workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent workouts" },
      { status: 500 }
    );
  }
}
