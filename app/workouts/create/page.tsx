"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { getSmartWorkoutImage } from "@/app/utils/workoutImageRecommendation";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaDumbbell,
  FaCheck,
  FaFilter,
  FaRandom,
  FaArrowRight,
  FaFire,
  FaClock,
  FaLayerGroup,
  FaPlus as FaPlusCircle,
  FaTimes,
} from "react-icons/fa";

// Validation schemas
const workoutPlanSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  intensity: z.enum(["Low", "Medium", "High"]).default("Medium"),
  category: z
    .enum(["Strength", "Cardio", "Flexibility", "HIIT", "Recovery"])
    .default("Strength"),
});

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

type WorkoutPlanValues = z.infer<typeof workoutPlanSchema>;
type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  instructions: string;
}

const muscleGroups = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "legs",
  "glutes",
  "core",
  "full body",
];

export default function CreateWorkoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [showFiltered, setShowFiltered] = useState(true);
  const [showNewExerciseModal, setShowNewExerciseModal] = useState(false);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanValues>({
    name: "",
    intensity: "Medium",
    category: "Strength",
  });

  // New exercise form
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    muscleGroup: "",
    difficulty: "intermediate",
    instructions: "",
  });

  // Step 1: Planning form
  const planForm = useForm<WorkoutPlanValues>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: workoutPlan,
  });

  // Step 3: Exercise form
  const exerciseForm = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: workoutPlan.name,
      description: "",
      intensity: workoutPlan.intensity,
      category: workoutPlan.category,
      exercises: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: exerciseForm.control,
    name: "exercises",
  });

  const watchedExercises = exerciseForm.watch("exercises");

  // Step 1: Handle workout plan submission
  const onPlanSubmit = (data: WorkoutPlanValues) => {
    setWorkoutPlan(data);
    setCurrentStep(2);
  };

  // Step 2: Handle muscle selection
  const handleMuscleSelection = (muscles: string[]) => {
    setSelectedMuscles(muscles);
    setCurrentStep(3);
  };

  // Step 3: Load exercises when muscles are selected
  useEffect(() => {
    if (currentStep === 3 && selectedMuscles.length > 0) {
      loadExercises();
    }
  }, [currentStep, selectedMuscles]);

  // Update exercise form with workout plan data
  useEffect(() => {
    if (workoutPlan.name) {
      exerciseForm.setValue("name", workoutPlan.name);
      exerciseForm.setValue("intensity", workoutPlan.intensity);
      exerciseForm.setValue("category", workoutPlan.category);
    }
  }, [workoutPlan, exerciseForm]);

  const loadExercises = async () => {
    setIsLoading(true);
    try {
      let allExercises: Exercise[] = [];

      for (const muscle of selectedMuscles) {
        const response = await fetch(
          `/api/exercises?muscleGroup=${muscle}&limit=50`
        );
        if (response.ok) {
          const muscleExercises = await response.json();
          allExercises = [...allExercises, ...muscleExercises];
        }
      }

      setExercises(allExercises);
      setFilteredExercises(allExercises);

      // Auto-suggest exercises
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

  // Final submission
  const onFinalSubmit = async (data: WorkoutFormValues) => {
    if (!session?.user) {
      alert("Please sign in to create workouts");
      return;
    }

    setIsSubmitting(true);

    try {
      const exercisesWithOrder = data.exercises
        .filter((ex) => ex.exerciseId)
        .map((exercise, index) => ({
          ...exercise,
          order: index + 1,
        }));

      // Get smart image recommendation based on exercises and user's fitness goals
      const exerciseData = data.exercises
        .filter((ex) => ex.exerciseId)
        .map((ex) => {
          const exercise = exercises.find((e) => e.id === ex.exerciseId);
          return {
            name: exercise?.name || "Exercise",
            muscleGroup: exercise?.muscleGroup || "full_body",
          };
        });

      const recommendedImage = getSmartWorkoutImage({
        exercises: exerciseData,
        category: workoutPlan.category,
        fitnessGoals: session?.user?.fitnessGoals || [],
        workoutName: data.name,
        description: data.description,
      });

      const workoutData = {
        name: data.name,
        description: data.description,
        exercises: exercisesWithOrder,
        image: recommendedImage,
        public: false,
      };

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

        // Add a small delay to ensure database changes are committed
        setTimeout(() => {
          router.push("/workouts?refresh=true");
        }, 500);
      } else {
        const errorData = await response.json();
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

  // Helper functions for step 3
  const toggleFilter = () => {
    if (showFiltered) {
      setFilteredExercises(exercises);
    } else {
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

  const createNewExercise = async () => {
    if (!newExercise.name || !newExercise.muscleGroup) {
      alert("Please fill in exercise name and muscle group");
      return;
    }

    setIsCreatingExercise(true);

    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      });

      if (response.ok) {
        const createdExercise = await response.json();

        // Add to exercises list
        setExercises((prev) => [...prev, createdExercise]);
        setFilteredExercises((prev) => [...prev, createdExercise]);

        // Add to workout automatically
        append({
          exerciseId: createdExercise.id,
          sets: 3,
          reps: 10,
          weight: 0,
          notes: "",
        });

        // Reset form and close modal
        setNewExercise({
          name: "",
          description: "",
          muscleGroup: "",
          difficulty: "intermediate",
          instructions: "",
        });
        setShowNewExerciseModal(false);

        // Show success message
        const successDiv = document.createElement("div");
        successDiv.className =
          "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50";
        successDiv.textContent = `✅ "${createdExercise.name}" created and added to workout!`;
        document.body.appendChild(successDiv);
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create exercise");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsCreatingExercise(false);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.name : "Unknown Exercise";
  };

  const getExerciseInfo = (exerciseId: string) => {
    return exercises.find((ex) => ex.id === exerciseId);
  };

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
  const exercisesByMuscleGroup = filteredExercises.reduce((acc, exercise) => {
    const muscleGroup = exercise.muscleGroup || "Other";
    if (!acc[muscleGroup]) {
      acc[muscleGroup] = [];
    }
    acc[muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // Constants for step 1
  const intensityInfo = {
    Low: {
      color: "text-green-400",
      description: "Light effort, suitable for recovery or beginners",
    },
    Medium: {
      color: "text-yellow-400",
      description: "Moderate effort, balanced workout",
    },
    High: {
      color: "text-red-400",
      description: "High effort, challenging and intense",
    },
  };

  const categoryInfo = {
    Strength: { icon: "💪", description: "Build muscle and increase strength" },
    Cardio: { icon: "❤️", description: "Improve cardiovascular fitness" },
    Flexibility: {
      icon: "🤸",
      description: "Enhance mobility and flexibility",
    },
    HIIT: { icon: "⚡", description: "High-intensity interval training" },
    Recovery: { icon: "🧘", description: "Active recovery and relaxation" },
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-400">
            You need to be signed in to create workouts.
          </p>
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
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                router.back();
              }
            }}
            className="text-yellow-400 hover:text-yellow-300 flex items-center transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full ${
                  step <= currentStep ? "bg-yellow-400" : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="w-20"></div>
        </div>

        {/* Step 1: Workout Planning */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <FaDumbbell className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Plan Your Workout
              </h1>
              <p className="text-gray-400 text-lg">
                Let's start by setting up the basics
              </p>
            </div>

            <form
              onSubmit={planForm.handleSubmit(onPlanSubmit)}
              className="space-y-8"
            >
              {/* Workout Name */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <label className="block text-lg font-semibold text-yellow-500 mb-2">
                  Workout Name
                </label>
                <input
                  {...planForm.register("name")}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                  placeholder="e.g., Upper Body Power, Leg Day Blast, Full Body HIIT"
                />
                {planForm.formState.errors.name && (
                  <p className="mt-2 text-sm text-red-400">
                    {planForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Intensity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <label className="block text-lg font-semibold text-yellow-500 mb-4">
                  <FaFire className="inline mr-2" />
                  Intensity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["Low", "Medium", "High"] as const).map((level) => (
                    <label
                      key={level}
                      className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        planForm.watch("intensity") === level
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-600 bg-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <input
                        type="radio"
                        value={level}
                        {...planForm.register("intensity")}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold mb-1 ${intensityInfo[level].color}`}
                        >
                          {level}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <label className="block text-lg font-semibold text-yellow-500 mb-4">
                  <FaLayerGroup className="inline mr-2" />
                  Workout Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(
                    [
                      "Strength",
                      "Cardio",
                      "Flexibility",
                      "HIIT",
                      "Recovery",
                    ] as const
                  ).map((cat) => (
                    <label
                      key={cat}
                      className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        planForm.watch("category") === cat
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-600 bg-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <input
                        type="radio"
                        value={cat}
                        {...planForm.register("category")}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {categoryInfo[cat].icon}
                        </span>
                        <div>
                          <div className="font-medium text-white">{cat}</div>
                          <div className="text-xs text-gray-400">
                            {categoryInfo[cat].description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!planForm.watch("name")}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  planForm.watch("name")
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Choose Muscle Groups</span>
                <FaArrowRight />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Muscle Group Selection */}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Select Muscle Groups
              </h1>
              <p className="text-gray-400 text-lg">
                Choose the muscles you want to target
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {muscleGroups.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => {
                      setSelectedMuscles((prev) =>
                        prev.includes(muscle)
                          ? prev.filter((m) => m !== muscle)
                          : [...prev, muscle]
                      );
                    }}
                    className={`p-4 rounded-lg border-2 transition-all capitalize ${
                      selectedMuscles.includes(muscle)
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-gray-600 bg-gray-700 text-white hover:border-gray-500"
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleMuscleSelection(selectedMuscles)}
                disabled={selectedMuscles.length === 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  selectedMuscles.length > 0
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Build Workout ({selectedMuscles.length} selected)</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Exercise Selection */}
        {currentStep === 3 && (
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

            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white">Loading exercises...</p>
              </div>
            ) : (
              <form
                onSubmit={exerciseForm.handleSubmit(onFinalSubmit)}
                className="space-y-6"
              >
                {/* Exercise Controls */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={toggleFilter}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors text-sm min-w-0 ${
                        showFiltered
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      <FaFilter className="mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {showFiltered ? "Filtered" : "All Exercises"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={addRandomExercise}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm min-w-0"
                    >
                      <FaRandom className="mr-2 flex-shrink-0" />
                      <span className="truncate">Add Random</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
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
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              {...exerciseForm.register(
                                `exercises.${index}.exerciseId` as const
                              )}
                              className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
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
                                      <option
                                        key={exercise.id}
                                        value={exercise.id}
                                      >
                                        {exercise.name} ({exercise.difficulty})
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                              )}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                // Pre-fill with first selected muscle group if available
                                if (selectedMuscles.length > 0) {
                                  setNewExercise((prev) => ({
                                    ...prev,
                                    muscleGroup: selectedMuscles[0],
                                  }));
                                }
                                setShowNewExerciseModal(true);
                              }}
                              className="w-full sm:w-auto px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
                              title="Create new exercise"
                            >
                              <FaPlusCircle className="mr-2 sm:mr-0" />
                              <span className="sm:hidden">
                                Create New Exercise
                              </span>
                            </button>
                          </div>
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
                                  exerciseInfo.difficulty === "beginner"
                                    ? "bg-green-900/30 text-green-400"
                                    : exerciseInfo.difficulty === "intermediate"
                                    ? "bg-yellow-900/30 text-yellow-400"
                                    : "bg-red-900/30 text-red-400"
                                }`}
                              >
                                {exerciseInfo.difficulty}
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="font-medium text-yellow-400 mr-2">
                                Target:
                              </span>
                              <span className="capitalize">
                                {exerciseInfo.muscleGroup}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Sets, Reps, Weight */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Sets*
                            </label>
                            <input
                              type="number"
                              {...exerciseForm.register(
                                `exercises.${index}.sets` as const,
                                { valueAsNumber: true }
                              )}
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
                              {...exerciseForm.register(
                                `exercises.${index}.reps` as const,
                                { valueAsNumber: true }
                              )}
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
                              {...exerciseForm.register(
                                `exercises.${index}.weight` as const,
                                { valueAsNumber: true }
                              )}
                              min="0"
                              step="0.5"
                              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                          </div>
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

                {/* Muscle Group Distribution */}
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
                        <div className="text-sm text-gray-400">
                          Total Groups
                        </div>
                        <div className="text-xl font-bold text-blue-400">
                          {Object.keys(currentMuscleGroups).length}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
            )}
          </div>
        )}

        {/* New Exercise Modal */}
        {showNewExerciseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-500">
                  Create New Exercise
                </h3>
                <button
                  onClick={() => setShowNewExerciseModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exercise Name*
                  </label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) =>
                      setNewExercise((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Custom Push-up Variation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Muscle Group*
                  </label>
                  <select
                    value={newExercise.muscleGroup}
                    onChange={(e) =>
                      setNewExercise((prev) => ({
                        ...prev,
                        muscleGroup: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select muscle group</option>
                    {muscleGroups.map((muscle) => (
                      <option key={muscle} value={muscle}>
                        {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newExercise.difficulty}
                    onChange={(e) =>
                      setNewExercise((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newExercise.description}
                    onChange={(e) =>
                      setNewExercise((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Brief description of the exercise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={newExercise.instructions}
                    onChange={(e) =>
                      setNewExercise((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={3}
                    placeholder="How to perform the exercise..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewExerciseModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewExercise}
                  disabled={
                    isCreatingExercise ||
                    !newExercise.name ||
                    !newExercise.muscleGroup
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isCreatingExercise ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Exercise"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
