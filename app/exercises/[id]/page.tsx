"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

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

export default function ExerciseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          id: "3",
          name: "Deadlift",
          muscleGroup: "Back",
          difficulty: "Advanced",
          equipment: "Barbell",
          isCustom: false,
          description:
            "A compound exercise that targets the lower back, hamstrings, and glutes.",
          instructions:
            "1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Bend at the hips and knees, keeping back straight.\n3. Grip the barbell with hands just outside your legs.\n4. Lift the bar by extending hips and knees.\n5. Keep the bar close to your body throughout the movement.\n6. At the top, stand tall with shoulders back.\n7. Return the weight to the floor in a controlled manner.",
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
        setExercise(foundExercise);
      } else {
        // Handle not found
        router.push("/exercises");
      }

      setIsLoading(false);
    }, 500);
  }, [exerciseId, router]);

  const handleDelete = () => {
    // In a real app, you would call your API to delete the exercise
    console.log("Deleting exercise:", exerciseId);

    // Simulate API call
    setTimeout(() => {
      router.push("/exercises");
      router.refresh();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Exercise not found
          </h3>
          <Link
            href="/exercises"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Exercise Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/exercises"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Exercise Library</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exercise.name}</h1>
            {exercise.isCustom && (
              <span className="inline-block px-2 py-1 bg-blue-700 text-xs rounded-full mt-1">
                Custom Exercise
              </span>
            )}
          </div>

          {exercise.isCustom && (
            <div className="flex space-x-2">
              <Link
                href={`/exercises/edit/${exercise.id}`}
                className="inline-flex items-center px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-md text-sm"
              >
                <FaEdit className="mr-1" />
                <span>Edit</span>
              </Link>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm"
              >
                <FaTrash className="mr-1" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Exercise Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Muscle Group</h3>
              <p className="text-lg font-semibold">{exercise.muscleGroup}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Difficulty</h3>
              <p
                className={`text-lg font-semibold ${
                  exercise.difficulty === "Beginner"
                    ? "text-green-600"
                    : exercise.difficulty === "Intermediate"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {exercise.difficulty}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Equipment</h3>
              <p className="text-lg font-semibold">{exercise.equipment}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{exercise.description}</p>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {exercise.instructions?.split("\n").map((step, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {step}
                </p>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <Link
              href={`/workouts/new?addExercise=${exercise.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" />
              <span>Add to Workout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <FaTrash className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">
              Delete Exercise
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete &quot;{exercise.name}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
