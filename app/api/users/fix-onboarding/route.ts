import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check if user has admin privileges or a special secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update all users who have fitness goals but haven't been marked as onboarded
    const result = await prisma.user.updateMany({
      where: {
        onboardingCompleted: {
          not: true
        },
        fitnessGoals: {
          some: {}
        }
      },
      data: {
        onboardingCompleted: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${result.count} users to mark onboarding as completed`,
      updatedCount: result.count
    });

  } catch (error) {
    console.error("Error updating user onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to update users" },
      { status: 500 }
    );
  }
}