export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/default-playlists
 * List all default playlists (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await requireAdmin();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    // Build where clause
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Fetch default playlists
    const playlists = await (prisma as any).defaultPlaylist.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      playlists,
      count: playlists.length,
    });
  } catch (error) {
    console.error("Error fetching default playlists:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch default playlists" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/default-playlists
 * Create a new default playlist (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await requireAdmin();

    const body = await request.json();
    const {
      name,
      description,
      spotifyPlaylistId,
      spotifyPlaylistUrl,
      category,
      imageUrl,
      isActive = true,
    } = body;

    // Validate required fields
    if (!name || !spotifyPlaylistId || !category) {
      return NextResponse.json(
        { error: "Name, Spotify playlist ID, and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    if (!["workout", "general"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be either 'workout' or 'general'" },
        { status: 400 }
      );
    }

    // Check if playlist with same Spotify ID already exists
    const existing = await (prisma as any).defaultPlaylist.findUnique({
      where: { spotifyPlaylistId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A default playlist with this Spotify ID already exists" },
        { status: 409 }
      );
    }

    // Get admin user ID
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Create default playlist
    const playlist = await (prisma as any).defaultPlaylist.create({
      data: {
        name,
        description,
        spotifyPlaylistId,
        spotifyPlaylistUrl,
        category,
        imageUrl,
        isActive,
        createdById: adminUser.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      playlist,
      message: "Default playlist created successfully",
    });
  } catch (error) {
    console.error("Error creating default playlist:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create default playlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/default-playlists
 * Update a default playlist (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();
    const {
      id,
      name,
      description,
      spotifyPlaylistUrl,
      category,
      imageUrl,
      isActive,
    } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Playlist ID is required" },
        { status: 400 }
      );
    }

    // Check if playlist exists
    const existing = await (prisma as any).defaultPlaylist.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Default playlist not found" },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category && !["workout", "general"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be either 'workout' or 'general'" },
        { status: 400 }
      );
    }

    // Update playlist
    const playlist = await (prisma as any).defaultPlaylist.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(spotifyPlaylistUrl && { spotifyPlaylistUrl }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      playlist,
      message: "Default playlist updated successfully",
    });
  } catch (error) {
    console.error("Error updating default playlist:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update default playlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/default-playlists
 * Delete a default playlist (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Playlist ID is required" },
        { status: 400 }
      );
    }

    // Check if playlist exists
    const existing = await (prisma as any).defaultPlaylist.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Default playlist not found" },
        { status: 404 }
      );
    }

    // Delete playlist
    await (prisma as any).defaultPlaylist.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Default playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting default playlist:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete default playlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
