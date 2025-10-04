"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaPlus,
  FaDumbbell,
  FaEllipsisH,
  FaSearch,
  FaClock,
  FaStar,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";

interface ApiWorkout {
  id: string;
  name: string;
  description: string;
  image: string;
  isOwner: boolean;
  author: string;
  exerciseCount: number;
  muscleGroups: string[];
  difficulty: string;
  timesCompleted: number;
  createdAt: string;
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: string;
    sets: number;
    reps: number;
    weight?: number;
    order: number;
  }>;
}

// Component that uses searchParams (needs to be in Suspense)
function WorkoutsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<ApiWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // Load workouts immediately - public workouts are accessible without authentication
    loadWorkouts();
  }, []);

  // Check for refresh parameter
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh === "true") {
      loadWorkouts();
    }
  }, [searchParams]);

  // Auto-refresh when coming back to the page
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading) {
        loadWorkouts();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoading]);

  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/workouts?limit=50");
      if (response.ok) {
        const data = await response.json();
        console.log("Workout data received:", data.workouts?.slice(0, 2)); // Debug first 2 workouts
        setWorkouts(data.workouts || []);
      } else {
        console.error("Failed to load workouts");
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter workouts based on search query and category
  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch =
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      workout.muscleGroups.some((group) =>
        group.toLowerCase().includes(activeCategory.toLowerCase())
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 mt-12 sm:pb-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workouts</h1>
            <p className="text-gray-400">
              Find the perfect workout for your goals
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Link
              href="/workouts/history"
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center font-medium transition-colors"
            >
              <FaHistory className="mr-2" /> History
            </Link>
            <div className="flex gap-2">
              <button
                onClick={loadWorkouts}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-3 py-2 rounded-lg flex items-center font-medium transition-colors"
                title="Refresh workouts"
              >
                <FaHistory
                  className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Loading" : "Refresh"}
              </button>
              <Link
                href="/workouts/create"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded-lg flex items-center font-medium"
              >
                <FaPlus className="mr-2" /> Create
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {["All", "Strength", "Cardio", "Flexibility", "Recovery", "HIIT"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  category === activeCategory
                    ? "bg-yellow-400 text-black font-medium"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="h-48 relative bg-gradient-to-br from-yellow-500/20 to-gray-900 overflow-hidden">
                  {workout.image ? (
                    <img
                      src={workout.image}
                      alt={workout.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-center"
                    style={{ display: workout.image ? "none" : "flex" }}
                  >
                    <div>
                      <FaDumbbell className="text-4xl text-yellow-500 mx-auto mb-2" />
                      <div className="text-yellow-400 font-bold text-lg">
                        {workout.exerciseCount} Exercises
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {workout.muscleGroups.slice(0, 2).map((muscle) => (
                            <span
                              key={muscle}
                              className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded capitalize"
                            >
                              {muscle}
                            </span>
                          ))}
                          {workout.muscleGroups.length > 2 && (
                            <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded">
                              +{workout.muscleGroups.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="flex items-center text-white">
                          <FaStar className="text-yellow-400 mr-1" />{" "}
                          {workout.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">
                    {workout.name}
                  </h3>
                  <div className="flex items-center text-gray-400 mt-2 mb-3">
                    <FaDumbbell className="mr-1" /> {workout.exerciseCount}{" "}
                    exercises • <FaHistory className="mx-1" />{" "}
                    {workout.timesCompleted} completed
                  </div>
                  <p className="text-gray-300 text-sm">{workout.description}</p>
                  <div className="mt-4">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
                    >
                      View Workout
                    </Link>
                    <Link
                      href={`/workouts/${workout.id}/session`}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 px-4 rounded-lg flex items-center justify-center mt-2 font-medium transition"
                    >
                      <FaPlayCircle className="mr-2" /> Start Workout
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800 rounded-lg">
            <FaDumbbell className="text-yellow-400 h-16 w-16 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">
              No workouts found
            </h3>
            <p className="text-gray-300 mb-8 text-center max-w-md">
              {searchQuery
                ? `No workouts match "${searchQuery}" in the "${activeCategory}" category`
                : "No workouts available in this category yet"}
            </p>
            <Link
              href="/workouts/create"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-3 rounded-lg flex items-center font-medium transition"
            >
              <FaPlus className="mr-2" />
              <span>Create New Workout</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function WorkoutsLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 h-48"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense
export default function WorkoutsPage() {
  return (
    <Suspense fallback={<WorkoutsLoading />}>
      <WorkoutsContent />
    </Suspense>
  );
}
