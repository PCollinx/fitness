export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

/**
 * GET /api/default-playlists
 * Fetch active default playlists (authenticated users only)
 * Query params: category (optional) - filter by 'workout' or 'general'
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Build where clause - only fetch active playlists
    const where: any = { isActive: true };
    if (category && ["workout", "general"].includes(category)) {
      where.category = category;
    }

    // Fetch default playlists
    const playlists = await (prisma as any).defaultPlaylist.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        spotifyPlaylistId: true,
        spotifyPlaylistUrl: true,
        category: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      playlists,
      count: playlists.length,
    });
  } catch (error) {
    console.error("Error fetching default playlists:", error);

    return NextResponse.json(
      { error: "Failed to fetch default playlists" },
      { status: 500 }
    );
  }
}
