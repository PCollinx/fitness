import {
  spotifyApiRequest,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyUser,
  SpotifyDevice,
  SpotifyPlaybackState,
} from "./config";

export class SpotifyService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // User Profile
  async getCurrentUser(): Promise<SpotifyUser> {
    return spotifyApiRequest("/me", this.accessToken);
  }

  // Playlists
  async getUserPlaylists(
    limit = 20,
    offset = 0
  ): Promise<{ items: SpotifyPlaylist[] }> {
    return spotifyApiRequest(
      `/me/playlists?limit=${limit}&offset=${offset}`,
      this.accessToken
    );
  }

  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    return spotifyApiRequest(`/playlists/${playlistId}`, this.accessToken);
  }

  async getPlaylistTracks(
    playlistId: string,
    limit = 50,
    offset = 0
  ): Promise<{ items: Array<{ track: SpotifyTrack }> }> {
    return spotifyApiRequest(
      `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
      this.accessToken
    );
  }

  // Search
  async search(
    query: string,
    type: "track" | "playlist" | "artist" | "album" = "track",
    limit = 20
  ): Promise<any> {
    const encodedQuery = encodeURIComponent(query);
    return spotifyApiRequest(
      `/search?q=${encodedQuery}&type=${type}&limit=${limit}`,
      this.accessToken
    );
  }

  // Playback Control
  async getPlaybackState(): Promise<SpotifyPlaybackState | null> {
    try {
      return await spotifyApiRequest("/me/player", this.accessToken);
    } catch (error) {
      // Return null if no active device
      return null;
    }
  }

  async getAvailableDevices(): Promise<{ devices: SpotifyDevice[] }> {
    return spotifyApiRequest("/me/player/devices", this.accessToken);
  }

  async transferPlayback(deviceId: string, play = false): Promise<void> {
    await spotifyApiRequest("/me/player", this.accessToken, {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [deviceId],
        play,
      }),
    });
  }

  async play(
    deviceId?: string,
    contextUri?: string,
    uris?: string[],
    positionMs?: number
  ): Promise<void> {
    const body: any = {};

    if (contextUri) body.context_uri = contextUri;
    if (uris) body.uris = uris;
    if (positionMs) body.position_ms = positionMs;

    const url = deviceId
      ? `/me/player/play?device_id=${deviceId}`
      : "/me/player/play";

    await spotifyApiRequest(url, this.accessToken, {
      method: "PUT",
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });
  }

  async pause(deviceId?: string): Promise<void> {
    const url = deviceId
      ? `/me/player/pause?device_id=${deviceId}`
      : "/me/player/pause";

    await spotifyApiRequest(url, this.accessToken, {
      method: "PUT",
    });
  }

  async skipToNext(deviceId?: string): Promise<void> {
    const url = deviceId
      ? `/me/player/next?device_id=${deviceId}`
      : "/me/player/next";

    await spotifyApiRequest(url, this.accessToken, {
      method: "POST",
    });
  }

  async skipToPrevious(deviceId?: string): Promise<void> {
    const url = deviceId
      ? `/me/player/previous?device_id=${deviceId}`
      : "/me/player/previous";

    await spotifyApiRequest(url, this.accessToken, {
      method: "POST",
    });
  }

  async setVolume(volumePercent: number, deviceId?: string): Promise<void> {
    const url = deviceId
      ? `/me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}`
      : `/me/player/volume?volume_percent=${volumePercent}`;

    await spotifyApiRequest(url, this.accessToken, {
      method: "PUT",
    });
  }

  async setShuffle(state: boolean, deviceId?: string): Promise<void> {
    const url = deviceId
      ? `/me/player/shuffle?state=${state}&device_id=${deviceId}`
      : `/me/player/shuffle?state=${state}`;

    await spotifyApiRequest(url, this.accessToken, {
      method: "PUT",
    });
  }

  async setRepeatMode(
    state: "track" | "context" | "off",
    deviceId?: string
  ): Promise<void> {
    const url = deviceId
      ? `/me/player/repeat?state=${state}&device_id=${deviceId}`
      : `/me/player/repeat?state=${state}`;

    await spotifyApiRequest(url, this.accessToken, {
      method: "PUT",
    });
  }

  // Featured and Workout Playlists
  async getFeaturedPlaylists(
    limit = 20
  ): Promise<{ playlists: { items: SpotifyPlaylist[] } }> {
    return spotifyApiRequest(
      `/browse/featured-playlists?limit=${limit}`,
      this.accessToken
    );
  }

  async getCategoryPlaylists(
    categoryId: string,
    limit = 20
  ): Promise<{ playlists: { items: SpotifyPlaylist[] } }> {
    return spotifyApiRequest(
      `/browse/categories/${categoryId}/playlists?limit=${limit}`,
      this.accessToken
    );
  }

  async getWorkoutPlaylists(): Promise<{
    playlists: { items: SpotifyPlaylist[] };
  }> {
    // Get playlists from the workout category
    return this.getCategoryPlaylists("workout", 20);
  }

  // Create workout-specific playlist
  async createWorkoutPlaylist(
    userId: string,
    name: string,
    description = "Created by Fitness App for workout sessions"
  ): Promise<SpotifyPlaylist> {
    return spotifyApiRequest(`/users/${userId}/playlists`, this.accessToken, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        public: false,
      }),
    });
  }

  // Add tracks to playlist
  async addTracksToPlaylist(
    playlistId: string,
    trackUris: string[]
  ): Promise<void> {
    await spotifyApiRequest(
      `/playlists/${playlistId}/tracks`,
      this.accessToken,
      {
        method: "POST",
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );
  }

  // Get track recommendations based on workout intensity
  async getWorkoutRecommendations(
    intensity: "low" | "medium" | "high" = "medium",
    limit = 20
  ): Promise<{ tracks: SpotifyTrack[] }> {
    const energyMap = {
      low: { energy: 0.3, valence: 0.5, tempo: 100 },
      medium: { energy: 0.7, valence: 0.7, tempo: 128 },
      high: { energy: 0.9, valence: 0.8, tempo: 140 },
    };

    const params = energyMap[intensity];

    return spotifyApiRequest(
      `/recommendations?seed_genres=pop,rock,electronic&limit=${limit}&target_energy=${params.energy}&target_valence=${params.valence}&target_tempo=${params.tempo}`,
      this.accessToken
    );
  }
}
