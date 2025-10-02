"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  FaSpotify,
  FaExternalLinkAlt,
  FaPlus,
  FaDumbbell,
  FaUser,
} from "react-icons/fa";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { total: number };
  external_urls: { spotify: string };
  owner: { display_name: string };
}

interface SpotifyTrack {
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

export default function SpotifyMusic() {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [activeTab, setActiveTab] = useState<"user" | "workout">("user");

  useEffect(() => {
    if (status === "authenticated") {
      checkSpotifyConnection();
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && isConnected) {
      fetchPlaylists();
    }
  }, [status, activeTab, isConnected]);

  // Check for connection success in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("connected") === "true") {
      // Remove the parameter and check connection
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => checkSpotifyConnection(), 1000);
    }
  }, []);

  const checkSpotifyConnection = async () => {
    try {
      // Check if user has connected Spotify by trying to fetch their profile
      const response = await fetch("/api/spotify/me");

      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking Spotify connection:", error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const connectSpotify = async () => {
    try {
      const response = await fetch("/api/spotify/auth");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error connecting to Spotify:", error);
    }
  };

  const fetchPlaylists = async () => {
    if (!isConnected) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/spotify/playlists?type=${activeTab}&limit=20`
      );

      if (response.ok) {
        const data = await response.json();
        const playlistItems = data.items || data.playlists?.items || [];
        setPlaylists(playlistItems);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPlaylistInSpotify = (playlist: SpotifyPlaylist) => {
    // Open playlist directly in Spotify
    window.open(playlist.external_urls.spotify, "_blank");
  };

  const createWorkoutPlaylist = () => {
    // Redirect to Spotify to create a new playlist
    const spotifyCreateUrl = "https://open.spotify.com/playlist/create";
    window.open(spotifyCreateUrl, "_blank");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to access music</h1>
          <p className="text-gray-400">
            Please sign in to connect your Spotify account
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <FaSpotify className="text-6xl text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Connect to Spotify</h1>
              <p className="text-gray-400 mb-8">
                Link your Spotify account to play music during workouts
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">What you'll get:</h3>
              <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Access to your playlists
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Workout-optimized playlists
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Control playback during exercises
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Music recommendations based on workout intensity
                </li>
              </ul>
            </div>

            <button
              onClick={connectSpotify}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <FaSpotify className="text-xl" />
              <span>Connect Spotify</span>
            </button>

            <p className="text-xs text-gray-500 mt-4">
              We'll only access your public playlists and playback controls
            </p>
          </div>
        </div>
      </div>
    );
  }
  {
    /*Main header */
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FaSpotify className="text-2xl sm:text-3xl text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  Music Library
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm dark:text-gray-400 truncate">
                  Manage your Spotify playlists for workouts
                </p>
              </div>
            </div>

            <button
              onClick={createWorkoutPlaylist}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 transition-colors shadow-lg text-sm sm:text-base flex-shrink-0 w-full sm:w-auto"
            >
              <FaPlus className="text-sm" />
              <span className="hidden xs:inline sm:inline">
                Create Playlist
              </span>
              <span className="xs:hidden sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Simple Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
          {[
            {
              key: "user",
              label: "My Playlists",
              shortLabel: "My Music",
              icon: <FaUser />,
            },
            {
              key: "workout",
              label: "Workout",
              shortLabel: "Workout",
              icon: <FaDumbbell />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className="text-green-500">{tab.icon}</span>
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
              <span className="xs:hidden sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 aspect-square rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-200 dark:border-gray-700 hover:border-green-500/50"
                onClick={() => openPlaylistInSpotify(playlist)}
              >
                {/* Playlist Cover */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={playlist.images?.[0]?.url || "/placeholder-album.png"}
                    alt={playlist.name}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <FaSpotify className="text-3xl mx-auto mb-2" />
                      <p className="text-sm">Open in Spotify</p>
                    </div>
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base">
                    {playlist.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                    {playlist.description ||
                      `By ${playlist.owner.display_name}`}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                      {playlist.tracks.total} tracks
                    </span>
                    <FaExternalLinkAlt className="text-green-500 flex-shrink-0 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {playlists.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <FaSpotify className="text-6xl text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                No playlists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {activeTab === "user"
                  ? "Create your first playlist to get started"
                  : "Switch to 'My Playlists' to see your music"}
              </p>
              <button
                onClick={createWorkoutPlaylist}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <FaPlus />
                <span>Create Playlist</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
