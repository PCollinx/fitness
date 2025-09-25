import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Type definitions for the statistics
interface WorkoutSessionStats {
  id: string;
  startTime: Date;
  duration: number;
}

interface TopWorkoutStat {
  workoutId: string;
  _count: {
    id: number;
  };
}

interface TopWorkoutWithName {
  workoutId: string;
  workoutName: string;
  sessions: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Check if WorkoutSession model is available, otherwise return basic stats
    try {
      // Test if workoutSession is available
      const testQuery = await (prisma as any).workoutSession?.count?.({
        where: { userId },
      });

      // Get workout session statistics
      const [
        totalSessions,
        totalWorkoutTime,
        recentSessions,
        topWorkouts,
        weeklyStats,
      ] = await Promise.all([
        // Total sessions count
        (prisma as any).workoutSession.count({
          where: { userId },
        }),

        // Total workout time (sum of all session durations)
        (prisma as any).workoutSession.aggregate({
          where: { userId },
          _sum: { duration: true },
        }),

        // Recent sessions (last 7 days)
        (prisma as any).workoutSession.count({
          where: {
            userId,
            startTime: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Most performed workouts
        (prisma as any).workoutSession.groupBy({
          by: ["workoutId"],
          where: { userId },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 5,
        }),

        // Weekly session counts for the last 8 weeks
        (prisma as any).workoutSession.findMany({
          where: {
            userId,
            startTime: {
              gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            startTime: true,
            duration: true,
          },
          orderBy: { startTime: "desc" },
        }) as Promise<WorkoutSessionStats[]>,
      ]);

      // Get workout names for top workouts
      const workoutIds = (topWorkouts as TopWorkoutStat[]).map(
        (w: TopWorkoutStat) => w.workoutId
      );
      const workouts = await prisma.workout.findMany({
        where: { id: { in: workoutIds } },
        select: { id: true, name: true },
      });

      const topWorkoutsWithNames: TopWorkoutWithName[] = (
        topWorkouts as TopWorkoutStat[]
      ).map((stat: TopWorkoutStat) => {
        const workout = workouts.find((w) => w.id === stat.workoutId);
        return {
          workoutId: stat.workoutId,
          workoutName: workout?.name || "Unknown Workout",
          sessions: stat._count.id,
        };
      });

      // Process weekly stats
      const weeklyData = [];
      const now = new Date();

      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekSessions = (weeklyStats as WorkoutSessionStats[]).filter(
          (session: WorkoutSessionStats) =>
            session.startTime >= weekStart && session.startTime <= weekEnd
        );

        weeklyData.push({
          week: `Week ${i === 0 ? "This" : i}`,
          sessions: weekSessions.length,
          totalMinutes: Math.round(
            weekSessions.reduce(
              (acc: number, s: WorkoutSessionStats) => acc + s.duration,
              0
            ) / 60
          ),
          weekStart: weekStart.toISOString(),
        });
      }

      const stats = {
        totalSessions,
        totalWorkoutTime: Math.round(
          (totalWorkoutTime._sum.duration || 0) / 60
        ), // Convert to minutes
        recentSessions,
        averageSessionTime:
          totalSessions > 0
            ? Math.round(
                (totalWorkoutTime._sum.duration || 0) / totalSessions / 60
              )
            : 0, // Average in minutes
        topWorkouts: topWorkoutsWithNames,
        weeklyProgress: weeklyData.reverse(), // Show oldest to newest
      };

      return NextResponse.json({
        success: true,
        stats,
      });
    } catch (workoutSessionError) {
      console.warn(
        "WorkoutSession model not available, returning fallback stats:",
        workoutSessionError
      );

      // Fallback: Return basic stats from existing data
      const totalWorkouts = await prisma.workout.count({
        where: { userId },
      });

      const recentWorkouts = await prisma.workout.count({
        where: {
          userId,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const fallbackStats = {
        totalSessions: 0,
        totalWorkoutTime: 0,
        recentSessions: 0,
        averageSessionTime: 0,
        topWorkouts: [],
        weeklyProgress: [],
        totalWorkouts,
        recentWorkouts,
        message:
          "Workout session tracking not yet available. Complete a workout to start tracking.",
      };

      return NextResponse.json({
        success: true,
        stats: fallbackStats,
      });
    }
  } catch (error) {
    console.error("Error fetching workout session stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout session statistics" },
      { status: 500 }
    );
  }
}
