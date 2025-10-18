export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getImageForWorkout } from "@/app/utils/workoutImageStorage";
import { authenticateApiUser, ApiErrors } from "@/lib/auth/api-auth";

/**
 * POST /api/images/workout
 * Get a workout image based on exercises, name, and category
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const { error } = await authenticateApiUser();

    if (error) {
      return error;
    }

    const body = await request.json();
    const { exercises, workoutName, category } = body;

    if (!exercises || !Array.isArray(exercises)) {
      return ApiErrors.badRequest("Exercises array is required");
    }

    // Get the image URL using the server-side utility
    const imageUrl = await getImageForWorkout(exercises, workoutName, category);

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workout image:", error);
    return ApiErrors.internalError("Failed to fetch workout image");
  }
}
