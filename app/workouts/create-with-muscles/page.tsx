"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaDumbbell,
  FaCheck,
  FaFilter,
  FaRandom,
} from "react-icons/fa";

// Validation schema
const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  intensity: z.enum(["Low", "Medium", "High"]).default("Medium"),
  category: z
    .enum(["Strength", "Cardio", "Flexibility", "HIIT", "Recovery"])
    .default("Strength"),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1, "Exercise is required"),
        sets: z.number().min(1, "At least 1 set required"),
        reps: z.number().min(1, "At least 1 rep required"),
        weight: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .min(3, "At least 3 exercises are required for a quality workout"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  instructions: string;
}

// Component that uses searchParams (needs to be in Suspense)
function CreateWorkoutWithMusclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [showFiltered, setShowFiltered] = useState(true);

  // Get workout planning data from URL params
  const workoutName = searchParams.get("name") || "";
  const intensity = searchParams.get("intensity") || "Medium";
  const category = searchParams.get("category") || "Strength";
  const musclesParam = searchParams.get("muscles") || "";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: workoutName,
      description: "",
      intensity: intensity as any,
      category: category as any,
      exercises: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "exercises",
  });

  const watchedExercises = watch("exercises");

  useEffect(() => {
    if (musclesParam) {
      setSelectedMuscles(musclesParam.split(","));
    }
  }, [musclesParam]);

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        let allExercises: Exercise[] = [];

        // Fetch exercises for each selected muscle group
        if (selectedMuscles.length > 0) {
          for (const muscle of selectedMuscles) {
            const response = await fetch(
              `/api/exercises?muscleGroup=${muscle}&limit=50`
            );
            if (response.ok) {
              const muscleExercises = await response.json();
              allExercises = [...allExercises, ...muscleExercises];
            }
          }
        } else {
          // Fallback: load all exercises
          const response = await fetch(`/api/exercises?limit=100`);
          if (response.ok) {
            allExercises = await response.json();
          }
        }

        setExercises(allExercises);
        setFilteredExercises(allExercises);

        // Auto-suggest some exercises if none selected
        if (allExercises.length >= 3) {
          const suggestedExercises = allExercises.slice(0, 3).map((ex) => ({
            exerciseId: ex.id,
            sets: 3,
            reps: 10,
            weight: 0,
            notes: "",
          }));
          replace(suggestedExercises);
        }
      } catch (error) {
        console.error("Error loading exercises:", error);
      }
      setIsLoading(false);
    };

    loadExercises();
  }, [selectedMuscles, replace]);

  const toggleFilter = () => {
    if (showFiltered) {
      // Show all exercises
      setFilteredExercises(exercises);
    } else {
      // Show only muscle-group filtered exercises
      const filtered = exercises.filter((ex) =>
        selectedMuscles.some(
          (muscle) => ex.muscleGroup?.toLowerCase() === muscle.toLowerCase()
        )
      );
      setFilteredExercises(filtered);
    }
    setShowFiltered(!showFiltered);
  };

  const addRandomExercise = () => {
    const availableExercises = filteredExercises.filter(
      (ex) => !watchedExercises.some((we) => we.exerciseId === ex.id)
    );

    if (availableExercises.length > 0) {
      const randomExercise =
        availableExercises[
          Math.floor(Math.random() * availableExercises.length)
        ];
      append({
        exerciseId: randomExercise.id,
        sets: 3,
        reps: 10,
        weight: 0,
        notes: "",
      });
    }
  };

  const onSubmit = async (data: WorkoutFormValues) => {
    setIsSubmitting(true);

    try {
      // Add order field to exercises and filter out empty exerciseIds
      const exercisesWithOrder = data.exercises
        .filter((ex) => ex.exerciseId) // Remove exercises without selected exercise
        .map((exercise, index) => ({
          ...exercise,
          order: index + 1,
        }));

      const workoutData = {
        name: data.name,
        description: data.description,
        exercises: exercisesWithOrder,
        public: false,
      };

      console.log("Submitting workout data:", workoutData);

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Workout created successfully:", result);
        router.push("/workouts");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to create workout");
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      alert(
        `Error creating workout: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.name : "Unknown Exercise";
  };

  const getExerciseInfo = (exerciseId: string) => {
    return exercises.find((ex) => ex.id === exerciseId);
  };

  // Calculate current muscle group distribution
  const getCurrentMuscleGroups = () => {
    const selectedExerciseIds = watchedExercises
      .filter((ex) => ex.exerciseId)
      .map((ex) => ex.exerciseId);

    const muscleGroups: Record<string, number> = {};

    selectedExerciseIds.forEach((id) => {
      const exercise = exercises.find((ex) => ex.id === id);
      if (exercise && exercise.muscleGroup) {
        muscleGroups[exercise.muscleGroup] =
          (muscleGroups[exercise.muscleGroup] || 0) + 1;
      }
    });

    return muscleGroups;
  };

  const currentMuscleGroups = getCurrentMuscleGroups();

  // Group exercises by muscle group for better organization
  const exercisesByMuscleGroup = filteredExercises.reduce((acc, exercise) => {
    const muscleGroup = exercise.muscleGroup || "Other";
    if (!acc[muscleGroup]) {
      acc[muscleGroup] = [];
    }
    acc[muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-yellow-400 hover:text-yellow-300 flex items-center transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div className="h-2 w-8 rounded-full bg-yellow-400"></div>
            <div className="h-2 w-8 rounded-full bg-yellow-400"></div>
            <div className="h-2 w-8 rounded-full bg-yellow-400"></div>
          </div>

          <div className="w-20"></div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <FaDumbbell className="text-yellow-500 mr-2 sm:mr-3" />
              Build Your Workout
            </h1>

            <div className="text-sm space-y-1 lg:text-right">
              {selectedMuscles.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-gray-400">Planned: </span>
                  <span className="text-yellow-400 capitalize break-words">
                    {selectedMuscles.join(", ")}
                  </span>
                </div>
              )}

              {Object.keys(currentMuscleGroups).length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="text-gray-400">Current: </span>
                  <span className="text-green-400 capitalize break-words">
                    {Object.entries(currentMuscleGroups)
                      .map(([muscle, count]) => `${muscle} (${count})`)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Workout Info Summary */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <div className="font-medium text-white">{workoutName}</div>
                </div>
                <div>
                  <span className="text-gray-400">Intensity:</span>
                  <div className="font-medium text-yellow-400">{intensity}</div>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <div className="font-medium text-white">{category}</div>
                </div>
              </div>
            </div>

            {/* Exercise Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={toggleFilter}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    showFiltered
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <FaFilter className="mr-2" />
                  {showFiltered ? "Filtered" : "All Exercises"}
                </button>

                <button
                  type="button"
                  onClick={addRandomExercise}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <FaRandom className="mr-2" />
                  Add Random
                </button>
              </div>

              <div className="text-sm text-gray-400 w-full sm:w-auto text-left sm:text-right">
                {fields.length}/3 exercises minimum
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-yellow-500">
                Exercises
              </h2>

              {fields.map((field, index) => {
                const exerciseInfo = getExerciseInfo(field.exerciseId);

                return (
                  <div
                    key={field.id}
                    className="bg-gray-900 rounded-lg p-5 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-yellow-400 text-lg flex items-center">
                        <FaDumbbell className="mr-2" />
                        Exercise {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-full transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Exercise Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exercise*
                      </label>
                      <select
                        {...register(`exercises.${index}.exerciseId` as const)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="">Select an exercise</option>
                        {Object.entries(exercisesByMuscleGroup).map(
                          ([muscleGroup, exercises]) => (
                            <optgroup
                              key={muscleGroup}
                              label={
                                muscleGroup.charAt(0).toUpperCase() +
                                muscleGroup.slice(1)
                              }
                            >
                              {exercises.map((exercise) => (
                                <option key={exercise.id} value={exercise.id}>
                                  {exercise.name} ({exercise.difficulty})
                                </option>
                              ))}
                            </optgroup>
                          )
                        )}
                      </select>
                      {errors.exercises?.[index]?.exerciseId && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.exercises[index]?.exerciseId?.message}
                        </p>
                      )}
                    </div>

                    {/* Exercise Info */}
                    {exerciseInfo && (
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">
                            {exerciseInfo.name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              exerciseInfo.difficulty === "Beginner"
                                ? "bg-green-900/30 text-green-400"
                                : exerciseInfo.difficulty === "Intermediate"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {exerciseInfo.difficulty}
                          </span>
                        </div>

                        <div className="text-sm text-gray-300 space-y-1">
                          <div className="flex items-center">
                            <span className="font-medium text-yellow-400 mr-2">
                              Target:
                            </span>
                            <span className="capitalize">
                              {exerciseInfo.muscleGroup}
                            </span>
                            {currentMuscleGroups[exerciseInfo.muscleGroup] >
                              1 && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded">
                                {currentMuscleGroups[exerciseInfo.muscleGroup]}x
                                in workout
                              </span>
                            )}
                          </div>

                          {exerciseInfo.description && (
                            <p className="text-gray-400 text-xs mt-1">
                              {exerciseInfo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sets, Reps, Weight */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sets*
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.sets` as const, {
                            valueAsNumber: true,
                          })}
                          min="1"
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Reps*
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.reps` as const, {
                            valueAsNumber: true,
                          })}
                          min="1"
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.weight` as const, {
                            valueAsNumber: true,
                          })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        {...register(`exercises.${index}.notes` as const)}
                        rows={2}
                        className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Any specific instructions..."
                      />
                    </div>
                  </div>
                );
              })}

              {/* Add Exercise Button */}
              <button
                type="button"
                onClick={() =>
                  append({
                    exerciseId: "",
                    sets: 3,
                    reps: 10,
                    weight: 0,
                    notes: "",
                  })
                }
                className="w-full flex items-center justify-center text-yellow-500 hover:text-yellow-400 bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-dashed border-gray-700 hover:border-yellow-500 transition-all"
              >
                <FaPlus className="mr-2" />
                Add Exercise
              </button>
            </div>

            {errors.exercises && !Array.isArray(errors.exercises) && (
              <p className="text-sm text-red-400 font-medium">
                {errors.exercises.message}
              </p>
            )}

            {/* Workout Quality Check */}
            <div className="space-y-4">
              {/* Exercise Count Check */}
              <div
                className={`p-4 rounded-lg border ${
                  fields.length >= 3
                    ? "bg-green-900/20 border-green-700/30"
                    : "bg-yellow-900/20 border-yellow-700/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {fields.length >= 3 ? (
                      <FaCheck className="text-green-400 mr-2" />
                    ) : (
                      <FaDumbbell className="text-yellow-400 mr-2" />
                    )}
                    <span
                      className={
                        fields.length >= 3
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      Exercise Count: {fields.length}/3 minimum
                    </span>
                  </div>

                  {fields.length < 3 && (
                    <span className="text-sm text-gray-400">
                      Add {3 - fields.length} more
                    </span>
                  )}
                </div>
              </div>

              {/* Muscle Group Balance */}
              {Object.keys(currentMuscleGroups).length > 0 && (
                <div className="p-4 rounded-lg border bg-blue-900/20 border-blue-700/30">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-blue-400 font-medium mb-2">
                        Muscle Group Distribution
                      </h4>
                      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(currentMuscleGroups).map(
                          ([muscle, count]) => (
                            <div
                              key={muscle}
                              className="flex justify-between text-sm bg-gray-800/50 rounded px-2 py-1"
                            >
                              <span className="text-gray-300 capitalize truncate mr-2">
                                {muscle}:
                              </span>
                              <span className="text-blue-400 font-medium flex-shrink-0">
                                {count} exercise{count > 1 ? "s" : ""}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="text-center sm:text-right flex-shrink-0">
                      <div className="text-sm text-gray-400">Total Groups</div>
                      <div className="text-xl font-bold text-blue-400">
                        {Object.keys(currentMuscleGroups).length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.push("/workouts")}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || fields.length < 3}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 disabled:text-gray-400 text-black py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Workout
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function CreateWorkoutLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-800 rounded-lg p-6 h-96"></div>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense
export default function CreateWorkoutWithMuscles() {
  return (
    <Suspense fallback={<CreateWorkoutLoading />}>
      <CreateWorkoutWithMusclesContent />
    </Suspense>
  );
}
