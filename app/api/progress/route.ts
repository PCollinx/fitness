export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the actual user ID from the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const whereClause: any = {
      userId: user.id,
    };

    // Add date filters if provided
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    // Add search filter if provided
    if (search) {
      whereClause.notes = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Fetch progress entries
    const progressEntries = await prisma.progress.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
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

    // Get total count for pagination
    const totalCount = await prisma.progress.count({
      where: whereClause,
    });

    return NextResponse.json({
      entries: progressEntries,
      totalCount,
      hasMore: offset + progressEntries.length < totalCount,
    });
  } catch (error) {
    console.error("Error fetching progress entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the actual user ID from the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { date, weight, bodyFat, chest, waist, hips, arms, thighs, notes } =
      body;

    // Create progress entry and sync weight with user profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create progress entry
      const progress = await tx.progress.create({
        data: {
          userId: user.id,
          date: new Date(date),
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          chest: chest ? parseFloat(chest) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          arms: arms ? parseFloat(arms) : null,
          thighs: thighs ? parseFloat(thighs) : null,
          notes: notes || null,
        },
      });

      // If weight is provided, update user profile weight
      if (weight) {
        await tx.user.update({
          where: { id: user.id },
          data: { weight: parseFloat(weight) },
        });
      }

      return progress;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating progress entry:", error);
    return NextResponse.json(
      { error: "Failed to create progress entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the actual user ID from the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Progress entry ID is required" },
        { status: 400 }
      );
    }

    // Verify the progress entry belongs to the user before deleting
    const existingEntry = await prisma.progress.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Progress entry not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the progress entry
    await prisma.progress.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Progress entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting progress entry:", error);
    return NextResponse.json(
      { error: "Failed to delete progress entry" },
      { status: 500 }
    );
  }
}
