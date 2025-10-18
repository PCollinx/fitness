import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateApiUser } from "@/lib/auth/api-auth";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { error, user } = await authenticateApiUser();

    if (error) {
      return error;
    }

    // Fetch workout sessions from database
    const workoutSessions = await prisma.workoutSession.findMany({
      where: { userId: user.id },
      take: 10,
      orderBy: { startTime: "desc" },
      include: {
        workout: { select: { id: true, name: true } },
        exercises: {
          include: {
            exercise: { select: { id: true, name: true } },
            sets: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessions: workoutSessions,
    });
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout sessions" },
      { status: 500 }
    );
  }
}
