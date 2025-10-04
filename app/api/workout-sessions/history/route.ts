export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch workout sessions with full details
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id as string,
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
          },
        },
        exercises: {
          include: {
            exercise: {
              select: {
                name: true,
                muscleGroup: true,
              },
            },
            sets: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(sessions);

  } catch (error) {
    console.error("Error fetching workout session history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}