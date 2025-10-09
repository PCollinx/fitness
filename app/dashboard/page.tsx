"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaDumbbell,
  FaChartLine,
  FaRunning,
  FaCalendar,
  FaFire,
  FaWeight,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import WorkoutScheduleComponent from "../components/WorkoutSchedule";
import { useWorkoutStreak } from "../hooks/useWorkoutStreak";

type WorkoutSummary = {
  id: string;
  name: string;
  date: string;
  exercises: number;
};

type ComprehensiveProgress = {
  overallScores: {
    consistency: number;
    improvement: number;
  };
  workoutMetrics: {
    totalSessions: number;
    sessionsLast30Days: number;
    completionRate: number;
    averageDuration: number;
  };
  bodyMetrics: {
    current: {
      weight?: number;
      bodyFat?: number;
    } | null;
    trends: {
      weight: {
        current?: number;
        trend30d: number;
        trend7d: number;
      };
    };
  };
};

// Workout Streak Dashboard Component
function WorkoutStreakDashboard() {
  const { streakData, isLoading, error } = useWorkoutStreak();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6 col-span-full lg:col-span-2">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6 col-span-full lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-yellow-500 flex items-center">
          <FaTrophy className="mr-2" />
          Workout Streak
        </h2>
        <div className="text-center py-6">
          <FaTrophy className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Start your streak today!</p>
          <Link
            href="/workouts"
            className="inline-block mt-3 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Begin First Workout
          </Link>
        </div>
      </div>
    );
  }

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🎯";
    if (streak < 3) return "🔥";
    if (streak < 7) return "⚡";
    if (streak < 30) return "🚀";
    return "👑";
  };

  const getStreakMessage = (streak: number, isActive: boolean) => {
    if (streak === 0) return "Ready to start your fitness journey?";
    if (isActive)
      return "You've already worked out today! Keep the momentum going tomorrow.";
    if (streak === 1) return "Great start! One day down!";
    if (streak < 7) return `You're on a ${streak}-day streak! Keep it up!`;
    if (streak < 30)
      return `Amazing! ${streak} days in a row! You're unstoppable!`;
    return `Incredible! ${streak} consecutive days! You're a fitness legend!`;
  };

  const getNextMilestone = (currentStreak: number) => {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    return (
      milestones.find((milestone) => milestone > currentStreak) ||
      currentStreak + 30
    );
  };

  const nextMilestone = getNextMilestone(streakData.currentStreak);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full lg:col-span-2">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-yellow-500 flex items-center">
          <FaTrophy className="mr-2" />
          Workout Streak
        </h2>
      </div>

      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {streakData.currentStreak} Day{" "}
            {streakData.currentStreak === 1 ? "" : "s"}
          </div>
          <p className="text-gray-400 text-sm">
            {getStreakMessage(
              streakData.currentStreak,
              streakData.isActiveToday
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-gray-400">Best Streak</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-400">
              {nextMilestone}
            </div>
            <div className="text-xs text-gray-400">Next Goal</div>
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress to {nextMilestone} days</span>
            <span>
              {streakData.currentStreak}/{nextMilestone}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (streakData.currentStreak / nextMilestone) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/streak"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
  const [comprehensiveProgress, setComprehensiveProgress] =
    useState<ComprehensiveProgress | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch recent workouts
        const workoutsResponse = await fetch("/api/workouts/recent");
        if (workoutsResponse.ok) {
          const workoutsData = await workoutsResponse.json();
          setRecentWorkouts(workoutsData || []);
        } else {
          // Handle error but don't keep loading state
          console.error(
            "Error fetching workouts:",
            workoutsResponse.statusText
          );
          setRecentWorkouts([]);
        }

        // Note: Progress data is fetched via comprehensive endpoint only
        // Fetch comprehensive progress data
        const comprehensiveResponse = await fetch(
          "/api/progress/comprehensive"
        );
        if (comprehensiveResponse.ok) {
          const comprehensiveData = await comprehensiveResponse.json();
          setComprehensiveProgress(comprehensiveData);
        } else {
          console.error(
            "Error fetching comprehensive progress:",
            comprehensiveResponse.statusText
          );
          setComprehensiveProgress(null);
        }

        // Always set loading to false, even if data is empty
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Don't keep loading on error
        setIsLoading(false);
        setRecentWorkouts([]);
      }
    };

    fetchData();
  }, [status, router]);

  // Function to format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  // Helper function to render weight trend
  const renderWeightTrend = (trend: number) => {
    if (Math.abs(trend) < 0.1) {
      return <span className="text-gray-400 text-xs">No change</span>;
    }

    const isPositive = trend < 0; // For weight, decrease is positive
    const color = isPositive ? "text-green-400" : "text-red-400";

    return (
      <span className={`${color} text-xs flex items-center`}>
        {isPositive ? "↓" : "↑"} {Math.abs(trend).toFixed(1)}%
      </span>
    );
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-12 md:mt-16">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl mb-1 font-bold text-yellow-500">
          Welcome, {session?.user?.name.split(" ")[0] || "User"}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {recentWorkouts.length === 0
            ? "Get started with your fitness journey by creating your first workout"
            : "Here's an overview of your fitness journey"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Link
              href="/workouts"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaDumbbell className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Start Workout
              </span>
            </Link>

            <Link
              href="/progress/new?from=dashboard"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaChartLine className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Update Progress
              </span>
            </Link>

            <Link
              href="/workouts/history"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaRunning className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Workout History
              </span>
            </Link>

            <Link
              href="/schedule"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaCalendarAlt className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Schedule
              </span>
            </Link>

            <Link
              href="/streak"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaTrophy className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Streak & Goals
              </span>
            </Link>

            <Link
              href="/workouts/plan"
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaCalendar className="text-2xl text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-center text-white">
                Plan Workout
              </span>
            </Link>
          </div>
        </div>

        {/* Workout Schedule Widget */}
        <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full lg:col-span-2">
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-yellow-500">
                Weekly Schedule
              </h2>
              <Link
                href="/schedule"
                className="text-yellow-400 text-sm font-medium hover:underline"
              >
                Manage
              </Link>
            </div>
          </div>
          <div className="p-4">
            <WorkoutScheduleComponent compact={true} />
          </div>
        </div>

        {/* Workout Streak & Motivation */}
        <WorkoutStreakDashboard />

        {/* Recent Workouts */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-yellow-500">
              Recent Sessions
            </h2>
            <Link
              href="/workouts/history"
              className="text-yellow-400 text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border-b border-gray-700 pb-4 hover:bg-gray-700 p-2 rounded transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{workout.name}</h3>
                      <span className="text-sm text-yellow-400">
                        {formatDate(workout.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium">
                      {workout.exercises} exercises
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-4 text-yellow-500">
                    <FaDumbbell className="w-12 h-12" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    No workouts yet
                  </h3>
                  <p className="text-gray-400 text-center mb-4 max-w-xs">
                    Track your fitness journey by logging your first workout
                  </p>
                  <Link
                    href="/workouts/new"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg text-sm font-medium transition flex items-center"
                  >
                    <FaDumbbell className="mr-2" /> Create Your First Workout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-500">
              Progress Tracker
            </h2>
            <Link
              href="/progress"
              className="text-yellow-400 text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
            </div>
          ) : comprehensiveProgress ? (
            <div className="space-y-4">
              {/* Overall Scores */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">Consistency</span>
                    <FaFire className="text-orange-500 w-3 h-3" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-xl font-bold ${getScoreColor(
                        comprehensiveProgress.overallScores.consistency
                      )}`}
                    >
                      {comprehensiveProgress.overallScores.consistency}
                    </span>
                    <span className="text-gray-400 text-sm mb-0.5">/100</span>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">Improvement</span>
                    <FaChartLine className="text-green-500 w-3 h-3" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-xl font-bold ${getScoreColor(
                        comprehensiveProgress.overallScores.improvement
                      )}`}
                    >
                      {comprehensiveProgress.overallScores.improvement}
                    </span>
                    <span className="text-gray-400 text-sm mb-0.5">/100</span>
                  </div>
                </div>
              </div>

              {/* Workout Stats */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <FaDumbbell className="mr-2 text-yellow-500 w-4 h-4" />
                  Workout Performance
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sessions (30d)</span>
                    <span className="font-medium text-white">
                      {comprehensiveProgress.workoutMetrics.sessionsLast30Days}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Completion</span>
                    <span className="font-medium text-white">
                      {comprehensiveProgress.workoutMetrics.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Sessions</span>
                    <span className="font-medium text-white">
                      {comprehensiveProgress.workoutMetrics.totalSessions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Duration</span>
                    <span className="font-medium text-white">
                      {comprehensiveProgress.workoutMetrics.averageDuration}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Metrics */}
              {comprehensiveProgress.bodyMetrics.current && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaWeight className="mr-2 text-yellow-500 w-4 h-4" />
                    Body Metrics
                  </h3>
                  <div className="space-y-2">
                    {comprehensiveProgress.bodyMetrics.current.weight && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Weight</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {comprehensiveProgress.bodyMetrics.current.weight}{" "}
                            kg
                          </span>
                          {renderWeightTrend(
                            comprehensiveProgress.bodyMetrics.trends.weight
                              .trend30d
                          )}
                        </div>
                      </div>
                    )}
                    {comprehensiveProgress.bodyMetrics.current.bodyFat && (
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Body Fat</span>
                        <span className="font-medium text-white">
                          {comprehensiveProgress.bodyMetrics.current.bodyFat}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Action */}
              <div className="pt-2">
                <Link
                  href="/progress/new?from=dashboard"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center"
                >
                  <FaChartLine className="mr-2 w-4 h-4" />
                  Log Progress
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 text-yellow-500">
                <FaChartLine className="w-12 h-12" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                No progress data yet
              </h3>
              <p className="text-gray-400 text-center mb-4 max-w-xs">
                Start tracking your fitness metrics to visualize your progress
              </p>
              <Link
                href="/progress/new?from=dashboard"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg text-sm font-medium transition flex items-center"
              >
                <FaChartLine className="mr-2" /> Log Your First Measurement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
