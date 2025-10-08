"use client";

import { FaFire, FaTrophy, FaCalendar } from "react-icons/fa";
import {
  useWorkoutStreak,
  getStreakMessage,
} from "@/app/hooks/useWorkoutStreak";

interface WorkoutStreakProps {
  onContinue?: () => void;
  onEnd?: () => void;
  showActions?: boolean;
}

export default function WorkoutStreak({
  onContinue,
  onEnd,
  showActions = true,
}: WorkoutStreakProps) {
  const { streakData, isLoading, error, refetch } = useWorkoutStreak();

  const getEncouragementText = (streak: number, isActive: boolean) => {
    if (streak === 0)
      return "Complete your first workout to start building your streak!";
    if (isActive)
      return "You've already worked out today! Keep the momentum going tomorrow.";
    return `Add another workout to keep your ${streak}-day streak alive!`;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <p className="mt-4 text-gray-400">Loading your streak...</p>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">Failed to load streak data</p>
        <button
          onClick={refetch}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <FaFire className="text-6xl text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {streakData.currentStreak > 0
            ? "You're on Fire!"
            : "Ready to Ignite?"}
        </h1>
        <p className="text-gray-300 text-lg">
          {getStreakMessage(streakData.currentStreak, streakData.isActiveToday)}
        </p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-md">
        <div className="bg-gray-700 rounded-lg p-4">
          <FaFire className="text-yellow-400 text-2xl mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Current Streak</p>
          <p className="text-white font-bold text-2xl">
            {streakData.currentStreak}
          </p>
          <p className="text-gray-400 text-xs">
            {streakData.currentStreak === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <FaTrophy className="text-yellow-400 text-2xl mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Best Streak</p>
          <p className="text-white font-bold text-2xl">
            {streakData.longestStreak}
          </p>
          <p className="text-gray-400 text-xs">
            {streakData.longestStreak === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <FaCalendar className="text-yellow-400 text-2xl mx-auto mb-2" />
          <p className="text-gray-300 text-sm">Last Workout</p>
          <p className="text-white font-bold text-lg">
            {streakData.lastWorkout
              ? new Date(streakData.lastWorkout).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Never"}
          </p>
        </div>
      </div>

      {/* Encouragement */}
      <p className="text-gray-300 mb-8 max-w-sm">
        {getEncouragementText(
          streakData.currentStreak,
          streakData.isActiveToday
        )}
      </p>

      {/* Streak Visualization */}
      {streakData.streakDays.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-300 mb-4">
            Recent Activity
          </h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {streakData.streakDays.slice(-7).map((day, index) => (
              <div
                key={day}
                className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"
                title={new Date(day).toLocaleDateString()}
              >
                <FaFire className="text-black text-xs" />
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-2">Last 7 workout days</p>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-lg bg-yellow-400 text-black font-medium hover:bg-yellow-300 transition-colors"
          >
            {streakData.isActiveToday ? "View Workouts" : "Start Workout"}
          </button>
        </div>
      )}
    </div>
  );
}
