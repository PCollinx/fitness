"use client";

import { FaFire, FaTrophy } from "react-icons/fa";
import { useWorkoutStreak, getStreakMessage, getStreakEmoji } from "@/app/hooks/useWorkoutStreak";
import { useEffect } from "react";

export default function StreakCelebration() {
  const { streakData, isLoading, refetch } = useWorkoutStreak();

  // Refetch streak data when component mounts to get updated data after workout completion
  useEffect(() => {
    // Add a small delay to ensure the workout session has been saved before fetching streak
    const timeoutId = setTimeout(() => {
      refetch();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <FaFire className="text-yellow-400 text-2xl mr-2" />
          <span className="text-yellow-400 font-bold text-lg">Loading Streak...</span>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <FaFire className="text-yellow-400 text-2xl mr-2" />
          <span className="text-yellow-400 font-bold text-lg">Streak Error</span>
        </div>
        <p className="text-gray-300 text-sm text-center">Unable to load streak data</p>
      </div>
    );
  }

  const streakEmoji = getStreakEmoji(streakData.currentStreak);
  const message = getStreakMessage(streakData.currentStreak, streakData.isActiveToday);

  return (
    <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center mb-2">
        <FaFire className="text-yellow-400 text-2xl mr-2" />
        <span className="text-yellow-400 font-bold text-lg">Streak Update!</span>
      </div>
      
      <div className="text-center">
        <p className="text-white font-semibold mb-2">
          {message}
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="text-3xl mr-1">{streakEmoji}</span>
              <span className="text-3xl font-bold text-yellow-400">
                {streakData.currentStreak}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {streakData.currentStreak === 1 ? 'First Day!' : 'Day Streak'}
            </p>
          </div>
          
          {streakData.longestStreak > streakData.currentStreak && (
            <div className="text-center">
              <div className="flex items-center justify-center">
                <FaTrophy className="text-yellow-400 mr-1" />
                <span className="text-lg font-bold text-white">
                  {streakData.longestStreak}
                </span>
              </div>
              <p className="text-gray-300 text-xs">Personal Best</p>
            </div>
          )}
        </div>
        
        {streakData.currentStreak >= streakData.longestStreak && streakData.currentStreak > 1 && (
          <p className="text-yellow-300 text-sm mt-2 font-medium">
            🎉 New personal best streak!
          </p>
        )}
        
        {streakData.currentStreak === 1 && (
          <p className="text-green-400 text-sm mt-2 font-medium">
            🌟 Great start! Keep it going tomorrow!
          </p>
        )}
      </div>
    </div>
  );
}