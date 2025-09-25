"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/fa";
import {
  addWorkout,
  generateId,
  getRandomWorkoutImage,
} from "../../utils/workoutStorage";
import {
  fetchExercises,
  fetchExerciseMetadata,
  seedExercises,
  type APIExercise,
} from "../../utils/exerciseApi";
import { getImageForWorkout } from "../../utils/workoutImageStorage";

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

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);

      try {
        // First, fetch metadata to get muscle groups
        const metadata = await fetchExerciseMetadata();
        setMuscleGroups(metadata.muscleGroups);

        // If no exercises exist, show option to seed
        if (metadata.stats.totalExercises === 0) {
          setNeedsSeeding(true);
          setIsLoading(false);
          return;
        }

        // Fetch all exercises
        const exerciseData = await fetchExercises({ limit: 100 });
        setExercises(exerciseData);
      } catch (error) {
        console.error("Error loading exercises:", error);
        setNeedsSeeding(true);
      }

      setIsLoading(false);
    };

    loadExercises();
  }, []);

  const handleSeedExercises = async () => {
    setIsLoading(true);
    const success = await seedExercises();

    if (success) {
      // Reload exercises after seeding
      const exerciseData = await fetchExercises({ limit: 100 });
      setExercises(exerciseData);

      const metadata = await fetchExerciseMetadata();
      setMuscleGroups(metadata.muscleGroups);

      setNeedsSeeding(false);
    }

    setIsLoading(false);
  };

  const onSubmit = async (data: WorkoutFormValues) => {
    setIsSubmitting(true);

    try {
      // Get the exercise names for each selected exercise
      const workoutExercises = data.exercises.map((ex) => {
        const exercise = exercises.find((e) => e.id === ex.exerciseId);
        return {
          ...ex,
          exerciseName: exercise?.name || "Unknown Exercise",
        };
      });

      // Calculate a rough duration based on number of exercises and sets
      const totalSets = data.exercises.reduce((acc, ex) => acc + ex.sets, 0);
      const estimatedDuration = Math.round(totalSets * 2.5); // Rough estimate: 2.5 min per set

      // Get exercise details for image selection
      const exerciseDetails = data.exercises.map((ex) => {
        const exercise = exercises.find((e) => e.id === ex.exerciseId);
        return {
          muscleGroup: exercise?.muscleGroup,
          name: exercise?.name,
        };
      });

      // Create the new workout object
      const newWorkout = {
        id: generateId(),
        name: data.name,
        description:
          data.description ||
          `Custom workout with ${data.exercises.length} exercises`,
        intensity: data.intensity,
        category: data.category.toLowerCase(),
        isPublic: data.isPublic,
        duration: estimatedDuration,
        rating: 5.0, // Default rating for new workouts
        image: getImageForWorkout(exerciseDetails),
        exercises: data.exercises.length,
        createdAt: new Date().toISOString(),
        lastPerformed: new Date().toISOString(),
        workoutExercises,
      };

      // Add the workout to storage
      addWorkout(newWorkout);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the workouts page
      router.push("/workouts");
    } catch (error) {
      console.error("Error creating workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group exercises by muscle group
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    const muscleGroup = exercise.muscleGroup || "Other";
    if (!acc[muscleGroup]) {
      acc[muscleGroup] = [];
    }
    acc[muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const toggleExerciseDropdown = (index: number) => {
    if (visibleExerciseDropdown === index) {
      setVisibleExerciseDropdown(null);
    } else {
      setVisibleExerciseDropdown(index);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.name : "Select an exercise";
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

        // Auto-select the new exercise for the current dropdown
        const event = {
          target: {
            name: `exercises.${currentExerciseIndex}.exerciseId`,
            value: newExercise.id,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        register(`exercises.${currentExerciseIndex}.exerciseId`).onChange(
          event
        );

        // Close modal and reset form
        setShowCreateExercise(false);
        resetExerciseForm();

        // Show success message (you can add toast notification here)
        console.log("Exercise created successfully!");
      } else {
        throw new Error("Failed to create exercise");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      // You can add error toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl fade-in">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="text-yellow-500 hover:text-yellow-400 flex items-center transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Workouts</span>
          </button>
        </div>

        {/* Exercise Seeding Component */}
        {needsSeeding && (
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-yellow-400 h-6 w-6 mr-3" />
              <h2 className="text-xl font-semibold text-yellow-100">
                Setup Required
              </h2>
            </div>
            <p className="text-yellow-200 mb-4">
              No exercises found in the database. Click the button below to
              populate the database with common exercises.
            </p>
            <button
              onClick={handleSeedExercises}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            >
              <FaDumbbell className="mr-2" />
              {isLoading ? "Adding Exercises..." : "Add Default Exercises"}
            </button>
          </div>
        )}

        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
          <div className="flex items-center mb-6">
            <FaDumbbell className="text-yellow-500 h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold text-white">
              Create New Workout
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-inner border border-gray-700 slide-up">
              <h2 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center">
                <FaInfoCircle className="mr-2" />
                Workout Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Workout Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="e.g., Upper Body Power"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Describe your workout..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="intensity"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Intensity
                    </label>
                    <div className="relative">
                      <select
                        id="intensity"
                        {...register("intensity")}
                        className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all appearance-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <FaFire className="text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        {...register("category")}
                        className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all appearance-none"
                      >
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="HIIT">HIIT</option>
                        <option value="Recovery">Recovery</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <FaDumbbell className="text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      type="checkbox"
                      {...register("isPublic")}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label
                      htmlFor="isPublic"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Make this workout public
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Public workouts can be viewed and copied by other users
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-inner border border-gray-700 slide-up">
              <h2 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center">
                <FaRegListAlt className="mr-2" />
                Exercises
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-28">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-700 rounded-lg p-5 bg-gray-850 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-yellow-500 text-lg flex items-center">
                          <FaDumbbell className="mr-2" />
                          Exercise {index + 1}
                        </h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-full transition-all"
                            aria-label="Remove exercise"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Exercise*
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleExerciseDropdown(index)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-white"
                          >
                            <span>
                              {field.exerciseId
                                ? getExerciseName(field.exerciseId)
                                : "Select an exercise"}
                            </span>
                            <svg
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                visibleExerciseDropdown === index
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <input
                            type="hidden"
                            {...register(
                              `exercises.${index}.exerciseId` as const
                            )}
                          />

                          {visibleExerciseDropdown === index && (
                            <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-700">
                              {/* Create New Exercise Button */}
                              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVisibleExerciseDropdown(null);
                                    // Open create exercise modal
                                    setShowCreateExercise(true);
                                    setCurrentExerciseIndex(index);
                                  }}
                                  className="w-full flex items-center justify-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors text-sm font-medium"
                                >
                                  <FaPlus className="mr-2" />
                                  Create New Exercise
                                </button>
                              </div>

                              {Object.entries(exercisesByMuscleGroup).map(
                                ([muscleGroup, exercises]) => (
                                  <div key={muscleGroup}>
                                    <div className="sticky top-0 bg-gray-900 px-3 py-1.5 text-xs font-medium text-yellow-500 uppercase">
                                      {muscleGroup}
                                    </div>
                                    <div>
                                      {exercises.map((exercise) => (
                                        <button
                                          key={exercise.id}
                                          type="button"
                                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                                            field.exerciseId === exercise.id
                                              ? "bg-yellow-500/20 text-yellow-500"
                                              : "text-white"
                                          }`}
                                          onClick={() => {
                                            // Update the field value
                                            const event = {
                                              target: {
                                                name: `exercises.${index}.exerciseId`,
                                                value: exercise.id,
                                              },
                                            } as React.ChangeEvent<HTMLInputElement>;
                                            register(
                                              `exercises.${index}.exerciseId`
                                            ).onChange(event);
                                            toggleExerciseDropdown(index);
                                          }}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span>{exercise.name}</span>
                                            <span className="text-xs text-gray-400 capitalize">
                                              {exercise.difficulty}
                                            </span>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}

                              {Object.keys(exercisesByMuscleGroup).length ===
                                0 && (
                                <div className="p-4 text-center text-gray-400">
                                  <p className="text-sm">No exercises found</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVisibleExerciseDropdown(null);
                                      setShowCreateExercise(true);
                                      setCurrentExerciseIndex(index);
                                    }}
                                    className="mt-2 text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                                  >
                                    Create your first exercise
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.exercises?.[index]?.exerciseId && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.exercises[index]?.exerciseId?.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                            <FaLayerGroup className="mr-2 text-yellow-500" />
                            Sets*
                          </label>
                          <input
                            type="number"
                            {...register(`exercises.${index}.sets` as const, {
                              valueAsNumber: true,
                            })}
                            min="1"
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          />
                          {errors.exercises?.[index]?.sets && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.exercises[index]?.sets?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                            <FaRegListAlt className="mr-2 text-yellow-500" />
                            Reps*
                          </label>
                          <input
                            type="number"
                            {...register(`exercises.${index}.reps` as const, {
                              valueAsNumber: true,
                            })}
                            min="1"
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          />
                          {errors.exercises?.[index]?.reps && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.exercises[index]?.reps?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                            <FaWeightHanging className="mr-2 text-yellow-500" />
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            {...register(`exercises.${index}.weight` as const, {
                              valueAsNumber: true,
                            })}
                            min="0"
                            step="0.5"
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Notes
                        </label>
                        <textarea
                          {...register(`exercises.${index}.notes` as const)}
                          rows={2}
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="Any specific instructions or notes..."
                        />
                      </div>
                    </div>
                  ))}

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
                    <span>Add Another Exercise</span>
                  </button>
                </div>
              )}

              {errors.exercises && !Array.isArray(errors.exercises) && (
                <p className="mt-4 text-sm text-red-400 font-medium">
                  {errors.exercises.message}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 slide-in-right">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-3 px-6 rounded-md flex items-center justify-center transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-6 rounded-md flex items-center justify-center font-medium disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    <span>Save Workout</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Create Exercise Modal */}
        {showCreateExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-yellow-500 flex items-center">
                    <FaPlus className="mr-2" />
                    Create New Exercise
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateExercise(false);
                      resetExerciseForm();
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
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
    </div>
  );
}
