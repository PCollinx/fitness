import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get date ranges for calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Fetch user profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // 2. Fetch recent progress entries (weight, body measurements)
    const progressEntries = await prisma.progress.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
      select: {
        id: true,
        date: true,
        weight: true,
        bodyFat: true,
        chest: true,
        waist: true,
        hips: true,
        arms: true,
        thighs: true,
        notes: true,
      },
    });

    // 3. Fetch workout session statistics
    const [
      totalSessions,
      sessionsLast30Days,
      sessionsLast7Days,
      recentSessions,
    ] = await Promise.all([
      // Total sessions
      prisma.workoutSession.count({
        where: { userId },
      }),

      // Sessions in last 30 days
      prisma.workoutSession.count({
        where: {
          userId,
          startTime: { gte: thirtyDaysAgo },
        },
      }),

      // Sessions in last 7 days
      prisma.workoutSession.count({
        where: {
          userId,
          startTime: { gte: sevenDaysAgo },
        },
      }),

      // Recent sessions with details
      prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { startTime: "desc" },
        take: 10,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          duration: true,
          workout: { select: { name: true } },
          exercises: {
            select: {
              sets: {
                select: {
                  completed: true,
                  actualWeight: true,
                  actualReps: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // 4. Calculate workout session metrics
    let totalSetsCompleted = 0;
    let totalSets = 0;
    let totalWeightLifted = 0;
    let totalReps = 0;
    let averageDuration = 0;

    recentSessions.forEach((sessionData) => {
      if (sessionData.duration) {
        averageDuration += sessionData.duration;
      }

      sessionData.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          totalSets++;
          if (set.completed) {
            totalSetsCompleted++;
            if (set.actualWeight && set.actualReps) {
              totalWeightLifted += set.actualWeight * set.actualReps;
              totalReps += set.actualReps;
            }
          }
        });
      });
    });

    averageDuration =
      recentSessions.length > 0 ? averageDuration / recentSessions.length : 0;

    // 5. Calculate trends
    const calculateTrend = (
      data: { date: Date; value: number | null }[],
      days: number = 30
    ) => {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const recentData = data
        .filter((item) => item.date >= cutoffDate && item.value !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (recentData.length < 2) return 0;

      const first = recentData[0].value!;
      const last = recentData[recentData.length - 1].value!;
      return ((last - first) / first) * 100;
    };

    // Weight trend
    const weightData = progressEntries
      .filter((entry) => entry.weight !== null)
      .map((entry) => ({ date: entry.date, value: entry.weight }));

    const weightTrend30d = calculateTrend(weightData, 30);
    const weightTrend7d = calculateTrend(weightData, 7);

    // 6. Calculate consistency score (sessions per week over last 4 weeks)
    const consistencyScore = Math.min(
      (sessionsLast30Days / 4) * (100 / 3),
      100
    ); // Assuming 3 sessions/week is 100%

    // 7. Calculate strength progress (average weight increase over time)
    const strengthProgress =
      recentSessions.length > 5
        ? ((totalWeightLifted / recentSessions.slice(0, 5).length -
            totalWeightLifted / recentSessions.slice(-5).length) /
            (totalWeightLifted / recentSessions.slice(-5).length)) *
          100
        : 0;

    // 8. Format response
    const progressSummary = {
      user: {
        name: user?.name,
        memberSince: user?.createdAt,
      },

      // Body metrics
      bodyMetrics: {
        current: progressEntries[0] || null,
        history: progressEntries,
        trends: {
          weight: {
            current: progressEntries[0]?.weight || null,
            trend30d: weightTrend30d,
            trend7d: weightTrend7d,
          },
          bodyFat: {
            current: progressEntries[0]?.bodyFat || null,
            trend30d: calculateTrend(
              progressEntries
                .filter((entry) => entry.bodyFat !== null)
                .map((entry) => ({ date: entry.date, value: entry.bodyFat })),
              30
            ),
          },
        },
      },

      // Workout metrics
      workoutMetrics: {
        totalSessions,
        sessionsLast30Days,
        sessionsLast7Days,
        totalSetsCompleted,
        totalSets,
        completionRate:
          totalSets > 0
            ? Math.round((totalSetsCompleted / totalSets) * 100)
            : 0,
        averageDuration: Math.round(averageDuration / 60), // Convert to minutes
        totalWeightLifted: Math.round(totalWeightLifted),
        totalReps,
        consistencyScore: Math.round(consistencyScore),
        strengthProgress: Math.round(strengthProgress * 100) / 100,
      },

      // Recent activity
      recentActivity: recentSessions.map((session) => ({
        id: session.id,
        date: session.startTime,
        workoutName: session.workout.name,
        duration: session.duration ? Math.round(session.duration / 60) : null,
        setsCompleted: session.exercises.reduce(
          (acc, ex) => acc + ex.sets.filter((set) => set.completed).length,
          0
        ),
        totalSets: session.exercises.reduce(
          (acc, ex) => acc + ex.sets.length,
          0
        ),
      })),

      // Overall scores
      overallScores: {
        consistency: Math.round(consistencyScore),
        improvement: Math.max(
          0,
          Math.min(
            100,
            50 +
              (weightTrend30d > 0
                ? -weightTrend30d * 10
                : Math.abs(weightTrend30d) * 5) +
              strengthProgress +
              (sessionsLast30Days > 8 ? 20 : sessionsLast30Days * 2.5)
          )
        ),
      },
    };

    return NextResponse.json(progressSummary);
  } catch (error) {
    console.error("Error fetching comprehensive progress data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
