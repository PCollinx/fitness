import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getSpotifyAuthUrl } from "@/lib/spotify/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate state parameter for security (URL-safe base64)
    const state = Buffer.from(
      JSON.stringify({
        userId: session.user.email,
        timestamp: Date.now(),
      })
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const authUrl = getSpotifyAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating Spotify auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
