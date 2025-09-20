"use client";

import { FaMusic, FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from "react-icons/fa";
import { useState } from "react";

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playlists = [
    { name: "Workout Hits", songs: 25, duration: "1h 45m" },
    { name: "Cardio Beats", songs: 18, duration: "1h 12m" },
    { name: "Strength Training", songs: 22, duration: "1h 35m" },
    { name: "Cool Down", songs: 12, duration: "45m" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Workout Music</h1>
          <p className="text-gray-400">Power your workouts with the perfect soundtrack</p>
        </div>

        {/* Current Player */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                <FaMusic className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Eye of the Tiger</h3>
                <p className="text-gray-400">Survivor</p>
              </div>
            </div>
            <div className="text-yellow-400">
              <FaVolumeUp className="w-5 h-5" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full w-1/3"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1:23</span>
              <span>4:04</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <FaBackward className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 hover:bg-yellow-300 transition-colors"
            >
              {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-1" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FaForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Playlists */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlists.map((playlist, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <FaMusic className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm">{playlist.songs} songs • {playlist.duration}</p>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                    <FaPlay className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-750 transition-colors">
            <div className="text-yellow-400 mb-2">
              <FaMusic className="w-6 h-6" />
            </div>
            <h3 className="text-white font-medium">Browse Music</h3>
            <p className="text-gray-400 text-sm">Discover new workout tracks</p>
          </button>
          <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-750 transition-colors">
            <div className="text-yellow-400 mb-2">
              <FaPlay className="w-6 h-6" />
            </div>
            <h3 className="text-white font-medium">Recently Played</h3>
            <p className="text-gray-400 text-sm">Your workout history</p>
          </button>
        </div>
      </div>
    </div>
  );
}