import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workoutId = params.id;

    // Fetch workout sessions for this specific workout
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        workoutId: workoutId,
      },
      take: 10,
      orderBy: { startTime: "desc" },
      include: {
        exercises: {
          include: {
            exercise: { select: { id: true, name: true } },
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    // Calculate statistics
    const totalSessions = workoutSessions.length;
    const lastSession = workoutSessions[0];

    let totalCompletedSets = 0;
    let totalSets = 0;

    workoutSessions.forEach((session) => {
      session.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          totalSets++;
          if (set.completed) {
            totalCompletedSets++;
          }
        });
      });
    });

    const completionRate =
      totalSets > 0 ? Math.round((totalCompletedSets / totalSets) * 100) : 0;

    return NextResponse.json({
      success: true,
      sessions: workoutSessions,
      stats: {
        totalSessions,
        completionRate,
        lastPerformed: lastSession?.startTime || null,
        totalCompletedSets,
        totalSets,
      },
    });
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout sessions" },
      { status: 500 }
    );
  }
}
