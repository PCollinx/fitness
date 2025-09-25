"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
  FaDumbbell,
  FaCheck,
  FaTimes,
  FaHistory,
  FaLayerGroup,
  FaWeightHanging,
  FaClipboardList,
} from "react-icons/fa";
import {
  fetchWorkoutSessions,
  type WorkoutSessionWithDetails,
} from "../../utils/workoutSessionApi";

export default function WorkoutHistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSessionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkoutSessions();
  }, []);

  const loadWorkoutSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchWorkoutSessions();
      setSessions(response.sessions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load workout sessions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate session statistics
  const getSessionStats = (session: WorkoutSessionWithDetails) => {
    const totalSets = session.exercises.reduce(
      (acc, ex) => acc + ex.sets.length,
      0
    );
    const completedSets = session.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((set) => set.completed).length,
      0
    );

    return { totalSets, completedSets };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/workouts"
            className="text-yellow-500 hover:text-yellow-400 flex items-center transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Workouts</span>
          </Link>

          <div className="flex items-center mb-2">
            <FaHistory className="text-yellow-500 mr-3 h-6 w-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Workout History
            </h1>
          </div>
          <p className="text-gray-400">Your completed workout sessions</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaTimes className="text-red-500 mr-2" />
              <span className="text-white">{error}</span>
            </div>
            <button
              onClick={loadWorkoutSessions}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && sessions.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <FaHistory className="mx-auto h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No workout sessions yet
            </h3>
            <p className="text-gray-400 mb-6">
              Complete your first workout to see it here!
            </p>
            <Link
              href="/workouts"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md inline-flex items-center font-medium transition-colors"
            >
              <FaDumbbell className="mr-2" />
              <span>Browse Workouts</span>
            </Link>
          </div>
        )}

        {/* Sessions List */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const { totalSets, completedSets } = getSessionStats(session);
              const completionRate =
                totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

              return (
                <div
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors"
                >
                  {/* Session Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                        {session.workout.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(session.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaLayerGroup className="mr-1" />
                          <span>
                            {completedSets}/{totalSets} sets
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exercises Summary */}
                  <div className="space-y-2">
                    {session.exercises.map((exercise) => {
                      const exerciseCompletedSets = exercise.sets.filter(
                        (set) => set.completed
                      ).length;
                      const exerciseTotalSets = exercise.sets.length;

                      return (
                        <div
                          key={exercise.id}
                          className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <span className="text-white font-medium truncate">
                              {exercise.exercise.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 ml-4">
                            <div className="flex items-center text-xs text-gray-400">
                              <FaLayerGroup className="mr-1" />
                              <span>
                                {exerciseCompletedSets}/{exerciseTotalSets}
                              </span>
                            </div>

                            {exercise.sets.some((set) => set.actualWeight) && (
                              <div className="flex items-center text-xs text-gray-400">
                                <FaWeightHanging className="mr-1" />
                                <span>
                                  {Math.max(
                                    ...exercise.sets.map(
                                      (set) => set.actualWeight || 0
                                    )
                                  )}
                                  kg
                                </span>
                              </div>
                            )}

                            <div className="flex items-center">
                              {exerciseCompletedSets === exerciseTotalSets ? (
                                <FaCheck className="text-green-500 h-4 w-4" />
                              ) : (
                                <div className="text-yellow-500 text-xs font-medium">
                                  {Math.round(
                                    (exerciseCompletedSets /
                                      exerciseTotalSets) *
                                      100
                                  )}
                                  %
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-700 rounded">
                      <div className="text-xs text-gray-400 mb-1">Notes</div>
                      <div className="text-sm text-gray-200">
                        {session.notes}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
