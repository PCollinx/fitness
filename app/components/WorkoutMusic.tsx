"use client";

import { useState } from "react";
import { FaPlay, FaPause, FaEllipsisH, FaSearch, FaBell } from "react-icons/fa";

interface SongProps {
  id: string;
  title: string;
  artist: string;
  isPlaying: boolean;
}

export default function WorkoutMusic() {
  const [songs, setSongs] = useState<SongProps[]>([
    {
      id: "1",
      title: "All music from the 90s",
      artist: "Various Artists",
      isPlaying: true,
    },
    {
      id: "2",
      title: "Going Bad (feat Drake)",
      artist: "Meek Mill",
      isPlaying: false,
    },
    {
      id: "3",
      title: "Cruel and Danger - Pinoehlsuki",
      artist: "Various Artists",
      isPlaying: false,
    },
    {
      id: "4",
      title: "Love Goes - Chief Keef",
      artist: "Various Artists",
      isPlaying: false,
    },
  ]);

  const togglePlayPause = (id: string) => {
    setSongs(
      songs.map((song) => ({
        ...song,
        isPlaying: song.id === id ? !song.isPlaying : false,
      }))
    );
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sound it</h1>
          <p className="text-gray-400 text-sm">
            Keep it both calm and up in your moves
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="text-white">
            <FaSearch className="h-5 w-5" />
          </button>
          <button className="text-white">
            <FaBell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 rounded-full bg-yellow-400 text-black font-medium text-sm">
          Popular tracks
        </button>
        <button className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm">
          Added apps
        </button>
      </div>

      {/* Now Playing Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Now playing</h2>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-800 rounded-md mr-4 flex items-center justify-center">
              <div className="h-6 w-1 bg-yellow-400 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">All music from the 90s</h3>
              <p className="text-sm text-gray-400">Various Artists</p>
            </div>
            <button
              className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-black"
              onClick={() => togglePlayPause("1")}
            >
              {songs[0].isPlaying ? (
                <FaPause className="h-4 w-4" />
              ) : (
                <FaPlay className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Your Queue Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">Your queue</h2>
        <div className="space-y-4">
          {songs.slice(1).map((song) => (
            <div key={song.id} className="flex items-center">
              <div className="h-10 w-10 bg-gray-800 rounded-md mr-4 flex items-center justify-center text-gray-400">
                {song.id}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
              <button className="text-gray-400 p-2">
                <FaEllipsisH className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
