export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * GET /api/spotify/debug
 * Debug endpoint to check Spotify configuration (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow authenticated users
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = {
      hasClientId: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
      hasRedirectUri: !!process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      clientIdLength: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.length || 0,
      clientSecretLength: process.env.SPOTIFY_CLIENT_SECRET?.length || 0,
      redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "Not set",
      redirectUriExpected:
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/spotify/callback`
          : "http://localhost:3000/api/spotify/callback",
      environment: process.env.VERCEL_ENV || "development",
      vercelUrl: process.env.VERCEL_URL || "Not set",
    };

    // Mask sensitive info but show first/last chars
    const maskedConfig = {
      ...config,
      clientIdPreview: config.hasClientId
        ? `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.substring(0, 4)}...${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.substring(
            (process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.length || 4) - 4
          )}`
        : "Not set",
      clientSecretPreview: config.hasClientSecret
        ? `${process.env.SPOTIFY_CLIENT_SECRET?.substring(0, 4)}...${process.env.SPOTIFY_CLIENT_SECRET?.substring(
            (process.env.SPOTIFY_CLIENT_SECRET?.length || 4) - 4
          )}`
        : "Not set",
    };

    return NextResponse.json({
      status: "Spotify Configuration Check",
      config: maskedConfig,
      warnings: [
        ...(!config.hasClientId ? ["Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID"] : []),
        ...(!config.hasClientSecret ? ["Missing SPOTIFY_CLIENT_SECRET"] : []),
        ...(!config.hasRedirectUri ? ["Missing NEXT_PUBLIC_SPOTIFY_REDIRECT_URI"] : []),
        ...(config.redirectUri !== config.redirectUriExpected
          ? [
              `Redirect URI mismatch: Set to "${config.redirectUri}" but should be "${config.redirectUriExpected}"`,
            ]
          : []),
      ],
      instructions: {
        step1: "Verify environment variables in Vercel dashboard match these values",
        step2: `Add this redirect URI to Spotify Dashboard: ${config.redirectUriExpected}`,
        step3: "Make sure Spotify app is in 'Extended Quota Mode' or add your email as test user",
        step4: "Redeploy after making changes to environment variables",
      },
    });
  } catch (error) {
    console.error("Error checking Spotify config:", error);
    return NextResponse.json(
      {
        error: "Failed to check configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
