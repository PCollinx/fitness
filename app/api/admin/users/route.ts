export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await requireAdmin();
    
    if (!session) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where });

    // Fetch users with related data
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          },
        },
        sessions: {
          select: {
            expires: true,
          },
          orderBy: {
            expires: "desc",
          },
          take: 1, // Get most recent session
        },
        workouts: {
          select: {
            id: true,
          },
        },
        workoutSessions: {
          select: {
            id: true,
            startTime: true,
          },
          orderBy: {
            startTime: "desc",
          },
          take: 1, // Get most recent workout session
        },
        progress: {
          select: {
            id: true,
            date: true,
          },
          orderBy: {
            date: "desc",
          },
          take: 1, // Get most recent progress entry
        },
        _count: {
          select: {
            workouts: true,
            workoutSessions: true,
            progress: true,
          },
        },
      },
    });

    // Transform data for frontend
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      image: user.image,
      bio: user.bio,
      height: user.height,
      weight: user.weight,
      // Authentication info
      hasPassword: !!user.password,
      providers: user.accounts.map((account) => account.provider),
      lastSession: user.sessions[0]?.expires || null,
      // Activity info
      totalWorkouts: user._count.workouts,
      totalSessions: user._count.workoutSessions,
      totalProgressEntries: user._count.progress,
      lastWorkoutSession: user.workoutSessions[0]?.startTime || null,
      lastProgressEntry: user.progress[0]?.date || null,
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await requireAdmin();
    
    if (!session) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    // For now, prevent users from deleting themselves
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user to prevent self-deletion
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });

    if (currentUser?.id === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}