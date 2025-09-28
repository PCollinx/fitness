import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const session = await requireAdmin();
    
    if (!session) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch detailed user information
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          },
        },
        sessions: {
          select: {
            id: true,
            expires: true,
          },
          orderBy: {
            expires: "desc",
          },
          take: 10, // Last 10 sessions
        },
        workouts: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            public: true,
            _count: {
              select: {
                sessions: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Last 10 workouts
        },
        workoutSessions: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            duration: true,
            workout: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                exercises: true,
              },
            },
          },
          orderBy: {
            startTime: "desc",
          },
          take: 20, // Last 20 workout sessions
        },
        progress: {
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
          orderBy: {
            date: "desc",
          },
          take: 20, // Last 20 progress entries
        },
        _count: {
          select: {
            workouts: true,
            workoutSessions: true,
            progress: true,
            accounts: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate some stats
    const totalWorkoutTime = user.workoutSessions.reduce(
      (total: number, session: any) => total + (session.duration || 0),
      0
    );

    const recentActivity = user.workoutSessions.length > 0
      ? user.workoutSessions[0].startTime
      : null;

    const progressTrend = user.progress.length >= 2
      ? {
          weightChange: user.progress[0].weight && user.progress[1].weight
            ? user.progress[0].weight - user.progress[1].weight
            : null,
          bodyFatChange: user.progress[0].bodyFat && user.progress[1].bodyFat
            ? user.progress[0].bodyFat - user.progress[1].bodyFat
            : null,
        }
      : null;

    return NextResponse.json({
      ...user,
      stats: {
        totalWorkoutTime,
        recentActivity,
        progressTrend,
        averageSessionDuration: user.workoutSessions.length > 0
          ? totalWorkoutTime / user.workoutSessions.length
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const session = await requireAdmin();
    
    if (!session) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    const allowedFields = ['name', 'bio', 'height', 'weight'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date();

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}