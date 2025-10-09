"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "@/app/components/BackButton";
import { getImageForWorkout } from "@/app/utils/workoutImageStorage";
import {
  FaDumbbell,
  FaPlus,
  FaMinus,
  FaPlay,
  FaSave,
  FaClock,
  FaFire,
  FaTimes,
} from "react-icons/fa";

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  type: string;
  difficulty: string;
  instructions?: string[];
  sets?: number;
  reps?: string;
  duration?: number;
}

// Exercise creation schema
const exerciseCreationSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  description: z.string().min(1, "Description is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  instructions: z.string().min(1, "Instructions are required"),
});

type ExerciseCreationFormValues = z.infer<typeof exerciseCreationSchema>;

export default function CreateWithMusclesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCreateExercise, setShowCreateExercise] = useState(false);

  // Get parameters from URL
  const muscles = searchParams.get("muscles")?.split(",") || [];
  const intensity = searchParams.get("intensity") || "Medium";
  const category = searchParams.get("category") || "Strength";
  const initialName = searchParams.get("name") || "";
  const description = searchParams.get("description") || "";

  // Exercise creation form
  const {
    register: registerExercise,
    handleSubmit: handleSubmitExercise,
    reset: resetExerciseForm,
    formState: { errors: exerciseErrors },
  } = useForm<ExerciseCreationFormValues>({
    resolver: zodResolver(exerciseCreationSchema),
    defaultValues: {
      name: "",
      description: "",
      muscleGroup: "",
      difficulty: "",
      instructions: "",
    },
  });

  // Debug logging
  console.log("Create-with-muscles page loaded with params:", {
    muscles,
    musclesRaw: searchParams.get("muscles"),
    intensity,
    category,
    initialName,
    status,
  });

  useEffect(() => {
    console.log("Create-with-muscles useEffect triggered", {
      status,
      muscles,
      musclesLength: muscles.length,
    });

    if (status === "loading") {
      console.log("Status is loading, waiting...");
      return; // Wait for auth to finish loading
    }

    if (status === "unauthenticated") {
      console.log("User not authenticated");
      setError("You must be logged in to create workouts. Please sign in.");
      setIsLoading(false);
      return;
    }

    const musclesParam = searchParams.get("muscles");
    console.log("Raw muscles param:", musclesParam);

    if (!musclesParam || musclesParam.trim() === "") {
      console.warn("No muscles parameter provided");
      setError(
        "No muscle groups selected. Please go back and select muscle groups."
      );
      setIsLoading(false);
      return;
    }

    console.log("All checks passed, setting up workout");
    setWorkoutName(initialName || `${muscles.join(" & ")} Workout`);
    fetchExercises();
  }, [status, searchParams, initialName, router]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const exercisePromises = muscles.map((muscle) =>
        fetch(`/api/exercises?muscleGroup=${muscle}&limit=20`).then((res) =>
          res.json()
        )
      );

      const exerciseResults = await Promise.all(exercisePromises);
      const allExercises = exerciseResults.flat();

      // Remove duplicates and add workout-specific properties
      const uniqueExercises = allExercises
        .filter(
          (exercise, index, self) =>
            index === self.findIndex((e) => e.id === exercise.id)
        )
        .map((exercise) => ({
          ...exercise,
          sets: 3,
          reps: "10-12",
          duration: 60,
        }));

      setExercises(uniqueExercises);

      // Auto-select a few exercises to start with
      if (uniqueExercises.length > 0) {
        const initialSelection = uniqueExercises.slice(
          0,
          Math.min(4, uniqueExercises.length)
        );
        setSelectedExercises(initialSelection);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Failed to load exercises. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId));
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setSelectedExercises(
      selectedExercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      )
    );
  };

  const handleCreateExercise = async (data: ExerciseCreationFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newExercise = await response.json();

        // Add the new exercise to the local state
        setExercises((prev) => [...prev, newExercise]);

        // Automatically add the new exercise to selected exercises
        addExercise(newExercise);

        // Close modal and reset form
        setShowCreateExercise(false);
        resetExerciseForm();

        console.log("Exercise created successfully!");
      } else {
        throw new Error("Failed to create exercise");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      setError("Failed to create exercise. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      setError("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      setError("Please add at least one exercise");
      return;
    }

    if (selectedExercises.length < 3) {
      setError("Workout must contain at least 3 exercises");
      return;
    }

    try {
      setIsSaving(true);

      // Generate an appropriate image for the workout based on exercises
      const exerciseDetails = selectedExercises.map(exercise => ({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup
      }));
      const workoutImage = getImageForWorkout(exerciseDetails) || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      console.log("Generated workout image URL:", workoutImage);

      const workoutData = {
        name: workoutName.trim(),
        description: description?.trim() || `${muscles.join(" & ")} workout focusing on targeted muscle development`,
        image: workoutImage,
        exercises: selectedExercises.map((exercise, index) => ({
          exerciseId: exercise.id,
          sets: exercise.sets || 3,
          reps: parseInt(exercise.reps as string) || 10,
          weight: 0, // Can be updated later during workout
          duration: exercise.duration || 60,
          notes: "",
          order: index,
        })),
        public: false,
      };

      console.log("Saving workout with data:", workoutData);

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save workout");
      }

      const result = await response.json();
      console.log("Workout saved successfully:", result);
      
      // Redirect to the workout details page
      router.push(`/workouts/${result.workout.id}`);
    } catch (error) {
      console.error("Error saving workout:", error);
      setError(error instanceof Error ? error.message : "Failed to save workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartWorkout = async () => {
    if (!workoutName.trim()) {
      setError("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      setError("Please add at least one exercise");
      return;
    }

    if (selectedExercises.length < 3) {
      setError("Workout must contain at least 3 exercises to start");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // Generate an appropriate image for the workout based on exercises
      const exerciseDetails = selectedExercises.map(exercise => ({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup
      }));
      const workoutImage = getImageForWorkout(exerciseDetails) || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      console.log("Generated workout image URL for start:", workoutImage);

      // First, save the workout to get a proper workout ID
      const workoutData = {
        name: workoutName.trim(),
        description: description?.trim() || `${muscles.join(" & ")} workout focusing on targeted muscle development`,
        image: workoutImage,
        exercises: selectedExercises.map((exercise, index) => ({
          exerciseId: exercise.id,
          sets: exercise.sets || 3,
          reps: parseInt(exercise.reps as string) || 10,
          weight: 0,
          duration: exercise.duration || 60,
          notes: "",
          order: index,
        })),
        public: false,
      };

      console.log("Creating workout for start session:", workoutData);

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workout");
      }

      const result = await response.json();
      const workoutId = result.workout.id;
      
      console.log("Workout created successfully, starting session for workout:", workoutId);

      // Navigate to the workout start page with the saved workout ID
      router.push(`/workouts/start/${workoutId}`);
    } catch (error) {
      console.error("Error starting workout:", error);
      setError(error instanceof Error ? error.message : "Failed to start workout. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getFallbackRoute = () => {
    const params = new URLSearchParams();
    if (initialName) params.append("name", initialName);
    if (intensity) params.append("intensity", intensity);
    if (category) params.append("category", category);
    if (description) params.append("description", description);
    params.append("muscles", muscles.join(","));

    return `/workouts/muscle-targeting?${params.toString()}`;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exercises...</p>
          <p className="text-xs text-gray-600 mt-2">
            Step 3: Exercise Selection
          </p>
        </div>
      </div>
    );
  }

  const totalEstimatedTime = selectedExercises.reduce((total, exercise) => {
    return total + (exercise.sets || 3) * 2;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-12">
        <div className="mb-6">
          <BackButton fallbackRoute={getFallbackRoute()} />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= 2
                      ? "bg-yellow-500 text-black"
                      : step === 3
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      step <= 2 ? "bg-yellow-500" : "bg-gray-700"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Step 3 of 3</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaDumbbell className="text-3xl text-yellow-500 mr-4" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Build Your Workout
              </h1>
              <p className="text-gray-400">
                Select and customize exercises for your {muscles.join(" & ")}{" "}
                workout
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <FaClock className="text-yellow-500 text-xl mx-auto mb-2" />
              <p className="text-xl font-bold text-white">
                {totalEstimatedTime}m
              </p>
              <p className="text-gray-400 text-sm">Estimated Time</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <FaDumbbell className="text-green-500 text-xl mx-auto mb-2" />
              <p className="text-xl font-bold text-white">
                {selectedExercises.length}
              </p>
              <p className="text-gray-400 text-sm">Exercises</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <FaFire className="text-red-500 text-xl mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{intensity}</p>
              <p className="text-gray-400 text-sm">Intensity</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Workout ({selectedExercises.length} exercises)
          </h2>

          {selectedExercises.length === 0 ? (
            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <FaDumbbell className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                No exercises selected
              </p>
              <p className="text-gray-500 text-sm">
                Choose from the available exercises below
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedExercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {index + 1}. {exercise.name}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize">
                        {exercise.muscleGroup} • {exercise.difficulty}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FaMinus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Sets
                      </label>
                      <select
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(exercise.id, {
                            sets: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Reps
                      </label>
                      <select
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(exercise.id, { reps: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        <option value="8-10">8-10</option>
                        <option value="10-12">10-12</option>
                        <option value="12-15">12-15</option>
                        <option value="15-20">15-20</option>
                        <option value="Until failure">Until failure</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Exercises ({exercises.length})
            </h2>
            <button
              onClick={() => setShowCreateExercise(true)}
              className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <FaPlus className="mr-2" />
              Create Exercise
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exercises.map((exercise) => {
              const isSelected = selectedExercises.find(
                (e) => e.id === exercise.id
              );

              return (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">
                        {exercise.name}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize mb-2">
                        {exercise.muscleGroup} • {exercise.difficulty}
                      </p>
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        isSelected
                          ? removeExercise(exercise.id)
                          : addExercise(exercise)
                      }
                      className={`ml-3 p-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-black"
                      }`}
                    >
                      {isSelected ? (
                        <FaMinus className="h-3 w-3" />
                      ) : (
                        <FaPlus className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleStartWorkout}
            disabled={selectedExercises.length === 0 || isSaving}
            className={`flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-colors ${
              selectedExercises.length > 0 && !isSaving
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-2"></div>
            ) : (
              <FaPlay className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Creating Workout..." : "Start Workout Now"}
          </button>

          <button
            onClick={handleSaveWorkout}
            disabled={selectedExercises.length === 0 || isSaving}
            className={`flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-colors ${
              selectedExercises.length > 0 && !isSaving
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-2"></div>
            ) : (
              <FaSave className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Workout"}
          </button>
        </div>
      </div>

      {/* Create Exercise Modal */}
      {showCreateExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] md:max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-yellow-500 flex items-center">
                  <FaPlus className="mr-2" />
                  Create Exercise
                </h2>
                <button
                  onClick={() => {
                    setShowCreateExercise(false);
                    resetExerciseForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmitExercise(handleCreateExercise)}
              className="p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Name*
                </label>
                <input
                  type="text"
                  {...registerExercise("name")}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="e.g., Single Arm Dumbbell Row"
                />
                {exerciseErrors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {exerciseErrors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Muscle Group*
                  </label>
                  <select
                    {...registerExercise("muscleGroup")}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  >
                    <option value="">Select muscle group</option>
                    {muscles.map((muscle) => (
                      <option key={muscle} value={muscle}>
                        {muscle}
                      </option>
                    ))}
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                    <option value="glutes">Glutes</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                    <option value="full_body">Full Body</option>
                  </select>
                  {exerciseErrors.muscleGroup && (
                    <p className="mt-1 text-sm text-red-400">
                      {exerciseErrors.muscleGroup.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty*
                  </label>
                  <select
                    {...registerExercise("difficulty")}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  >
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {exerciseErrors.difficulty && (
                    <p className="mt-1 text-sm text-red-400">
                      {exerciseErrors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description*
                </label>
                <textarea
                  {...registerExercise("description")}
                  rows={3}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="Brief description of the exercise"
                />
                {exerciseErrors.description && (
                  <p className="mt-1 text-sm text-red-400">
                    {exerciseErrors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instructions*
                </label>
                <textarea
                  {...registerExercise("instructions")}
                  rows={4}
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="Step-by-step instructions on how to perform this exercise"
                />
                {exerciseErrors.instructions && (
                  <p className="mt-1 text-sm text-red-400">
                    {exerciseErrors.instructions.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateExercise(false);
                    resetExerciseForm();
                  }}
                  className="px-6 py-3 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white rounded-md font-medium transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Create Exercise
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
