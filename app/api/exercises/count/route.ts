export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const muscleGroups = searchParams.get('muscleGroups');
    
    if (!muscleGroups) {
      return NextResponse.json({ error: "muscleGroups parameter is required" }, { status: 400 });
    }

    const muscleGroupArray = muscleGroups.split(',').map(mg => mg.trim());
    
    // Get count of exercises for the specified muscle groups
    const count = await prisma.exercise.count({
      where: {
        muscleGroup: {
          in: muscleGroupArray
        }
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting exercises:", error);
    return NextResponse.json(
      { error: "Failed to count exercises" },
      { status: 500 }
    );
  }
}

// Alternative endpoint to get counts for all muscle groups
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { muscleGroups } = body;
    
    if (!muscleGroups || !Array.isArray(muscleGroups)) {
      return NextResponse.json({ error: "muscleGroups array is required" }, { status: 400 });
    }

    // Get counts for each muscle group
    const counts = await Promise.all(
      muscleGroups.map(async (muscleGroup: string) => {
        const count = await prisma.exercise.count({
          where: {
            muscleGroup: muscleGroup
          }
        });
        return { muscleGroup, count };
      })
    );

    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Error counting exercises by muscle groups:", error);
    return NextResponse.json(
      { error: "Failed to count exercises" },
      { status: 500 }
    );
  }
}