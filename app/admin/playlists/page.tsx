"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  external_urls: { spotify: string };
  images: Array<{ url: string }>;
  tracks: { total: number };
}

interface DefaultPlaylist {
  id: string;
  name: string;
  description: string | null;
  spotifyPlaylistId: string;
  spotifyPlaylistUrl: string;
  category: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

export default function AdminPlaylistsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>(
    []
  );
  const [defaultPlaylists, setDefaultPlaylists] = useState<DefaultPlaylist[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyPlaylist | null>(null);
  const [category, setCategory] = useState<"workout" | "general">("workout");
  const [customDescription, setCustomDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"spotify" | "defaults">(
    "defaults"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchDefaultPlaylists();
    checkSpotifyConnection();
  }, []);

  const checkSpotifyConnection = async () => {
    try {
      const response = await fetch("/api/spotify/playlists?type=user&limit=1");
      setSpotifyConnected(response.ok);
    } catch (error) {
      setSpotifyConnected(false);
    }
  };

  const fetchSpotifyPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        "/api/spotify/playlists?type=user&limit=50"
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch Spotify playlists");
      }

      const data = await response.json();
      setSpotifyPlaylists(data.items || []);
      
      if (!data.items || data.items.length === 0) {
        setError("No playlists found in your Spotify account");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load Spotify playlists");
      setSpotifyPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/default-playlists");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch default playlists");
      }

      const data = await response.json();
      setDefaultPlaylists(data.playlists || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load default playlists");
      setDefaultPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDefault = async () => {
    if (!selectedPlaylist) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/default-playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedPlaylist.name,
          description: customDescription || selectedPlaylist.description || "",
          spotifyPlaylistId: selectedPlaylist.id,
          spotifyPlaylistUrl: selectedPlaylist.external_urls.spotify,
          category,
          imageUrl: (selectedPlaylist.images && Array.isArray(selectedPlaylist.images) && selectedPlaylist.images[0]?.url) || null,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save playlist");
      }

      setSuccess("Playlist saved as default successfully!");
      setSelectedPlaylist(null);
      setCustomDescription("");
      fetchDefaultPlaylists();
      setActiveTab("defaults");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save playlist"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (playlist: DefaultPlaylist) => {
    try {
      const response = await fetch("/api/admin/default-playlists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: playlist.id,
          isActive: !playlist.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      setSuccess("Playlist updated successfully!");
      fetchDefaultPlaylists();
    } catch (error) {
      setError("Failed to update playlist");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this default playlist?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/default-playlists?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      setSuccess("Playlist deleted successfully!");
      fetchDefaultPlaylists();
    } catch (error) {
      setError("Failed to delete playlist");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <BackButton />

        <div className="mt-4 sm:mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2">
            Manage Default Playlists
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            Set up default Spotify playlists for all users
          </p>

          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm sm:text-base">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 sm:p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400 text-sm sm:text-base">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("defaults")}
              className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === "defaults"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Default Playlists ({defaultPlaylists.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("spotify");
                if (spotifyConnected && spotifyPlaylists.length === 0) {
                  fetchSpotifyPlaylists();
                }
              }}
              className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === "spotify"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Add from Spotify
            </button>
          </div>

          {/* Default Playlists Tab */}
          {activeTab === "defaults" && (
            <div className="space-y-3 sm:space-y-4">
              {defaultPlaylists.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-gray-800 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">
                    No default playlists yet
                  </p>
                  <button
                    onClick={() => setActiveTab("spotify")}
                    className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm sm:text-base"
                  >
                    Add Your First Playlist
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {Array.isArray(defaultPlaylists) &&
                    defaultPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700"
                      >
                      <div className="flex gap-3 sm:gap-4">
                        {playlist.imageUrl && (
                          <img
                            src={playlist.imageUrl}
                            alt={playlist.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {playlist.name}
                          </h3>
                          {playlist.description && (
                            <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                              {playlist.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                            <span
                              className={`text-xs px-2 py-0.5 sm:py-1 rounded ${
                                playlist.category === "workout"
                                  ? "bg-yellow-400/20 text-yellow-400"
                                  : "bg-blue-400/20 text-blue-400"
                              }`}
                            >
                              {playlist.category}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 sm:py-1 rounded ${
                                playlist.isActive
                                  ? "bg-green-400/20 text-green-400"
                                  : "bg-gray-600/20 text-gray-400"
                              }`}
                            >
                              {playlist.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex gap-2 mt-3 sm:mt-4">
                        <button
                          onClick={() => handleToggleActive(playlist)}
                          className="px-2 sm:px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                        >
                          {playlist.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <a
                          href={playlist.spotifyPlaylistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 sm:px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-xs sm:text-sm transition-colors text-center whitespace-nowrap col-span-2 sm:col-span-1 sm:flex-1"
                        >
                          Open in Spotify
                        </a>
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="px-2 sm:px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-xs sm:text-sm transition-colors whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}{" "}
                </div>
              )}
            </div>
          )}

          {/* Add from Spotify Tab */}
          {activeTab === "spotify" && (
            <div>
              {!spotifyConnected ? (
                <div className="text-center py-8 sm:py-12 bg-gray-800 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-4">
                    Connect your Spotify account to add playlists
                  </p>
                  <a
                    href="/api/spotify/auth"
                    className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Connect Spotify
                  </a>
                </div>
              ) : selectedPlaylist ? (
                <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Save as Default Playlist
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {selectedPlaylist.images && Array.isArray(selectedPlaylist.images) && selectedPlaylist.images.length > 0 && selectedPlaylist.images[0]?.url ? (
                      <img
                        src={selectedPlaylist.images[0].url}
                        alt={selectedPlaylist.name}
                        className="w-full sm:w-32 h-48 sm:h-32 rounded object-cover"
                      />
                    ) : (
                      <div className="w-full sm:w-32 h-48 sm:h-32 rounded bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-16 h-16 text-white opacity-50"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {selectedPlaylist.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        {selectedPlaylist.description || "No description"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        {selectedPlaylist.tracks.total} tracks
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as "workout" | "general")
                        }
                        className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                      >
                        <option value="workout">Workout</option>
                        <option value="general">General</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Workout playlists appear during workouts, General
                        playlists appear in the music page
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Custom Description (optional)
                      </label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Add a custom description for users..."
                        className="w-full px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm sm:text-base"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={handleSaveAsDefault}
                        disabled={saving}
                        className="flex-1 px-4 py-2.5 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {saving ? "Saving..." : "Save as Default"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlaylist(null);
                          setCustomDescription("");
                        }}
                        className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 sm:mb-4">
                    <button
                      onClick={fetchSpotifyPlaylists}
                      className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      Refresh Playlists
                    </button>
                  </div>

                  {spotifyPlaylists.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 bg-gray-800 rounded-lg">
                      <p className="text-sm sm:text-base text-gray-400 px-4">No playlists found</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.isArray(spotifyPlaylists) &&
                        spotifyPlaylists.map((playlist) => {
                          const isAlreadyDefault =
                            Array.isArray(defaultPlaylists) &&
                            defaultPlaylists.some(
                              (dp) => dp.spotifyPlaylistId === playlist.id
                            );

                        return (
                          <div
                            key={playlist.id}
                            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                          >
                            {playlist.images && Array.isArray(playlist.images) && playlist.images.length > 0 && playlist.images[0]?.url ? (
                              <img
                                src={playlist.images[0].url}
                                alt={playlist.name}
                                className="w-full h-40 sm:h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                                <svg
                                  className="w-16 sm:w-20 h-16 sm:h-20 text-white opacity-50"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                </svg>
                              </div>
                            )}
                            <div className="p-3 sm:p-4">
                              <h3 className="font-semibold text-sm sm:text-base truncate">
                                {playlist.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                                {playlist.description || "No description"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                                {playlist.tracks.total} tracks
                              </p>

                              <button
                                onClick={() => setSelectedPlaylist(playlist)}
                                disabled={isAlreadyDefault}
                                className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                              >
                                {isAlreadyDefault
                                  ? "Already Default"
                                  : "Set as Default"}
                              </button>
                            </div>
                          </div>
                        );
                      })}{" "}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
