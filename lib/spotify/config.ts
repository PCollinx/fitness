// Spotify API configuration and helper functions
export const SPOTIFY_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
  REDIRECT_URI:
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/api/auth/callback/spotify",
  SCOPES: [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" "),
};

export const SPOTIFY_URLS = {
  ACCOUNTS_BASE: "https://accounts.spotify.com",
  API_BASE: "https://api.spotify.com/v1",
  AUTHORIZE: `https://accounts.spotify.com/authorize`,
  TOKEN: `https://accounts.spotify.com/api/token`,
};

// Generate Spotify authorization URL
export function getSpotifyAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    scope: SPOTIFY_CONFIG.SCOPES,
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    ...(state && { state }),
  });

  return `${SPOTIFY_URLS.AUTHORIZE}?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string) {
  const response = await fetch(SPOTIFY_URLS.TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(SPOTIFY_URLS.TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

// Make authenticated Spotify API request
export async function spotifyApiRequest(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const url = `${SPOTIFY_URLS.API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Spotify token expired");
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}

// Spotify data types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { total: number };
  external_urls: { spotify: string };
  owner: { display_name: string };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  country: string;
  product: string;
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface SpotifyPlaybackState {
  device: SpotifyDevice;
  repeat_state: string;
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: { spotify: string };
  } | null;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: SpotifyTrack | null;
  currently_playing_type: string;
  actions: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}
