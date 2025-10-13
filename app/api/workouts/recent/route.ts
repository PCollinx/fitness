import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateApiUser } from "@/lib/auth/api-auth";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { error, user } = await authenticateApiUser();
    
    if (error) {
      return error;
    }

    // Fetch the recent workout sessions for the current user
    const recentSessions = await prisma.workoutSession.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startTime: "desc",
      },
      take: 5, // Increase to 5 most recent sessions for better dashboard display
      select: {
        id: true,
        startTime: true,
        endTime: true,
        duration: true,
        workout: {
          select: {
            id: true,
            name: true,
          },
        },
        exercises: {
          select: {
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
            sets: {
              select: {
                completed: true,
                actualReps: true,
                actualWeight: true,
              },
            },
          },
        },
      },
    });

    // Format the sessions to match enhanced WorkoutSummary type for dashboard
    const formattedWorkouts = recentSessions.map((session) => {
      const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      const completedSets = session.exercises.reduce(
        (acc, ex) => acc + ex.sets.filter(set => set.completed).length, 
        0
      );
      
      return {
        id: session.workout.id,
        sessionId: session.id,
        name: session.workout.name,
        date: session.startTime.toISOString(),
        exercises: session.exercises.length,
        duration: session.duration ? Math.round(session.duration / 60) : null, // Convert to minutes
        completedSets,
        totalSets,
        completionRate: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
      };
    });

    // Return an empty array if no sessions found, but with 200 status
    return NextResponse.json(formattedWorkouts);
  } catch (error) {
    console.error("Error fetching recent workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent workout sessions" },
      { status: 500 }
    );
  }
}
