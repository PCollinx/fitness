export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { exchangeCodeForToken } from "@/lib/spotify/config";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Get the base URL for redirects
    const baseUrl =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI?.replace(
        "/api/spotify/callback",
        ""
      ) || new URL(request.url).origin;

    if (error) {
      return NextResponse.redirect(
        new URL(`/music?error=${encodeURIComponent(error)}`, baseUrl)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/music?error=missing_params", baseUrl)
      );
    }

    // Verify state parameter
    try {
      // Convert URL-safe base64 back to regular base64
      const normalizedState = state
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(state.length + ((4 - (state.length % 4)) % 4), "=");

      const stateData = JSON.parse(
        Buffer.from(normalizedState, "base64").toString()
      );
      const session = await getServerSession(authOptions);

      console.log("State data:", stateData);
      console.log("Session email:", session?.user?.email);

      if (!session?.user?.email || session.user.email !== stateData.userId) {
        console.error(
          "State mismatch - Expected:",
          session?.user?.email,
          "Got:",
          stateData.userId
        );
        throw new Error("State mismatch");
      }

      // Check timestamp (optional: reject if too old)
      const timeDiff = Date.now() - stateData.timestamp;
      if (timeDiff > 10 * 60 * 1000) {
        // 10 minutes
        console.error("State expired - Age:", timeDiff / 1000, "seconds");
        throw new Error("State expired");
      }
    } catch (error) {
      console.error("State validation error:", error);
      return NextResponse.redirect(
        new URL("/music?error=invalid_state", baseUrl)
      );
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Store tokens in database
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        // Store or update Spotify tokens
        await prisma.user.update({
          where: { id: user.id },
          data: {
            spotifyAccessToken: tokenData.access_token,
            spotifyRefreshToken: tokenData.refresh_token,
            spotifyTokenExpiry: new Date(
              Date.now() + tokenData.expires_in * 1000
            ),
          } as any, // Use type assertion until Prisma is updated
        });
      }
    }

    // Redirect to music page with success
    return NextResponse.redirect(new URL("/music?connected=true", baseUrl));
  } catch (error) {
    console.error("Error handling Spotify callback:", error);
    const baseUrl =
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI?.replace(
        "/api/spotify/callback",
        ""
      ) || new URL(request.url).origin;
    return NextResponse.redirect(
      new URL("/music?error=callback_failed", baseUrl)
    );
  }
}
