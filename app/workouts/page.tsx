"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaDumbbell, FaEllipsisH, FaSearch } from "react-icons/fa";

type Workout = {
  id: string;
  name: string;
  description?: string;
  exercises: number;
  lastPerformed?: string;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, fetch workouts from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setWorkouts([
        {
          id: "1",
          name: "Upper Body Power",
          description: "Focus on chest, shoulders, and triceps",
          exercises: 6,
          lastPerformed: "2025-09-05",
        },
        {
          id: "2",
          name: "Lower Body Strength",
          description: "Squats, deadlifts, and accessories",
          exercises: 5,
          lastPerformed: "2025-09-08",
        },
        {
          id: "3",
          name: "Push Day",
          description: "Chest, shoulders, and triceps",
          exercises: 7,
          lastPerformed: "2025-09-01",
        },
        {
          id: "4",
          name: "Pull Day",
          description: "Back and biceps focus",
          exercises: 6,
          lastPerformed: "2025-09-03",
        },
        {
          id: "5",
          name: "Leg Day",
          description: "Full lower body workout",
          exercises: 6,
          lastPerformed: "2025-09-10",
        },
        {
          id: "6",
          name: "Core Crusher",
          description: "Abs and lower back",
          exercises: 4,
        },
        {
          id: "7",
          name: "Cardio & Conditioning",
          description: "HIIT and endurance work",
          exercises: 5,
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workout.description &&
        workout.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Workouts</h1>
        <Link
          href="/workouts/new"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          <span>Create Workout</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-secondary" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:ring-2 transition-colors duration-200 sm:text-sm"
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2 text-primary">
                    {workout.name}
                  </h2>
                  <div className="relative">
                    <button className="text-secondary hover:text-primary transition-colors">
                      <FaEllipsisH />
                    </button>
                    {/* Dropdown menu would go here in a real implementation */}
                  </div>
                </div>
                <p className="text-gray-700 font-medium mb-4">
                  {workout.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaDumbbell className="mr-1 text-secondary" />
                    <span className="font-medium">
                      {workout.exercises} exercises
                    </span>
                  </div>
                  <div className="font-medium">
                    Last performed:{" "}
                    <span className="text-secondary">
                      {formatDate(workout.lastPerformed)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-between">
                  <Link
                    href={`/workouts/${workout.id}`}
                    className="text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/workouts/start/${workout.id}`}
                    className="bg-secondary hover:bg-secondary-dark text-white py-1 px-3 rounded-md text-sm font-medium transition-colors"
                  >
                    Start Workout
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaDumbbell className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No workouts found
          </h3>
          <p className="text-gray-700 mb-6 font-medium">
            {searchQuery
              ? `No workouts match "${searchQuery}"`
              : "You haven't created any workouts yet"}
          </p>
          <Link
            href="/workouts/new"
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            <span>Create Your First Workout</span>
          </Link>
        </div>
      )}
    </div>
  );
}
