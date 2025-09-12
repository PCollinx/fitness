"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaDumbbell,
  FaUtensils,
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

type NutritionSummary = {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type ProgressSummary = {
  date: string;
  weight: number;
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSummary[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionSummary[]>([]);
  const [progressData, setProgressData] = useState<ProgressSummary[]>([]);

  useEffect(() => {
    // In a real app, you would fetch actual data from your API
    // This is just mock data for demonstration
    setTimeout(() => {
      setRecentWorkouts([
        {
          id: "1",
          name: "Upper Body Strength",
          date: "2025-09-10",
          exercises: 5,
        },
        { id: "2", name: "Leg Day", date: "2025-09-08", exercises: 4 },
        { id: "3", name: "Cardio & Core", date: "2025-09-06", exercises: 6 },
      ]);

      setNutritionData([
        {
          id: "1",
          date: "2025-09-11",
          calories: 2150,
          protein: 120,
          carbs: 180,
          fat: 65,
        },
        {
          id: "2",
          date: "2025-09-10",
          calories: 2050,
          protein: 115,
          carbs: 190,
          fat: 60,
        },
        {
          id: "3",
          date: "2025-09-09",
          calories: 2200,
          protein: 130,
          carbs: 170,
          fat: 70,
        },
      ]);

      setProgressData([
        { date: "2025-09-01", weight: 82.5 },
        { date: "2025-09-08", weight: 81.8 },
        { date: "2025-09-15", weight: 81.2 },
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  // Function to format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8 text-primary-dark">Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 col-span-full">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link
                href="/workouts/new"
                className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <FaDumbbell className="text-2xl text-primary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Start Workout
                </span>
              </Link>

              <Link
                href="/nutrition/log"
                className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <FaUtensils className="text-2xl text-secondary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Log Meal
                </span>
              </Link>

              <Link
                href="/progress/new"
                className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <FaChartLine className="text-2xl text-primary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Update Progress
                </span>
              </Link>

              <Link
                href="/workouts/history"
                className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <FaRunning className="text-2xl text-secondary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Workout History
                </span>
              </Link>

              <Link
                href="/workouts/plan"
                className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <FaCalendar className="text-2xl text-primary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Plan Workout
                </span>
              </Link>

              <Link
                href="/social"
                className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <FaUsers className="text-2xl text-secondary mb-2" />
                <span className="text-sm font-medium text-center text-gray-800">
                  Social Feed
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">
                Recent Workouts
              </h2>
              <Link
                href="/workouts"
                className="text-secondary text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="border-b border-gray-100 pb-4 hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">
                      {workout.name}
                    </h3>
                    <span className="text-sm text-primary">
                      {formatDate(workout.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {workout.exercises} exercises
                  </p>
                </div>
              ))}
              {recentWorkouts.length === 0 && (
                <p className="text-gray-600 text-center py-4 font-medium">
                  No recent workouts
                </p>
              )}
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">
                Nutrition Summary
              </h2>
              <Link
                href="/nutrition"
                className="text-secondary text-sm font-medium hover:underline"
              >
                View Details
              </Link>
            </div>
            {nutritionData.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">Today</h3>
                    <span className="text-sm font-medium text-secondary">
                      {nutritionData[0].calories} cal
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        Protein
                      </p>
                      <p className="font-medium text-gray-800">
                        {nutritionData[0].protein}g
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">Carbs</p>
                      <p className="font-medium text-gray-800">
                        {nutritionData[0].carbs}g
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">Fat</p>
                      <p className="font-medium text-gray-800">
                        {nutritionData[0].fat}g
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-gray-800">
                    Last 7 Days
                  </h3>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-2">
                    {/* Simple bar chart representation */}
                    {nutritionData.map((day) => (
                      <div
                        key={day.id}
                        className="flex flex-col items-center w-1/3"
                      >
                        <div
                          className="bg-secondary w-8 rounded-t-sm"
                          style={{ height: `${(day.calories / 2500) * 100}px` }}
                        ></div>
                        <p className="text-xs mt-1 font-medium text-gray-700">
                          {formatDate(day.date).split(" ")[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-medium">
                No nutrition data available
              </p>
            )}
          </div>

          {/* Progress Tracker */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">
                Progress Tracker
              </h2>
              <Link
                href="/progress"
                className="text-secondary text-sm font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            {progressData.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">Weight</h3>
                  <span className="text-sm font-medium text-secondary">
                    {progressData[progressData.length - 1].weight} kg
                  </span>
                </div>

                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-2">
                  {/* Simple line chart representation */}
                  {progressData.map((point, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center w-1/3"
                    >
                      <div
                        className="bg-primary w-2 rounded-full"
                        style={{
                          height: `${10 + ((85 - point.weight) / 5) * 80}px`,
                          marginTop: "auto",
                        }}
                      ></div>
                      <p className="text-xs mt-1 font-medium text-gray-700">
                        {formatDate(point.date).split(" ")[0]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-gray-800">
                    Recent Changes
                  </h3>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        1 Week
                      </p>
                      <p
                        className={`font-medium ${
                          progressData[2].weight < progressData[1].weight
                            ? "text-secondary"
                            : "text-red-500"
                        }`}
                      >
                        {(
                          progressData[2].weight - progressData[1].weight
                        ).toFixed(1)}{" "}
                        kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        1 Month
                      </p>
                      <p
                        className={`font-medium ${
                          progressData[2].weight < progressData[0].weight
                            ? "text-secondary"
                            : "text-red-500"
                        }`}
                      >
                        {(
                          progressData[2].weight - progressData[0].weight
                        ).toFixed(1)}{" "}
                        kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-medium">
                No progress data available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
