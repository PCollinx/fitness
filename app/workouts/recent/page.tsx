"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaDumbbell,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaHistory,
  FaPlay,
} from "react-icons/fa";

type WorkoutSession = {
  id: string;
  startTime: string;
  endTime?: string;
  workout: {
    id: string;
    name: string;
  };
  exercises: {
    exercise: {
      name: string;
    };
    sets: {
      id: string;
      completed: boolean;
      actualReps?: number;
      actualWeight?: number;
      targetReps: number;
      targetWeight?: number;
    }[];
  }[];
};

export default function RecentWorkoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const fetchRecentSessions = async () => {
      try {
        const response = await fetch("/api/workouts/sessions/recent");
        if (response.ok) {
          const data = await response.json();
          setSessions(data || []);
        } else {
          console.error("Failed to fetch recent sessions");
          setSessions([]);
        }
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSessions();
  }, [status, router]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate session duration
  const calculateDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate completion stats for a session
  const getCompletionStats = (session: WorkoutSession) => {
    let totalSets = 0;
    let completedSets = 0;

    session.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        totalSets++;
        if (set.completed) {
          completedSets++;
        }
      });
    });

    return { totalSets, completedSets, completionRate: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0 };
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-yellow-500 hover:text-yellow-400 flex items-center transition-all text-sm sm:text-base mr-4"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
            <FaHistory className="mr-3 text-yellow-500" />
            Recent Workouts
          </h1>
          <p className="text-gray-400">
            Your workout history and performance tracking
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <FaDumbbell className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No workout sessions yet
            </h3>
            <p className="text-gray-300 mb-6">
              Start your first workout to see your progress here
            </p>
            <Link
              href="/workouts"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-6 rounded-md inline-flex items-center transition-colors font-medium"
            >
              <FaPlay className="mr-2" />
              <span>Browse Workouts</span>
            </Link>
          </div>
        )}

        {/* Sessions List */}
        {!isLoading && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const stats = getCompletionStats(session);
              return (
                <div
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all border border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {session.workout.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(session.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{formatTime(session.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{calculateDuration(session.startTime, session.endTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-0 flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-500">
                          {stats.completionRate}%
                        </div>
                        <div className="text-xs text-gray-400">Complete</div>
                      </div>
                      <Link
                        href={`/workouts/${session.workout.id}`}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        View Workout
                      </Link>
                    </div>
                  </div>

                  {/* Exercise Summary */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Exercises</span>
                        <span className="font-semibold text-white">
                          {session.exercises.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Sets Completed</span>
                        <span className="font-semibold text-white">
                          {stats.completedSets}/{stats.totalSets}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">Status</span>
                        <span className={`font-semibold flex items-center ${
                          session.endTime ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          <FaCheckCircle className="mr-1" />
                          {session.endTime ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Details */}
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">Exercises performed:</div>
                    <div className="flex flex-wrap gap-2">
                      {session.exercises.map((exercise, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {exercise.exercise.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}