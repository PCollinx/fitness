"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPlus,
  FaWeight,
  FaRuler,
  FaHeartbeat,
  FaCalendarAlt,
  FaTrophy,
  FaFire,
  FaChartLine,
  FaClock,
  FaDumbbell,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaHistory,
  FaBullseye,
} from "react-icons/fa";

// Types for comprehensive progress data
type BodyMetrics = {
  current: {
    id: string;
    date: string;
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    notes?: string;
  } | null;
  history: any[];
  trends: {
    weight: {
      current?: number;
      trend30d: number;
      trend7d: number;
    };
    bodyFat: {
      current?: number;
      trend30d: number;
    };
  };
};

type WorkoutMetrics = {
  totalSessions: number;
  sessionsLast30Days: number;
  sessionsLast7Days: number;
  totalSetsCompleted: number;
  totalSets: number;
  completionRate: number;
  averageDuration: number;
  totalWeightLifted: number;
  totalReps: number;
  consistencyScore: number;
  strengthProgress: number;
};

type RecentActivity = {
  id: string;
  date: string;
  workoutName: string;
  duration?: number;
  setsCompleted: number;
  totalSets: number;
};

type OverallScores = {
  consistency: number;
  improvement: number;
};

type ProgressData = {
  user: {
    name?: string;
    memberSince?: string;
  };
  bodyMetrics: BodyMetrics;
  workoutMetrics: WorkoutMetrics;
  recentActivity: RecentActivity[];
  overallScores: OverallScores;
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const fetchProgressData = async () => {
      try {
        const response = await fetch("/api/progress/comprehensive");
        if (response.ok) {
          const data = await response.json();
          setProgressData(data);
        } else {
          console.error("Failed to fetch progress data");
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [status, router]);

  // Helper function to render trend indicator
  const renderTrend = (value: number, isReverse: boolean = false) => {
    if (Math.abs(value) < 0.1) {
      return (
        <span className="flex items-center text-gray-400">
          <FaMinus className="mr-1" />
          <span className="text-sm">No change</span>
        </span>
      );
    }

    const isPositive = isReverse ? value < 0 : value > 0;
    const isNegative = isReverse ? value > 0 : value < 0;

    return (
      <span
        className={`flex items-center ${
          isPositive
            ? "text-green-400"
            : isNegative
            ? "text-red-400"
            : "text-gray-400"
        }`}
      >
        {isPositive && <FaArrowUp className="mr-1" />}
        {isNegative && <FaArrowDown className="mr-1" />}
        <span className="text-sm">{Math.abs(value).toFixed(1)}%</span>
      </span>
    );
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center py-12">
          <FaChartLine className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Unable to load progress data
          </h3>
          <p className="text-gray-300 mb-6">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <FaChartLine className="mr-3 text-yellow-500" />
          Progress Dashboard
        </h1>
        <p className="text-gray-400">
          Track your fitness journey with comprehensive metrics and insights
        </p>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Consistency Score
            </h3>
            <FaBullseye className="text-yellow-500" />
          </div>
          <div className="flex items-end gap-4">
            <span
              className={`text-4xl font-bold ${getScoreColor(
                progressData.overallScores.consistency
              )}`}
            >
              {progressData.overallScores.consistency}
            </span>
            <span className="text-gray-400 text-lg mb-1">/100</span>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Based on workout frequency and routine adherence
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Improvement Score
            </h3>
            <FaTrophy className="text-yellow-500" />
          </div>
          <div className="flex items-end gap-4">
            <span
              className={`text-4xl font-bold ${getScoreColor(
                progressData.overallScores.improvement
              )}`}
            >
              {progressData.overallScores.improvement}
            </span>
            <span className="text-gray-400 text-lg mb-1">/100</span>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Based on strength progress and body composition changes
          </p>
        </div>
      </div>

      {/* Workout Metrics */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Workout Performance</h2>
          <FaDumbbell className="text-yellow-500" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {progressData.workoutMetrics.totalSessions}
            </div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {progressData.workoutMetrics.sessionsLast30Days}
            </div>
            <div className="text-sm text-gray-400">Last 30 Days</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {progressData.workoutMetrics.completionRate}%
            </div>
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {progressData.workoutMetrics.averageDuration}m
            </div>
            <div className="text-sm text-gray-400">Avg Duration</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Total Weight Lifted</span>
              <FaWeight className="text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-white">
              {progressData.workoutMetrics.totalWeightLifted.toLocaleString()}{" "}
              kg
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Total Reps</span>
              <FaFire className="text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-white">
              {progressData.workoutMetrics.totalReps.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Strength Progress</span>
              <FaTrophy className="text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-white flex items-center">
              {progressData.workoutMetrics.strengthProgress > 0 && "+"}
              {progressData.workoutMetrics.strengthProgress}%
            </div>
          </div>
        </div>
      </div>

      {/* Body Metrics */}
      {progressData.bodyMetrics.current && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Body Metrics</h2>
            <FaRuler className="text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Weight Tracking
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Weight</span>
                  <span className="text-xl font-bold text-white">
                    {progressData.bodyMetrics.trends.weight.current || "N/A"} kg
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">30-Day Trend</span>
                  {renderTrend(
                    progressData.bodyMetrics.trends.weight.trend30d,
                    true
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">7-Day Trend</span>
                  {renderTrend(
                    progressData.bodyMetrics.trends.weight.trend7d,
                    true
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Body Composition
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Body Fat %</span>
                  <span className="text-xl font-bold text-white">
                    {progressData.bodyMetrics.trends.bodyFat.current || "N/A"}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">30-Day Trend</span>
                  {renderTrend(
                    progressData.bodyMetrics.trends.bodyFat.trend30d,
                    true
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {progressData.bodyMetrics.current.chest && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">
                        {progressData.bodyMetrics.current.chest}cm
                      </div>
                      <div className="text-sm text-gray-400">Chest</div>
                    </div>
                  )}
                  {progressData.bodyMetrics.current.waist && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">
                        {progressData.bodyMetrics.current.waist}cm
                      </div>
                      <div className="text-sm text-gray-400">Waist</div>
                    </div>
                  )}
                  {progressData.bodyMetrics.current.arms && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">
                        {progressData.bodyMetrics.current.arms}cm
                      </div>
                      <div className="text-sm text-gray-400">Arms</div>
                    </div>
                  )}
                  {progressData.bodyMetrics.current.thighs && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">
                        {progressData.bodyMetrics.current.thighs}cm
                      </div>
                      <div className="text-sm text-gray-400">Thighs</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <FaHistory className="text-yellow-500" />
        </div>

        {progressData.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {progressData.recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    {activity.workoutName}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.date).toLocaleDateString()} •
                    {activity.duration ? ` ${activity.duration}m • ` : " "}
                    {activity.setsCompleted}/{activity.totalSets} sets completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-yellow-500">
                    {Math.round(
                      (activity.setsCompleted / activity.totalSets) * 100
                    )}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaDumbbell className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">No recent workout activity</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/progress/new"
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-6 rounded-lg flex items-center justify-center font-semibold transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Progress Entry
        </Link>

        <Link
          href="/progress/history"
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center font-semibold transition-colors"
        >
          <FaHistory className="mr-2" />
          View History
        </Link>

        <Link
          href="/workouts/recent"
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center font-semibold transition-colors"
        >
          <FaDumbbell className="mr-2" />
          Workout History
        </Link>
      </div>
    </div>
  );
}
