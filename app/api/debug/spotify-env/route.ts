export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    spotify_client_id_exists: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    spotify_client_id_length: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID?.length || 0,
    spotify_client_secret_exists: !!process.env.SPOTIFY_CLIENT_SECRET,
    spotify_redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    environment: process.env.NODE_ENV,
    // Don't expose actual secrets, just their existence
    all_spotify_vars: {
      NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? 'SET' : 'MISSING',
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'MISSING', 
      NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'NOT SET'
    }
  });
}