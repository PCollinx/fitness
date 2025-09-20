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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
  const [progressData, setProgressData] = useState<ProgressSummary[]>([]);

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

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 mt-8 md:mt-16">
      <div className="mb-8">
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
              href="/workouts/new"
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
              Recent Workouts
            </h2>
            <Link
              href="/workouts"
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
          ) : progressData.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">Weight</h3>
                <span className="text-sm font-medium text-yellow-400">
                  {progressData[0].weight} kg
                </span>
              </div>

              <div className="relative h-32 sm:h-36 bg-gray-700/50 rounded-xl p-4 overflow-hidden border border-gray-600/50">
                {/* Chart Container */}
                <div className="h-full flex items-end justify-between relative">
                  {/* Progress Chart Visualization */}
                  {(() => {
                    const {
                      positions: barPositions,
                      range,
                      chartHeight,
                    } = calculateChartData(progressData);

                    return (
                      <>
                        {/* Connecting Line */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            fill="none"
                            stroke="rgba(250, 204, 21, 0.6)"
                            strokeWidth="2"
                            points={barPositions
                              .map(
                                (pos) =>
                                  `${pos.x}%,${(pos.y / chartHeight) * 100}%`
                              )
                              .join(" ")}
                          />
                          {/* Gradient fill under the line */}
                          <defs>
                            <linearGradient
                              id="chartGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="rgba(250, 204, 21, 0.2)"
                              />
                              <stop
                                offset="100%"
                                stopColor="rgba(250, 204, 21, 0.05)"
                              />
                            </linearGradient>
                          </defs>
                          <polygon
                            fill="url(#chartGradient)"
                            points={`${barPositions
                              .map(
                                (pos) =>
                                  `${pos.x}%,${(pos.y / chartHeight) * 100}%`
                              )
                              .join(" ")} ${
                              barPositions[barPositions.length - 1]?.x || 0
                            }%,100% 0%,100%`}
                          />
                        </svg>

                        {/* Data Points and Labels */}
                        {progressData.map((point, index) => {
                          const position = barPositions[index];
                          const isFirst = index === 0;
                          const isLast = index === progressData.length - 1;
                          const isMostRecent = index === 0; // Assuming first is most recent

                          return (
                            <div
                              key={index}
                              className="relative flex flex-col items-center group"
                              style={{ flex: "1 1 0%" }}
                            >
                              {/* Weight Value Tooltip */}
                              <div
                                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-yellow-400 text-xs font-semibold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 ${
                                  isMostRecent ? "opacity-100" : ""
                                }`}
                              >
                                {point.weight}kg
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                              </div>

                              {/* Data Point Circle */}
                              <div
                                className={`relative w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                                  isMostRecent
                                    ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50 scale-125"
                                    : "bg-yellow-500 border-yellow-400 hover:scale-110 group-hover:shadow-md"
                                }`}
                                style={{
                                  marginBottom: `${position.height - 6}px`,
                                }}
                              >
                                {/* Pulse animation for most recent point */}
                                {isMostRecent && (
                                  <div className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                                )}
                              </div>

                              {/* Date Label */}
                              <div className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors mt-1 text-center leading-tight">
                                <div className="truncate max-w-[3rem] sm:max-w-none">
                                  {formatDate(point.date).split(" ")[0]}
                                </div>
                                <div className="text-[10px] text-gray-500 sm:hidden">
                                  {formatDate(point.date).split(" ")[1]}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>

                {/* Chart Info */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                    Weight (kg)
                  </span>
                </div>
              </div>

              {progressData.length >= 3 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-white">
                    Recent Changes
                  </h3>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        1 Week
                      </p>
                      <p
                        className={`font-medium ${
                          progressData[0].weight < progressData[1].weight
                            ? "text-green-400"
                            : progressData[0].weight > progressData[1].weight
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {(
                          progressData[0].weight - progressData[1].weight
                        ).toFixed(1)}{" "}
                        kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        1 Month
                      </p>
                      <p
                        className={`font-medium ${
                          progressData[0].weight <
                          progressData[progressData.length - 1].weight
                            ? "text-green-400"
                            : progressData[0].weight >
                              progressData[progressData.length - 1].weight
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {(
                          progressData[0].weight -
                          progressData[progressData.length - 1].weight
                        ).toFixed(1)}{" "}
                        kg
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
