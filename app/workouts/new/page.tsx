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
} from "react-icons/fa";

// Validation schema
const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
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

type Exercise = {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
};

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      exercises: [{ exerciseId: "", sets: 3, reps: 10, weight: 0, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  useEffect(() => {
    // In a real app, fetch exercises from the API
    // For now, we'll use mock data
    setIsLoading(true);
    setTimeout(() => {
      setExercises([
        { id: "1", name: "Bench Press", muscleGroup: "Chest" },
        { id: "2", name: "Squat", muscleGroup: "Legs" },
        { id: "3", name: "Deadlift", muscleGroup: "Back" },
        { id: "4", name: "Pull-up", muscleGroup: "Back" },
        { id: "5", name: "Push-up", muscleGroup: "Chest" },
        { id: "6", name: "Shoulder Press", muscleGroup: "Shoulders" },
        { id: "7", name: "Bicep Curl", muscleGroup: "Arms" },
        { id: "8", name: "Tricep Extension", muscleGroup: "Arms" },
        { id: "9", name: "Leg Press", muscleGroup: "Legs" },
        { id: "10", name: "Lat Pulldown", muscleGroup: "Back" },
        { id: "11", name: "Leg Curl", muscleGroup: "Legs" },
        { id: "12", name: "Leg Extension", muscleGroup: "Legs" },
        { id: "13", name: "Dumbbell Fly", muscleGroup: "Chest" },
        { id: "14", name: "Plank", muscleGroup: "Core" },
        { id: "15", name: "Russian Twist", muscleGroup: "Core" },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const onSubmit = async (data: WorkoutFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, send the data to the API
      console.log("Form data:", data);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Workouts</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Workout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Workout Name*
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Upper Body Power"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your workout..."
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                {...register("isPublic")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700"
              >
                Make this workout public
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Public workouts can be viewed and copied by other users
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Exercises</h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-md p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Exercise {index + 1}</h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exercise*
                        </label>
                        <select
                          {...register(
                            `exercises.${index}.exerciseId` as const
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select an exercise</option>
                          {Object.entries(exercisesByMuscleGroup).map(
                            ([muscleGroup, exercises]) => (
                              <optgroup key={muscleGroup} label={muscleGroup}>
                                {exercises.map((exercise) => (
                                  <option key={exercise.id} value={exercise.id}>
                                    {exercise.name}
                                  </option>
                                ))}
                              </optgroup>
                            )
                          )}
                        </select>
                        {errors.exercises?.[index]?.exerciseId && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.exercises[index]?.exerciseId?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sets*
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.sets` as const, {
                            valueAsNumber: true,
                          })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.exercises?.[index]?.sets && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.exercises[index]?.sets?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reps*
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.reps` as const, {
                            valueAsNumber: true,
                          })}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.exercises?.[index]?.reps && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.exercises[index]?.reps?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          {...register(`exercises.${index}.weight` as const, {
                            valueAsNumber: true,
                          })}
                          min="0"
                          step="0.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        {...register(`exercises.${index}.notes` as const)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-2" />
                  <span>Add Another Exercise</span>
                </button>
              </div>
            )}

            {errors.exercises && !Array.isArray(errors.exercises) && (
              <p className="mt-2 text-sm text-red-600">
                {errors.exercises.message}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
    </div>
  );
}
