import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { SpotifyService } from "@/lib/spotify/service";
import { refreshAccessToken } from "@/lib/spotify/config";
import prisma from "@/lib/prisma";

// Force this route to be dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getValidSpotifyToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!(user as any)?.spotifyAccessToken) {
    throw new Error("No Spotify token found");
  }

  // Check if token is expired
  const now = new Date();
  const expiry = (user as any).spotifyTokenExpiry;

  if (expiry && now >= expiry && (user as any).spotifyRefreshToken) {
    // Refresh the token
    try {
      const tokenData = await refreshAccessToken(
        (user as any).spotifyRefreshToken
      );

      // Update user with new token
      await prisma.user.update({
        where: { id: userId },
        data: {
          spotifyAccessToken: tokenData.access_token,
          spotifyTokenExpiry: new Date(
            Date.now() + tokenData.expires_in * 1000
          ),
        } as any,
      });

      return tokenData.access_token;
    } catch (error) {
      throw new Error("Failed to refresh Spotify token");
    }
  }

  return (user as any).spotifyAccessToken;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      const accessToken = await getValidSpotifyToken(user.id);
      const spotify = new SpotifyService(accessToken);

      // Try to get user's Spotify profile to verify connection
      const profile = await spotify.getCurrentUser();

      return NextResponse.json({
        connected: true,
        profile: {
          id: profile.id,
          display_name: profile.display_name,
          images: profile.images,
        },
      });
    } catch (error) {
      console.error("Spotify connection check failed:", error);
      return NextResponse.json({ connected: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking Spotify connection:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
