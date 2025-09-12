"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaDumbbell, FaFilter } from "react-icons/fa";

type Exercise = {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  difficulty?: string;
  equipment?: string;
  instructions?: string;
  isCustom: boolean;
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // In a real app, fetch exercises from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      setExercises([
        {
          id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          difficulty: "Intermediate",
          equipment: "Barbell",
          isCustom: false,
          description:
            "A compound exercise that targets the chest, shoulders, and triceps.",
        },
        {
          id: "2",
          name: "Squat",
          muscleGroup: "Legs",
          difficulty: "Intermediate",
          equipment: "Barbell",
          isCustom: false,
          description:
            "A compound exercise that targets the quads, hamstrings, and glutes.",
        },
        {
          id: "3",
          name: "Deadlift",
          muscleGroup: "Back",
          difficulty: "Advanced",
          equipment: "Barbell",
          isCustom: false,
          description:
            "A compound exercise that targets the lower back, hamstrings, and glutes.",
        },
        {
          id: "4",
          name: "Pull-up",
          muscleGroup: "Back",
          difficulty: "Intermediate",
          equipment: "Body weight",
          isCustom: false,
          description: "A compound exercise that targets the back and biceps.",
        },
        {
          id: "5",
          name: "Push-up",
          muscleGroup: "Chest",
          difficulty: "Beginner",
          equipment: "Body weight",
          isCustom: false,
          description:
            "A compound exercise that targets the chest, shoulders, and triceps.",
        },
        {
          id: "6",
          name: "Shoulder Press",
          muscleGroup: "Shoulders",
          difficulty: "Intermediate",
          equipment: "Dumbbell",
          isCustom: false,
          description: "An isolation exercise that targets the shoulders.",
        },
        {
          id: "7",
          name: "Bicep Curl",
          muscleGroup: "Arms",
          difficulty: "Beginner",
          equipment: "Dumbbell",
          isCustom: false,
          description: "An isolation exercise that targets the biceps.",
        },
        {
          id: "8",
          name: "Tricep Extension",
          muscleGroup: "Arms",
          difficulty: "Beginner",
          equipment: "Dumbbell",
          isCustom: false,
          description: "An isolation exercise that targets the triceps.",
        },
        {
          id: "9",
          name: "Leg Press",
          muscleGroup: "Legs",
          difficulty: "Beginner",
          equipment: "Machine",
          isCustom: false,
          description:
            "A compound exercise that targets the quads, hamstrings, and glutes.",
        },
        {
          id: "10",
          name: "Lat Pulldown",
          muscleGroup: "Back",
          difficulty: "Beginner",
          equipment: "Cable",
          isCustom: false,
          description: "A compound exercise that targets the back and biceps.",
        },
        {
          id: "11",
          name: "Leg Curl",
          muscleGroup: "Legs",
          difficulty: "Beginner",
          equipment: "Machine",
          isCustom: false,
          description: "An isolation exercise that targets the hamstrings.",
        },
        {
          id: "12",
          name: "Leg Extension",
          muscleGroup: "Legs",
          difficulty: "Beginner",
          equipment: "Machine",
          isCustom: false,
          description: "An isolation exercise that targets the quads.",
        },
        {
          id: "13",
          name: "Dumbbell Fly",
          muscleGroup: "Chest",
          difficulty: "Intermediate",
          equipment: "Dumbbell",
          isCustom: false,
          description: "An isolation exercise that targets the chest.",
        },
        {
          id: "14",
          name: "Plank",
          muscleGroup: "Core",
          difficulty: "Beginner",
          equipment: "Body weight",
          isCustom: false,
          description: "A static exercise that targets the core.",
        },
        {
          id: "15",
          name: "Russian Twist",
          muscleGroup: "Core",
          difficulty: "Beginner",
          equipment: "Body weight",
          isCustom: false,
          description: "A dynamic exercise that targets the obliques.",
        },
        {
          id: "16",
          name: "My Custom Exercise",
          muscleGroup: "Back",
          difficulty: "Intermediate",
          equipment: "Resistance band",
          isCustom: true,
          description: "A custom exercise created by you.",
        },
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  // Get unique muscle groups and difficulties for filters
  const muscleGroups = Array.from(
    new Set(exercises.map((ex) => ex.muscleGroup))
  ).filter(Boolean) as string[];
  const difficulties = Array.from(
    new Set(exercises.map((ex) => ex.difficulty))
  ).filter(Boolean) as string[];

  // Filter exercises based on search query and filters
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exercise.description &&
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMuscleGroup =
      !selectedMuscleGroup || exercise.muscleGroup === selectedMuscleGroup;
    const matchesDifficulty =
      !selectedDifficulty || exercise.difficulty === selectedDifficulty;

    return matchesSearch && matchesMuscleGroup && matchesDifficulty;
  });

  // Group exercises by muscle group for display
  const exercisesByMuscleGroup = filteredExercises.reduce((acc, exercise) => {
    const muscleGroup = exercise.muscleGroup || "Other";
    if (!acc[muscleGroup]) {
      acc[muscleGroup] = [];
    }
    acc[muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-dark">
          Exercise Library
        </h1>
        <Link
          href="/exercises/new"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          <span>Create Exercise</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-primary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:ring-2 transition-colors duration-200 sm:text-sm"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters (Mobile Toggle) */}
        <div className="md:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-primary-dark py-2 px-4 rounded-md transition-colors duration-200 border border-gray-200"
          >
            <FaFilter className="text-primary" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Filters (Desktop or Mobile when open) */}
        <div className={`${filtersOpen ? "block" : "hidden"} md:flex gap-4`}>
          <div className="w-full md:w-auto">
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary focus:ring-2 transition-colors duration-200 sm:text-sm"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary focus:ring-2 transition-colors duration-200 sm:text-sm"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(exercisesByMuscleGroup).map(
            ([muscleGroup, exercises]) => (
              <div key={muscleGroup}>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  {muscleGroup}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                        exercise.isCustom
                          ? "border-secondary"
                          : "border-primary-light"
                      } hover:shadow-lg transition-shadow duration-200`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-primary-dark">
                              {exercise.name}
                            </h3>
                            {exercise.difficulty && (
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                  exercise.difficulty === "Beginner"
                                    ? "bg-green-100 text-green-800"
                                    : exercise.difficulty === "Intermediate"
                                    ? "bg-secondary bg-opacity-20 text-secondary-dark"
                                    : "bg-primary bg-opacity-20 text-primary-dark"
                                }`}
                              >
                                {exercise.difficulty}
                              </span>
                            )}
                          </div>
                          {exercise.isCustom && (
                            <span className="text-xs text-secondary font-medium">
                              Custom
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 mt-2">
                          {exercise.description}
                        </p>

                        {exercise.equipment && (
                          <div className="mt-3 text-sm text-gray-600">
                            <strong className="text-primary-dark">
                              Equipment:
                            </strong>{" "}
                            {exercise.equipment}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 px-5 py-3 flex justify-end">
                        <Link
                          href={`/exercises/${exercise.id}`}
                          className="text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <FaDumbbell className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h3 className="text-lg font-medium text-primary-dark mb-2">
            No exercises found
          </h3>
          <p className="text-gray-700 mb-6">
            {searchQuery || selectedMuscleGroup || selectedDifficulty
              ? "No exercises match your search criteria"
              : "There are no exercises in your library yet"}
          </p>
          <Link
            href="/exercises/new"
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md inline-flex items-center transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            <span>Create Your First Exercise</span>
          </Link>
        </div>
      )}
    </div>
  );
}
