import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, weight, bodyFat, chest, waist, hips, arms, thighs, notes } =
      body;

    // Create progress entry in database
    const progress = await prisma.progress.create({
      data: {
        userId: session.user.id as string,
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

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error creating progress entry:", error);
    return NextResponse.json(
      { error: "Failed to create progress entry" },
      { status: 500 }
    );
  }
}
