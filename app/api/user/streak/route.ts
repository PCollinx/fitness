export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get all completed workout sessions ordered by date (most recent first)
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        // Only sessions that have both start and end times (completed)
        duration: { gt: 0 },
      },
      select: {
        startTime: true,
        endTime: true,
        duration: true,
      },
      orderBy: { startTime: "desc" },
    });

    if (workoutSessions.length === 0) {
      return NextResponse.json({
        success: true,
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastWorkout: null,
          streakDays: [],
          isActiveToday: false,
        },
      });
    }

    // Calculate streaks
    const streakData = calculateWorkoutStreak(workoutSessions);

    return NextResponse.json({
      success: true,
      streak: streakData,
    });
  } catch (error) {
    console.error("Error calculating workout streak:", error);
    return NextResponse.json(
      { error: "Failed to calculate workout streak" },
      { status: 500 }
    );
  }
}

interface WorkoutSession {
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

function calculateWorkoutStreak(sessions: WorkoutSession[]) {
  // Group sessions by date (YYYY-MM-DD format)
  const sessionsByDate = new Map<string, WorkoutSession[]>();

  sessions.forEach((session) => {
    const dateKey = session.startTime.toISOString().split("T")[0];
    if (!sessionsByDate.has(dateKey)) {
      sessionsByDate.set(dateKey, []);
    }
    sessionsByDate.get(dateKey)!.push(session);
  });

  // Get unique workout dates and sort them (most recent first)
  const workoutDates = Array.from(sessionsByDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (workoutDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkout: null,
      streakDays: [],
      isActiveToday: false,
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Check if user worked out today
  const isActiveToday = workoutDates.includes(today);

  // Calculate current streak
  let currentStreak = 0;
  let streakDays: string[] = [];

  // Start checking from today or yesterday
  let checkDate = isActiveToday ? today : yesterday;
  let currentCheckDate = new Date(checkDate);

  while (true) {
    const dateStr = currentCheckDate.toISOString().split("T")[0];

    if (workoutDates.includes(dateStr)) {
      currentStreak++;
      streakDays.push(dateStr);
      // Move to previous day
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      // Streak broken
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;

  // Check all dates for longest streak
  const allDates = workoutDates.sort();

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const currentDate = new Date(allDates[i]);
      const previousDate = new Date(allDates[i - 1]);
      const dayDiff = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastWorkout: workoutDates[0],
    streakDays: streakDays.reverse(), // Show oldest to newest
    isActiveToday,
  };
}
