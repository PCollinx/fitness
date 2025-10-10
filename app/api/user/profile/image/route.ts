export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Validate image data (basic check that it's a data URL)
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data format. Must be a data URL" },
        { status: 400 }
      );
    }

    // Check file size (roughly estimate the size from base64 string)
    // Base64 encoding increases size by roughly 4/3, so 4MB base64 ~= 3MB file
    const sizeInBytes = Math.ceil((image.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 3) {
      return NextResponse.json(
        { error: "Image file size exceeds 3MB limit" },
        { status: 400 }
      );
    }

    // Update user image in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        image: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      image: updatedUser.image,
      lastUpdated: updatedUser.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user image
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      image: user.image,
    });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove user image from database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile image removed successfully",
      lastUpdated: updatedUser.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error removing profile image:", error);
    return NextResponse.json(
      { error: "Failed to remove profile image" },
      { status: 500 }
    );
  }
}
