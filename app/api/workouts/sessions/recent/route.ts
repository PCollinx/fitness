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

    // Fetch all recent workout sessions for the current user (last 20)
    const recentSessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        startTime: "desc",
      },
      take: 20, // Get more sessions for the dedicated page
      select: {
        id: true,
        startTime: true,
        endTime: true,
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
                name: true,
              },
            },
            sets: {
              select: {
                id: true,
                completed: true,
                actualReps: true,
                actualWeight: true,
                targetReps: true,
                targetWeight: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(recentSessions);
  } catch (error) {
    console.error("Error fetching recent workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent workout sessions" },
      { status: 500 }
    );
  }
}
