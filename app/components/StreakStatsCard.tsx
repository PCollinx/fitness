"use client";

import { FaFire, FaTrophy } from "react-icons/fa";
import {
  useWorkoutStreak,
  getStreakEmoji,
  getStreakColor,
} from "@/app/hooks/useWorkoutStreak";

export default function StreakStatsCard() {
  const { streakData, isLoading, error } = useWorkoutStreak();

  if (isLoading) {
    return (
      <div className="bg-gray-700 rounded-lg p-3">
        <h3 className="font-medium text-white mb-2 flex items-center">
          <FaFire className="mr-2 text-yellow-500 w-4 h-4" />
          Workout Streak
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="bg-gray-700 rounded-lg p-3">
        <h3 className="font-medium text-white mb-2 flex items-center">
          <FaFire className="mr-2 text-yellow-500 w-4 h-4" />
          Workout Streak
        </h3>
        <p className="text-gray-400 text-sm">Unable to load streak data</p>
      </div>
    );
  }

  const streakEmoji = getStreakEmoji(streakData.currentStreak);
  const streakColorClass = getStreakColor(streakData.currentStreak);

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <h3 className="font-medium text-white mb-2 flex items-center">
        <FaFire className="mr-2 text-yellow-500 w-4 h-4" />
        Workout Streak
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Current</span>
          <span className={`font-medium ${streakColorClass} flex items-center`}>
            <span className="mr-1">{streakEmoji}</span>
            {streakData.currentStreak}
            <span className="text-gray-400 ml-1 text-xs">
              {streakData.currentStreak === 1 ? "day" : "days"}
            </span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Best</span>
          <span className="font-medium text-white flex items-center">
            <FaTrophy className="mr-1 text-yellow-400 w-3 h-3" />
            {streakData.longestStreak}
            <span className="text-gray-400 ml-1 text-xs">
              {streakData.longestStreak === 1 ? "day" : "days"}
            </span>
          </span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-300">Status</span>
          <span
            className={`font-medium text-sm ${
              streakData.isActiveToday ? "text-green-400" : "text-gray-400"
            }`}
          >
            {streakData.isActiveToday
              ? "✅ Worked out today!"
              : "⏰ Ready for today's workout"}
          </span>
        </div>
      </div>
    </div>
  );
}
