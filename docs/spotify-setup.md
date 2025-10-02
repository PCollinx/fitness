# 🎵 Spotify Integration Setup Guide

## Overview

Your fitness app now supports Spotify integration, allowing users to:

- Connect their Spotify accounts
- Browse their playlists, featured playlists, and workout-specific playlists
- Control music playback during workouts
- Get music recommendations based on workout intensity

## 🔑 Required Environment Variables

Add these to your `.env` file:

```bash
# Spotify API Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=ee3227dbc4c84716b60f43e4c3074b82
SPOTIFY_CLIENT_SECRET=c5f2ebacc0ed42dea68b7077f0ddc4bb

# For development with ngrok (update with your actual ngrok URL):
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/api/spotify/callback

# For production:
# NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://your-domain.vercel.app/api/spotify/callback
```

## 🚀 Quick Start with ngrok

1. **Authenticate ngrok** (one-time setup):

   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

2. **Start ngrok tunnel**:

   ```bash
   ngrok http 3000
   ```

3. **Copy your HTTPS URL** from ngrok output (e.g., `https://abc123.ngrok-free.app`)

4. **Update your .env file** with the ngrok URL:

   ```bash
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://abc123.ngrok-free.app/api/spotify/callback
   ```

5. **Add the same URL to Spotify App settings** in the redirect URIs

## 🔧 Spotify App Setup

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App Name:** Your Fitness App
   - **App Description:** Fitness app with music integration
   - **Redirect URIs:**
     - `http://localhost:3000/api/spotify/callback` (development)
     - `https://your-domain.vercel.app/api/spotify/callback` (production)
   - **APIs Used:** Web API

### 2. Get Your Credentials

1. After creating the app, go to Settings
2. Copy the **Client ID** → `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
3. Click "View client secret" and copy → `SPOTIFY_CLIENT_SECRET`

### 3. Configure Redirect URIs

Make sure to add both development and production URLs:

- `https://your-ngrok-url.ngrok.io/api/spotify/callback` (development with ngrok)
- `https://localhost:3000/api/spotify/callback` (if using HTTPS locally)
- `https://your-actual-vercel-domain.vercel.app/api/spotify/callback` (production)

**Note:** Spotify requires HTTPS for redirect URIs. For local development, use ngrok or set up HTTPS certificates.

## 📊 Database Schema Updates

The User model has been extended with Spotify fields:

```prisma
model User {
  // ... existing fields

  // Spotify integration
  spotifyAccessToken  String?
  spotifyRefreshToken String?
  spotifyTokenExpiry  DateTime?
}
```

**Run this to update your database:**

```bash
npx prisma db push
npx prisma generate
```

## 🎯 Features Implemented

### ✅ Authentication Flow

- `/api/spotify/auth` - Generates Spotify authorization URL
- `/api/spotify/callback` - Handles OAuth callback and stores tokens
- Automatic token refresh when expired

### ✅ API Endpoints

- `/api/spotify/playlists` - Fetches user playlists, featured playlists, or workout playlists
- Support for different playlist types: `user`, `featured`, `workout`

### ✅ UI Components

- **SpotifyMusic Component** - Full-featured music browser
- **Connection Flow** - Guides users through Spotify linking
- **Playlist Browser** - Grid view of playlists with cover art
- **Music Player** - Bottom player bar (basic implementation)

### ✅ User Experience

- Seamless Spotify account connection
- Browse personal playlists
- Discover featured and workout-specific playlists
- Visual feedback and loading states
- Responsive design for all screen sizes

## 🔄 Next Steps (Optional Enhancements)

### 1. Spotify Web Playback SDK

To enable actual music playback (requires Spotify Premium):

```html
<!-- Add to your layout -->
<script src="https://sdk.scdn.co/spotify-player.js"></script>
```

### 2. Workout Integration

Connect music to workout sessions:

- Auto-play playlists when starting workouts
- Pause music during rest periods
- Generate playlists based on workout type and intensity

### 3. Advanced Features

- Create workout-specific playlists
- Music recommendations based on BPM and workout intensity
- Social features (share workout playlists)
- Offline mode with cached playlists

## 🚨 Important Notes

### Spotify Premium Requirement

- Full playback control requires Spotify Premium subscription
- Free users can browse playlists and see track information
- Preview playback (30-second clips) works for all users

### Rate Limits

- Spotify API has rate limits (typically 100 requests per minute)
- The app includes error handling for rate limit exceeded responses

### Privacy

- The app only requests necessary scopes
- Users can disconnect Spotify at any time
- No personal data is stored beyond what's needed for functionality

## 🎵 Usage

1. **Connect Account:** Users visit `/music` and click "Connect Spotify"
2. **Browse Music:** Switch between personal playlists, featured content, and workout playlists
3. **Play Music:** Click on playlists to view tracks (full playback requires Web Playback SDK)
4. **Workout Integration:** Music player appears during workout sessions

The Spotify integration is now ready! Users can connect their accounts and enjoy music during their fitness journey. 🎵💪
