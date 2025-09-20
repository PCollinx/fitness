import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the recent progress records for the current user
    const progressData = await prisma.progress.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        date: "desc",
      },
      take: 5, // Limit to 5 most recent progress entries
      select: {
        id: true,
        date: true,
        weight: true,
      },
    });

    // Format the progress data to match the ProgressSummary type
    const formattedProgress = progressData.map((record) => ({
      date: record.date.toISOString(),
      weight: record.weight || 0, // Default to 0 if weight is null
    }));

    // Return an empty array if no progress data found, but with 200 status
    return NextResponse.json(formattedProgress);
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
