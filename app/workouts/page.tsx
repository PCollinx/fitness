"use client";

import { useState, useEffect } from "react";
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
import {
  loadWorkouts,
  Workout,
  fixBrokenWorkoutImages,
} from "../utils/workoutStorage";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    setTimeout(() => {
      // Fix any broken images in localStorage first
      fixBrokenWorkoutImages();

      // Load both custom and default workouts
      const allWorkouts = loadWorkouts();
      setWorkouts(allWorkouts);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter workouts based on search query and category
  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch =
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      workout.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workouts</h1>
            <p className="text-gray-400">
              Find the perfect workout for your goals
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link
              href="/workouts/history"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
            >
              <FaHistory className="mr-2" /> History
            </Link>
            <Link
              href="/workouts/new"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg flex items-center font-medium"
            >
              <FaPlus className="mr-2" /> Create
            </Link>
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
                <div className="h-48 relative">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded capitalize">
                            {workout.category}
                          </span>
                          {workout.isDefault && (
                            <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="flex items-center text-white">
                          <FaStar className="text-yellow-400 mr-1" />{" "}
                          {workout.rating}
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
                    <FaClock className="mr-1" /> {workout.duration} min •{" "}
                    <FaDumbbell className="mx-1" /> {workout.intensity}{" "}
                    intensity
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
                      href={`/workouts/start/${workout.id}`}
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
              href="/workouts/new"
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
