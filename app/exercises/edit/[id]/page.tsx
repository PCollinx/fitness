"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  description: z.string().min(1, "Description is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  equipment: z.string().min(1, "Equipment is required"),
  instructions: z.string().min(1, "Instructions are required"),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

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

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  useEffect(() => {
    // In a real app, fetch the exercise from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      // This would be an API call in a real app
      const mockExercises: Exercise[] = [
        {
          id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          difficulty: "Intermediate",
          equipment: "Barbell",
          isCustom: false,
          description:
            "A compound exercise that targets the chest, shoulders, and triceps.",
          instructions:
            "1. Lie on a flat bench with your feet on the floor.\n2. Grip the barbell with hands slightly wider than shoulder-width apart.\n3. Lower the barbell to your mid-chest.\n4. Press the barbell back up to the starting position.\n5. Repeat for the desired number of repetitions.",
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
          instructions:
            "1. Stand with feet shoulder-width apart.\n2. Place the barbell on your upper back.\n3. Bend at the knees and hips to lower yourself down.\n4. Keep your chest up and back straight.\n5. Lower until thighs are parallel to the ground.\n6. Push through your heels to return to the starting position.",
        },
        {
          id: "16",
          name: "My Custom Exercise",
          muscleGroup: "Back",
          difficulty: "Intermediate",
          equipment: "Resistance band",
          isCustom: true,
          description: "A custom exercise created by you.",
          instructions:
            "1. Attach the resistance band to a secure anchor point.\n2. Grip the handles with both hands.\n3. Step back to create tension in the band.\n4. Pull the handles towards your body.\n5. Slowly return to the starting position.\n6. Repeat for the desired number of repetitions.",
        },
      ];

      const foundExercise = mockExercises.find((ex) => ex.id === exerciseId);

      if (foundExercise) {
        reset({
          name: foundExercise.name,
          description: foundExercise.description || "",
          muscleGroup: foundExercise.muscleGroup || "",
          difficulty: foundExercise.difficulty || "",
          equipment: foundExercise.equipment || "",
          instructions: foundExercise.instructions || "",
        });
      } else {
        // Handle not found
        router.push("/exercises");
      }

      setIsLoading(false);
    }, 500);
  }, [exerciseId, router, reset]);

  const onSubmit = async (data: ExerciseFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log("Updated exercise data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to exercise details page
      router.push(`/exercises/${exerciseId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Full Body",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const equipmentOptions = [
    "Body weight",
    "Barbell",
    "Dumbbell",
    "Kettlebell",
    "Machine",
    "Cable",
    "Resistance band",
    "Medicine ball",
    "Suspension trainer",
    "Other",
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/exercises/${exerciseId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Exercise Details</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Edit Exercise</h1>
          <p className="mt-1 text-blue-100">
            Update your custom exercise details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exercise Name */}
            <div className="col-span-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Exercise Name*
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Muscle Group */}
            <div>
              <label
                htmlFor="muscleGroup"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Primary Muscle Group*
              </label>
              <select
                id="muscleGroup"
                {...register("muscleGroup")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select muscle group</option>
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {errors.muscleGroup && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.muscleGroup.message}
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty Level*
              </label>
              <select
                id="difficulty"
                {...register("difficulty")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select difficulty</option>
                {difficulties.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            {/* Equipment */}
            <div className="col-span-full">
              <label
                htmlFor="equipment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Equipment Required*
              </label>
              <select
                id="equipment"
                {...register("equipment")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select equipment</option>
                {equipmentOptions.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment}
                  </option>
                ))}
              </select>
              {errors.equipment && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.equipment.message}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Short Description*
              </label>
              <textarea
                id="description"
                rows={2}
                {...register("description")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Detailed Instructions */}
            <div className="col-span-full">
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Detailed Instructions*
              </label>
              <textarea
                id="instructions"
                rows={6}
                {...register("instructions")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instructions.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Link
              href={`/exercises/${exerciseId}`}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
