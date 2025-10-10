export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch the specific progress entry
    const progressEntry = await prisma.progress.findFirst({
      where: {
        id,
        userId: session.user.id as string,
      },
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

    if (!progressEntry) {
      return NextResponse.json(
        { error: "Progress entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(progressEntry);
  } catch (error) {
    console.error("Error fetching progress entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { date, weight, bodyFat, chest, waist, hips, arms, thighs, notes } =
      body;

    // Verify the progress entry belongs to the user
    const existingEntry = await prisma.progress.findFirst({
      where: {
        id,
        userId: session.user.id as string,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Progress entry not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the progress entry
    const updatedEntry = await prisma.progress.update({
      where: { id },
      data: {
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

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating progress entry:", error);
    return NextResponse.json(
      { error: "Failed to update progress entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Verify the progress entry belongs to the user before deleting
    const existingEntry = await prisma.progress.findFirst({
      where: {
        id,
        userId: session.user.id as string,
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
