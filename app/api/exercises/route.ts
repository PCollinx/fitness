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
    
    // Optional filters
    const muscleGroup = searchParams.get('muscleGroup');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Build where clause
    const where: any = {};
    
    if (muscleGroup) {
      where.muscleGroup = muscleGroup;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { muscleGroup: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch exercises from database
    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        muscleGroup: true,
        difficulty: true,
        instructions: true,
        createdAt: true,
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, muscleGroup, difficulty, instructions } = body;

    if (!name || !muscleGroup) {
      return NextResponse.json(
        { error: "Name and muscle group are required" },
        { status: 400 }
      );
    }

    // Create new exercise
    const exercise = await prisma.exercise.create({
      data: {
        name,
        description: description || null,
        muscleGroup,
        difficulty: difficulty || 'intermediate',
        instructions: instructions || null,
        userId: session.user.id as string,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}