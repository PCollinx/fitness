"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import {
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaLock,
  FaChartLine,
  FaDumbbell,
  FaCheckCircle,
} from "react-icons/fa";
import WorkoutScheduleComponent from "../components/WorkoutSchedule";
import {
  useWorkoutSchedule,
  type WorkoutSchedule,
} from "../hooks/useWorkoutSchedule";

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const { schedules, isLoading } = useWorkoutSchedule();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleScheduleUpdate = (updatedSchedules: WorkoutSchedule[]) => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getActiveScheduleCount = () => {
    return schedules.filter((s) => s.isActive && s.isEnabled).length;
  };

  const getNextWorkout = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Find active schedules
    const activeSchedules = schedules.filter((s) => s.isActive && s.isEnabled);

    // Look for today's upcoming workouts first
    const todaySchedules = activeSchedules.filter(
      (s) => s.dayOfWeek === currentDay
    );
    const upcomingToday = todaySchedules.find((s) => {
      const [hours, minutes] = s.time.split(":").map(Number);
      const scheduleTime = hours * 100 + minutes;
      return scheduleTime > currentTime;
    });

    if (upcomingToday) {
      return {
        day: "Today",
        time: upcomingToday.time,
        schedule: upcomingToday,
      };
    }

    // Look for next day's workouts
    for (let i = 1; i <= 7; i++) {
      const targetDay = (currentDay + i) % 7;
      const nextSchedule = activeSchedules.find(
        (s) => s.dayOfWeek === targetDay
      );
      if (nextSchedule) {
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return {
          day: i === 1 ? "Tomorrow" : dayNames[targetDay],
          time: nextSchedule.time,
          schedule: nextSchedule,
        };
      }
    }

    return null;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-400">Loading schedule...</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaLock className="mx-auto text-yellow-500 text-5xl mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-300 mb-6">
              Please sign in to manage your workout schedule.
            </p>
            <Link
              href="/auth/signin"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextWorkout = getNextWorkout();
  const activeCount = getActiveScheduleCount();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-12">
        {/* Navigation */}
        <div className="mb-4 sm:mb-6">
          <BackButton fallbackRoute="/dashboard" />
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 sm:mb-6 bg-green-500/20 text-green-300 p-3 sm:p-4 rounded-lg flex items-center text-sm sm:text-base">
            <FaCheckCircle className="mr-2 sm:mr-3 flex-shrink-0" />
            <span>
              Schedule updated successfully! Your workout reminders are now set.
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Workout Schedule
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Set up your weekly workout routine and get reminded when it's time
            to exercise.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Active Days</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {activeCount}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-2 sm:p-3 rounded-lg">
                <FaCalendarAlt className="text-yellow-500 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm">Next Workout</p>
                <p className="text-base sm:text-lg font-semibold text-white truncate">
                  {nextWorkout ? nextWorkout.day : "Not scheduled"}
                </p>
                {nextWorkout && (
                  <p className="text-xs sm:text-sm text-gray-400">
                    at {nextWorkout.time}
                  </p>
                )}
              </div>
              <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg">
                <FaClock className="text-blue-500 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Weekly Goal</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {activeCount * 2} hours
                </p>
              </div>
              <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg">
                <FaDumbbell className="text-green-500 text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Management */}
        <WorkoutScheduleComponent
          onScheduleUpdate={handleScheduleUpdate}
          compact={false}
        />

        {/* Tips Section */}
        <div className="mt-6 sm:mt-8 bg-gray-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
            <FaChartLine className="mr-2 sm:mr-3 text-yellow-500" />
            Consistency Tips
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaClock className="text-yellow-500 text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Start Small
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Begin with 2-3 days per week and gradually increase as the
                    habit forms.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaBell className="text-blue-500 text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Use Reminders
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Enable notifications to get gentle reminders when it's
                    workout time.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaCalendarAlt className="text-green-500 text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Be Consistent
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Same times each day help build a strong workout habit.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaDumbbell className="text-purple-500 text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">
                    Stay Flexible
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Adjust your schedule as needed - consistency is more
                    important than perfection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href="/workouts"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-center text-sm sm:text-base"
          >
            Browse Workouts
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors text-center text-sm sm:text-base"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
