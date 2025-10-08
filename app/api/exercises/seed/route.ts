export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";
import { exerciseData } from "@/lib/exerciseData";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if exercises already exist to avoid duplicates
    const existingCount = await prisma.exercise.count();

    if (existingCount > 0) {
      return NextResponse.json({
        message: "Exercises already seeded",
        count: existingCount,
      });
    }

    // Create exercises using shared exercise data
    const createdExercises = await prisma.exercise.createMany({
      data: exerciseData,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Exercises seeded successfully",
      count: createdExercises.count,
    });
  } catch (error) {
    console.error("Error seeding exercises:", error);
    return NextResponse.json(
      { error: "Failed to seed exercises" },
      { status: 500 }
    );
  }
}
