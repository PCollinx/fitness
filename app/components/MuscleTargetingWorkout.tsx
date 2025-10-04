"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaDumbbell,
  FaFire,
  FaClock,
  FaCrosshairs,
} from "react-icons/fa";

interface MuscleGroup {
  id: string;
  label: string;
  description: string;
  icon: string;
  exerciseCount?: number;
}

const muscleGroups: MuscleGroup[] = [
  {
    id: "chest",
    label: "Chest",
    description: "Pecs, upper/lower chest",
    icon: "💪",
  },
  {
    id: "back",
    label: "Back",
    description: "Lats, rhomboids, rear delts",
    icon: "🏋️",
  },
  {
    id: "shoulders",
    label: "Shoulders",
    description: "Front/side/rear delts",
    icon: "🤸",
  },
  {
    id: "arms",
    label: "Arms",
    description: "Biceps, triceps, forearms",
    icon: "💪",
  },
  {
    id: "legs",
    label: "Legs",
    description: "Quads, hamstrings, calves",
    icon: "🦵",
  },
  {
    id: "glutes",
    label: "Glutes",
    description: "Glute max, med, min",
    icon: "🍑",
  },
  {
    id: "core",
    label: "Core",
    description: "Abs, obliques, lower back",
    icon: "🎯",
  },
  {
    id: "full body",
    label: "Full Body", 
    description: "Compound movements",
    icon: "🔥",
  },
];

interface MuscleTargetingProps {
  onComplete?: (selectedMuscles: string[]) => void;
  redirectPath?: string;
  showProgress?: boolean;
  step?: number;
  totalSteps?: number;
  title?: string;
  subtitle?: string;
}

export default function MuscleTargetingWorkout({
  onComplete,
  redirectPath = "/workouts/new",
  showProgress = true,
  step = 2,
  totalSteps = 3,
  title = "What muscles do you want to target?",
  subtitle = "Select the muscle groups for your workout",
}: MuscleTargetingProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [exerciseCounts, setExerciseCounts] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get workout planning parameters from URL params
  const workoutName = searchParams.get("name") || "";
  const intensity = searchParams.get("intensity") || "Medium";
  const category = searchParams.get("category") || "Strength";

  // Get initial selections from URL params if any
  useEffect(() => {
    const initialMuscles = searchParams.get("muscles");
    if (initialMuscles) {
      setSelectedMuscles(initialMuscles.split(","));
    }
  }, [searchParams]);

  // Fetch exercise counts for each muscle group
  useEffect(() => {
    const fetchExerciseCounts = async () => {
      try {
        const counts: Record<string, number> = {};

        // Fetch count for each muscle group
        for (const muscle of muscleGroups) {
          const response = await fetch(
            `/api/exercises?muscleGroup=${muscle.id}&limit=1000`
          );
          if (response.ok) {
            const exercises = await response.json();
            counts[muscle.id] = exercises.length;
          }
        }

        setExerciseCounts(counts);
      } catch (error) {
        console.error("Error fetching exercise counts:", error);
      }
    };

    fetchExerciseCounts();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const toggleMuscleSelection = (id: string) => {
    if (selectedMuscles.includes(id)) {
      setSelectedMuscles(selectedMuscles.filter((muscleId) => muscleId !== id));
    } else {
      setSelectedMuscles([...selectedMuscles, id]);
    }
    setError(""); // Clear any errors when user makes a selection
  };

  const handleCreateWorkout = () => {
    if (selectedMuscles.length === 0) {
      setError("Please select at least one muscle group");
      return;
    }

    // Navigate to enhanced workout creation with selected muscles
    const params = new URLSearchParams();

    // Add workout planning parameters if available
    if (workoutName) params.append("name", workoutName);
    if (intensity) params.append("intensity", intensity);
    if (category) params.append("category", category);

    // Add selected muscles
    params.append("muscles", selectedMuscles.join(","));

    router.push(`/workouts/create-with-muscles?${params.toString()}`);
  };

  const handleBack = () => {
    const workoutName = searchParams.get("name");
    if (workoutName) {
      // If we came from workout planning, go back to that step
      router.push("/workouts/plan");
    } else {
      router.back();
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalSelectedExercises = selectedMuscles.reduce((total, muscle) => {
    return total + (exerciseCounts[muscle] || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          {showProgress && (
            <div className="flex items-center space-x-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    i < step ? "bg-yellow-400" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaCrosshairs className="text-4xl text-yellow-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 text-lg">{subtitle}</p>
          <p className="text-gray-500 text-sm mt-2">
            Select one or more muscle groups
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Selected Summary */}
        {selectedMuscles.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 font-medium">
                  {selectedMuscles.length} muscle group
                  {selectedMuscles.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-gray-400 text-sm">
                  ~{totalSelectedExercises} exercises available
                </p>
              </div>
              <FaDumbbell className="text-yellow-500 text-xl" />
            </div>
          </div>
        )}

        {/* Muscle Groups Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {muscleGroups.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle.id);
            const exerciseCount = exerciseCounts[muscle.id] || 0;

            return (
              <button
                key={muscle.id}
                onClick={() => toggleMuscleSelection(muscle.id)}
                disabled={exerciseCount === 0}
                className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg"
                    : exerciseCount > 0
                    ? "border-gray-700 bg-gray-800 hover:border-gray-600"
                    : "border-gray-800 bg-gray-900 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-3xl">{muscle.icon}</span>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          exerciseCount === 0 ? "text-gray-500" : "text-white"
                        }`}
                      >
                        {muscle.label}
                      </h3>
                      <p
                        className={`text-sm ${
                          exerciseCount === 0
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {muscle.description}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          exerciseCount === 0 ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {exerciseCount === 0
                          ? "No exercises available"
                          : `${exerciseCount} exercises`}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${
                      isSelected
                        ? "bg-yellow-400 border-yellow-400"
                        : exerciseCount > 0
                        ? "border-gray-500"
                        : "border-gray-700"
                    }`}
                  >
                    {isSelected && <FaCheck className="w-3 h-3 text-black" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={handleCreateWorkout}
            disabled={selectedMuscles.length === 0 || isLoading}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedMuscles.length > 0 && !isLoading
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
            ) : (
              <>
                <span>Build Workout</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {selectedMuscles.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-2">
              Select at least one muscle group to continue
            </p>
          )}
        </div>

        {/* Quick Selection Hints */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-2">Popular combinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Push Day", muscles: ["chest", "shoulders", "arms"] },
              { label: "Pull Day", muscles: ["back", "arms"] },
              { label: "Leg Day", muscles: ["legs", "glutes"] },
              { label: "Full Body", muscles: ["full body"] },
            ].map((combo) => (
              <button
                key={combo.label}
                onClick={() => {
                  setSelectedMuscles(combo.muscles);
                  setError("");
                }}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                {combo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
