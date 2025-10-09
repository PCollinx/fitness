import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// Type assertion to include WorkoutSchedule model
type PrismaWithWorkoutSchedule = typeof prisma & {
  workoutSchedule: {
    findMany: (args: any) => Promise<any>;
    findFirst: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    deleteMany: (args: any) => Promise<any>;
  };
};

const prismaWithWorkoutSchedule = prisma as PrismaWithWorkoutSchedule;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedules = await prismaWithWorkoutSchedule.workoutSchedule.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching workout schedules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dayOfWeek, time, isActive, notificationsEnabled, reminderMinutes } =
      body;

    // Validate input
    if (typeof dayOfWeek !== "number" || dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: "Invalid day of week (0-6)" },
        { status: 400 }
      );
    }

    if (!time || typeof time !== "string") {
      return NextResponse.json(
        { error: "Time is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:MM (24-hour format)" },
        { status: 400 }
      );
    }

    // Check if schedule already exists for this user and day
    const existingSchedule =
      await prismaWithWorkoutSchedule.workoutSchedule.findFirst({
        where: {
          userId: session.user.id,
          dayOfWeek: dayOfWeek,
        },
      });

    if (existingSchedule) {
      return NextResponse.json(
        { error: "Schedule already exists for this day" },
        { status: 409 }
      );
    }

    const schedule = await prismaWithWorkoutSchedule.workoutSchedule.create({
      data: {
        userId: session.user.id,
        dayOfWeek,
        time,
        isActive: isActive ?? true,
        notificationsEnabled: notificationsEnabled ?? true,
        reminderMinutes: reminderMinutes ?? 15,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating workout schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { schedules } = body;

    if (!Array.isArray(schedules)) {
      return NextResponse.json(
        { error: "Schedules must be an array" },
        { status: 400 }
      );
    }

    // Validate all schedules
    for (const schedule of schedules) {
      if (
        typeof schedule.dayOfWeek !== "number" ||
        schedule.dayOfWeek < 0 ||
        schedule.dayOfWeek > 6
      ) {
        return NextResponse.json(
          { error: "Invalid day of week (0-6)" },
          { status: 400 }
        );
      }

      if (!schedule.time || typeof schedule.time !== "string") {
        return NextResponse.json(
          { error: "Time is required and must be a string" },
          { status: 400 }
        );
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(schedule.time)) {
        return NextResponse.json(
          { error: "Invalid time format. Use HH:MM (24-hour format)" },
          { status: 400 }
        );
      }
    }

    // Use transaction to update all schedules
    const result = await prisma.$transaction(async (tx) => {
      const txWithWorkoutSchedule = tx as any;

      // Delete existing schedules for the user
      await txWithWorkoutSchedule.workoutSchedule.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      // Create new schedules
      const createdSchedules = [];
      for (const schedule of schedules) {
        if (schedule.isEnabled) {
          const created = await txWithWorkoutSchedule.workoutSchedule.create({
            data: {
              userId: session.user.id,
              dayOfWeek: schedule.dayOfWeek,
              time: schedule.time,
              isActive: schedule.isActive ?? true,
              isEnabled: schedule.isEnabled ?? true,
              notificationsEnabled: schedule.notificationsEnabled ?? true,
              reminderEnabled: schedule.reminderEnabled ?? true,
              reminderMinutes: schedule.reminderMinutes ?? 15,
            },
          });
          createdSchedules.push(created);
        }
      }

      return createdSchedules;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating workout schedules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get("id");

    if (!scheduleId) {
      return NextResponse.json(
        { error: "Schedule ID is required" },
        { status: 400 }
      );
    }

    // Verify the schedule belongs to the user
    const schedule = await prismaWithWorkoutSchedule.workoutSchedule.findUnique(
      {
        where: { id: scheduleId },
        select: { userId: true },
      }
    );

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    if (schedule.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this schedule" },
        { status: 403 }
      );
    }

    // Soft delete by deactivating
    await prismaWithWorkoutSchedule.workoutSchedule.update({
      where: { id: scheduleId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
