"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaChartLine,
  FaWeight,
  FaDumbbell,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaBullseye,
  FaTrophy,
  FaRuler,
  FaMinus,
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

    if (status === "authenticated") {
      fetchProgressData();
    }
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
    <div className="container mx-auto px-4 mt-12 max-w-7xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <FaChartLine className="mr-3 text-yellow-500" />
          Progress Status
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

      {/* Simple Workout Metrics */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Workout Performance</h2>
          <FaDumbbell className="text-yellow-500" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
