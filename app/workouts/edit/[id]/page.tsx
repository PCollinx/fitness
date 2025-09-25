"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaDumbbell,
  FaInfoCircle,
  FaLayerGroup,
  FaRegListAlt,
  FaWeightHanging,
  FaFire,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import {
  loadWorkouts,
  updateWorkout,
  type Workout,
} from "../../../utils/workoutStorage";
import {
  fetchExercises,
  fetchExerciseMetadata,
  seedExercises,
  type APIExercise,
} from "../../../utils/exerciseApi";
import { getImageForWorkout } from "../../../utils/workoutImageStorage";

// Validation schema
const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
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
    .min(1, "At least one exercise is required"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

// Exercise creation schema
const exerciseCreationSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  description: z.string().min(1, "Description is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  instructions: z.string().min(1, "Instructions are required"),
});

type ExerciseCreationFormValues = z.infer<typeof exerciseCreationSchema>;
type Exercise = APIExercise;

export default function EditWorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;

  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleExerciseDropdown, setVisibleExerciseDropdown] = useState<
    number | null
  >(null);
  const [needsSeeding, setNeedsSeeding] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      intensity: "Medium",
      category: "Strength",
      exercises: [{ exerciseId: "", sets: 3, reps: 10, weight: 0, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const {
    register: registerExercise,
    handleSubmit: handleSubmitExercise,
    formState: { errors: exerciseErrors },
    reset: resetExercise,
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

  // Load workout data and exercises
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Load the current workout
        const allWorkouts = loadWorkouts();
        const workout = allWorkouts.find((w) => w.id === workoutId);

        if (!workout) {
          router.push("/workouts");
          return;
        }

        if (workout.isDefault) {
          // Prevent editing default workouts
          alert("Default workouts cannot be edited");
          router.push(`/workouts/${workoutId}`);
          return;
        }

        setCurrentWorkout(workout);

        // Populate form with workout data
        reset({
          name: workout.name,
          description: workout.description || "",
          isPublic: workout.isPublic || false,
          intensity:
            (workout.intensity as "Low" | "Medium" | "High") || "Medium",
          category:
            (workout.category as
              | "Strength"
              | "Cardio"
              | "Flexibility"
              | "HIIT"
              | "Recovery") || "Strength",
          exercises: workout.workoutExercises?.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight || 0,
            notes: ex.notes || "",
          })) || [{ exerciseId: "", sets: 3, reps: 10, weight: 0, notes: "" }],
        });

        // Load exercises and metadata
        const [exerciseData, metaData] = await Promise.all([
          fetchExercises(),
          fetchExerciseMetadata(),
        ]);

        console.log("Loaded exercises:", exerciseData.length);
        console.log("Loaded muscle groups:", metaData.muscleGroups);

        if (exerciseData.length === 0) {
          setNeedsSeeding(true);
        } else {
          setExercises(exerciseData);
          setMuscleGroups(metaData.muscleGroups);
        }
      } catch (error) {
        console.error("Error loading workout data:", error);
        alert("Error loading workout data");
        router.push("/workouts");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [workoutId, reset, router]);

  // Seed exercises if needed
  const handleSeedExercises = async () => {
    setIsLoading(true);
    try {
      await seedExercises();
      const [exerciseData, metaData] = await Promise.all([
        fetchExercises(),
        fetchExerciseMetadata(),
      ]);
      console.log("Seeded exercises:", exerciseData.length);
      console.log("Seeded muscle groups:", metaData.muscleGroups);
      setExercises(exerciseData);
      setMuscleGroups(metaData.muscleGroups);
      setNeedsSeeding(false);
    } catch (error) {
      console.error("Error seeding exercises:", error);
      alert("Error loading exercises. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: WorkoutFormValues) => {
    if (!currentWorkout) return;

    setIsSubmitting(true);
    try {
      // Prepare workout exercises data
      const workoutExercises = data.exercises.map((ex) => {
        const exercise = exercises.find((e) => e.id === ex.exerciseId);
        return {
          exerciseId: ex.exerciseId,
          exerciseName: exercise?.name || "Unknown Exercise",
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || undefined,
          notes: ex.notes || "",
        };
      });

      // Generate image based on exercises' muscle groups
      const exerciseObjects = workoutExercises
        .map((ex) => {
          const exercise = exercises.find((e) => e.id === ex.exerciseId);
          return exercise
            ? { muscleGroup: exercise.muscleGroup, name: exercise.name }
            : null;
        })
        .filter(Boolean) as { muscleGroup?: string; name?: string }[];

      const workoutImage = getImageForWorkout(exerciseObjects);

      // Create updated workout object
      const updatedWorkout: Workout = {
        ...currentWorkout,
        name: data.name,
        description: data.description || "",
        isPublic: data.isPublic,
        intensity: data.intensity,
        category: data.category,
        workoutExercises,
        image: workoutImage,
      };

      // Update workout in storage
      const success = updateWorkout(currentWorkout.id, updatedWorkout);

      if (success) {
        router.push(`/workouts/${currentWorkout.id}`);
      } else {
        throw new Error("Failed to update workout");
      }
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Error updating workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exercise creation
  const onSubmitExercise = async (data: ExerciseCreationFormValues) => {
    try {
      // Create new exercise
      const newExercise: Exercise = {
        id: `custom_${Date.now()}`,
        name: data.name,
        description: data.description,
        muscleGroup: data.muscleGroup,
        difficulty: data.difficulty,
        instructions: data.instructions,
        createdAt: new Date().toISOString(),
      };

      // Add to exercises list
      setExercises((prev) => [...prev, newExercise]);

      // Set the new exercise for the current field
      setValue(`exercises.${currentExerciseIndex}.exerciseId`, newExercise.id);

      // Close modal and reset form
      setShowCreateExercise(false);
      resetExercise();
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  // Add new exercise to workout
  const addExercise = () => {
    append({ exerciseId: "", sets: 3, reps: 10, weight: 0, notes: "" });
  };

  // Remove exercise from workout
  const removeExercise = (index: number) => {
    console.log(
      `Attempting to remove exercise at index ${index}, total exercises: ${fields.length}`
    );
    if (fields.length > 1) {
      remove(index);
      console.log(`Exercise removed, new total: ${fields.length - 1}`);
    } else {
      // Provide feedback that at least one exercise is required
      alert("At least one exercise is required for a workout");
    }
  };

  // Get exercise name by ID
  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    return exercise?.name || "Select an exercise";
  };

  // Toggle exercise dropdown
  const toggleExerciseDropdown = (index: number) => {
    setVisibleExerciseDropdown(
      visibleExerciseDropdown === index ? null : index
    );
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setVisibleExerciseDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (needsSeeding) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
          <FaDumbbell className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Exercise Database Empty
          </h2>
          <p className="text-gray-300 mb-6">
            No exercises found. Would you like to load the default exercise
            database?
          </p>
          <div className="space-y-3">
            <button
              onClick={handleSeedExercises}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Load Default Exercises
            </button>
            <button
              onClick={() => router.push("/workouts")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/workouts/${workoutId}`)}
            className="text-yellow-500 hover:text-yellow-400 flex items-center mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Workout</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Workout</h1>
            <p className="text-gray-400">
              Update your workout details and exercises
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Workout Information */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FaInfoCircle className="mr-3 text-yellow-500" />
              Workout Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workout Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workout Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter workout name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  {...register("category")}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Recovery">Recovery</option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Intensity *
                </label>
                <select
                  {...register("intensity")}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.intensity && (
                  <p className="text-red-400 text-sm mt-2">
                    {errors.intensity.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  placeholder="Describe your workout..."
                />
              </div>

              {/* Public/Private Toggle */}
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    {...register("isPublic")}
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                  <span className="ml-3 text-gray-300 text-sm font-medium">
                    Make this workout public
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white flex items-center">
                <FaDumbbell className="mr-3 text-yellow-500" />
                Exercises ({fields.length})
              </h2>
              <button
                type="button"
                onClick={addExercise}
                className="bg-yellow-500 text-base hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Exercise
              </button>
            </div>

            {errors.exercises?.root && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">
                  {errors.exercises.root.message}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className={`absolute top-4 right-4 transition-colors ${
                      fields.length === 1
                        ? "text-red-300 opacity-50 cursor-not-allowed"
                        : "text-red-400 hover:text-red-300 cursor-pointer"
                    }`}
                    title={
                      fields.length === 1
                        ? "At least one exercise is required"
                        : "Remove exercise"
                    }
                    disabled={fields.length === 1}
                  >
                    <FaTrash />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Exercise Selection */}
                    <div
                      className="relative md:col-span-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exercise *
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleExerciseDropdown(index)}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-left text-white hover:bg-gray-550 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent flex items-center justify-between"
                      >
                        <span className="truncate">
                          {getExerciseName(field.exerciseId)}
                        </span>
                        <FaDumbbell className="text-yellow-500 flex-shrink-0" />
                      </button>

                      {/* Dropdown */}
                      {visibleExerciseDropdown === index && (
                        <div
                          className="absolute top-full left-0 right-0 z-10 mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Create New Exercise Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentExerciseIndex(index);
                              setShowCreateExercise(true);
                              setVisibleExerciseDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-yellow-500 hover:bg-gray-550 flex items-center border-b border-gray-500"
                          >
                            <FaPlus className="mr-3" />
                            Create New Exercise
                          </button>

                          {/* Exercise List */}
                          {exercises.length > 0 ? (
                            muscleGroups.length > 0 ? (
                              muscleGroups.map((muscleGroup) => {
                                const groupExercises = exercises.filter(
                                  (ex) => ex.muscleGroup === muscleGroup
                                );
                                if (groupExercises.length === 0) return null;

                                return (
                                  <div key={muscleGroup}>
                                    <div className="px-4 py-2 bg-gray-700 text-yellow-500 text-sm font-medium sticky top-0">
                                      {muscleGroup}
                                    </div>
                                    {groupExercises.map((exercise) => (
                                      <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => {
                                          setValue(
                                            `exercises.${index}.exerciseId`,
                                            exercise.id
                                          );
                                          setVisibleExerciseDropdown(null);
                                        }}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-550 ${
                                          field.exerciseId === exercise.id
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "text-white"
                                        }`}
                                      >
                                        <div className="text-sm font-medium">
                                          {exercise.name}
                                        </div>
                                        {exercise.difficulty && (
                                          <div className="text-xs text-gray-400">
                                            {exercise.difficulty}
                                          </div>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                );
                              })
                            ) : (
                              // Show all exercises without muscle group separation if no muscle groups
                              exercises.map((exercise) => (
                                <button
                                  key={exercise.id}
                                  type="button"
                                  onClick={() => {
                                    setValue(
                                      `exercises.${index}.exerciseId`,
                                      exercise.id
                                    );
                                    setVisibleExerciseDropdown(null);
                                  }}
                                  className={`w-full px-4 py-2 text-left hover:bg-gray-550 ${
                                    field.exerciseId === exercise.id
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "text-white"
                                  }`}
                                >
                                  <div className="text-sm font-medium">
                                    {exercise.name}
                                  </div>
                                  {exercise.difficulty && (
                                    <div className="text-xs text-gray-400">
                                      {exercise.difficulty}
                                    </div>
                                  )}
                                  {exercise.muscleGroup && (
                                    <div className="text-xs text-gray-400">
                                      {exercise.muscleGroup}
                                    </div>
                                  )}
                                </button>
                              ))
                            )
                          ) : (
                            <div className="px-4 py-3 text-gray-400 text-sm">
                              No exercises available. Create one above.
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        type="hidden"
                        {...register(`exercises.${index}.exerciseId`)}
                      />
                      {errors.exercises?.[index]?.exerciseId && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.exercises[index]?.exerciseId?.message}
                        </p>
                      )}
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaLayerGroup className="inline mr-1 text-yellow-500" />
                        Sets *
                      </label>
                      <input
                        {...register(`exercises.${index}.sets`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="1"
                        max="50"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="3"
                      />
                      {errors.exercises?.[index]?.sets && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.exercises[index]?.sets?.message}
                        </p>
                      )}
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaRegListAlt className="inline mr-1 text-yellow-500" />
                        Reps *
                      </label>
                      <input
                        {...register(`exercises.${index}.reps`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="1"
                        max="200"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="10"
                      />
                      {errors.exercises?.[index]?.reps && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.exercises[index]?.reps?.message}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaWeightHanging className="inline mr-1 text-yellow-500" />
                        Weight (kg)
                      </label>
                      <input
                        {...register(`exercises.${index}.weight`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        step="0.5"
                        max="1000"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Notes
                      </label>
                      <input
                        {...register(`exercises.${index}.notes`)}
                        type="text"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Optional notes for this exercise"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/workouts/${workoutId}`)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-6 py-3 rounded-lg flex items-center font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Update Workout
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Exercise Creation Modal */}
      {showCreateExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FaPlus className="mr-3 text-yellow-500" />
                Create New Exercise
              </h3>
              <button
                onClick={() => {
                  setShowCreateExercise(false);
                  resetExercise();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitExercise(onSubmitExercise)}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exercise Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exercise Name *
                  </label>
                  <input
                    {...registerExercise("name")}
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Barbell Bench Press"
                  />
                  {exerciseErrors.name && (
                    <p className="text-red-400 text-sm mt-2">
                      {exerciseErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Muscle Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Muscle Group *
                  </label>
                  <select
                    {...registerExercise("muscleGroup")}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select muscle group</option>
                    {muscleGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {exerciseErrors.muscleGroup && (
                    <p className="text-red-400 text-sm mt-2">
                      {exerciseErrors.muscleGroup.message}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    {...registerExercise("difficulty")}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {exerciseErrors.difficulty && (
                    <p className="text-red-400 text-sm mt-2">
                      {exerciseErrors.difficulty.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...registerExercise("description")}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the exercise"
                  />
                  {exerciseErrors.description && (
                    <p className="text-red-400 text-sm mt-2">
                      {exerciseErrors.description.message}
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructions *
                  </label>
                  <textarea
                    {...registerExercise("instructions")}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Step-by-step instructions (each step on a new line)"
                  />
                  {exerciseErrors.instructions && (
                    <p className="text-red-400 text-sm mt-2">
                      {exerciseErrors.instructions.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateExercise(false);
                    resetExercise();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg flex items-center font-medium transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Create Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
