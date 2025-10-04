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
  FaUsers,
  FaFire,
  FaWeight,
} from "react-icons/fa";

type WorkoutSummary = {
  id: string;
  name: string;
  date: string;
  exercises: number;
};

type ProgressSummary = {
  date: string;
  weight: number;
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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
  const [progressData, setProgressData] = useState<ProgressSummary[]>([]);
  const [comprehensiveProgress, setComprehensiveProgress] =
    useState<ComprehensiveProgress | null>(null);

  // Chart utility functions
  const calculateChartData = (data: ProgressSummary[]) => {
    const chartHeight = 96; // Available height accounting for padding

    if (!data.length)
      return {
        positions: [],
        range: { min: 0, max: 100, span: 100 },
        chartHeight,
      };

    const weights = data.map((p) => p.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const weightRange = maxWeight - minWeight || 1;

    const positions = data.map((point, index) => {
      const normalizedValue = (point.weight - minWeight) / weightRange;
      const barHeight = Math.max(normalizedValue * chartHeight * 0.8 + 12, 8);
      const barWidth = 100 / data.length;
      const xPosition = (index + 0.5) * barWidth;
      const yPosition = chartHeight - barHeight;

      return {
        x: xPosition,
        y: yPosition,
        height: barHeight,
        weight: point.weight,
        date: point.date,
        index,
      };
    });

    return {
      positions,
      range: { min: minWeight, max: maxWeight, span: weightRange },
      chartHeight,
    };
  };

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

        // Fetch progress data
        const progressResponse = await fetch("/api/progress/recent");
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();

          // Only set the progress data if we have at least one entry
          if (progressData && progressData.length > 0) {
            setProgressData(progressData);
          } else {
            // Set empty array for no progress data
            setProgressData([]);
          }
        } else {
          // Handle error but don't keep loading state
          console.error(
            "Error fetching progress:",
            progressResponse.statusText
          );
          setProgressData([]);
        }

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
        setProgressData([]);
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
          Welcome, {session?.user?.name || "User"}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {recentWorkouts.length === 0 && progressData.length === 0
            ? "Get started with your fitness journey by creating your first workout"
            : "Here's an overview of your fitness journey"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Recent Workouts */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
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
                    href="/workouts/create"
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
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
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
