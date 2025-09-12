"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlay,
  FaHistory,
  FaUser,
  FaClock,
  FaDumbbell,
} from "react-icons/fa";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  muscleGroup?: string;
};

type WorkoutDetail = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastPerformed?: string;
  exercises: Exercise[];
  userId: string;
  userName: string;
  isPublic: boolean;
  completions: number;
};

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    // In a real app, fetch workout details from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      // Mock data for the specific workout
      setWorkout({
        id: params.id,
        name: "Upper Body Power",
        description:
          "A comprehensive upper body workout focusing on strength and hypertrophy. Targets chest, shoulders, back, and arms.",
        createdAt: "2025-08-15",
        lastPerformed: "2025-09-05",
        exercises: [
          {
            id: "1",
            name: "Bench Press",
            sets: 4,
            reps: 8,
            weight: 80,
            muscleGroup: "Chest",
          },
          {
            id: "2",
            name: "Shoulder Press",
            sets: 3,
            reps: 10,
            weight: 60,
            muscleGroup: "Shoulders",
          },
          { id: "3", name: "Pull-up", sets: 3, reps: 8, muscleGroup: "Back" },
          {
            id: "4",
            name: "Bicep Curl",
            sets: 3,
            reps: 12,
            weight: 15,
            muscleGroup: "Arms",
          },
          {
            id: "5",
            name: "Tricep Extension",
            sets: 3,
            reps: 12,
            weight: 25,
            muscleGroup: "Arms",
          },
          {
            id: "6",
            name: "Dumbbell Fly",
            sets: 3,
            reps: 15,
            weight: 12,
            muscleGroup: "Chest",
          },
        ],
        userId: "user123",
        userName: "John Doe",
        isPublic: true,
        completions: 8,
      });

      setIsLoading(false);
    }, 500);
  }, [params.id]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Estimate workout duration based on exercises
  const estimateWorkoutDuration = () => {
    if (!workout) return "0 mins";

    // A very simple estimation: 2 minutes per set plus 1 minute rest between exercises
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const minutes = totalSets * 2 + workout.exercises.length - 1;

    return `${minutes} mins`;
  };

  // Group exercises by muscle group
  const exercisesByMuscleGroup =
    workout?.exercises.reduce((acc, exercise) => {
      const muscleGroup = exercise.muscleGroup || "Other";
      if (!acc[muscleGroup]) {
        acc[muscleGroup] = [];
      }
      acc[muscleGroup].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>) || {};

  // Handle workout deletion
  const handleDeleteWorkout = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      // In a real app, send a delete request to the API
      // For now, we'll just simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to the workouts page
      router.push("/workouts");
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Workout not found
          </h3>
          <p className="text-gray-500 mb-6">
            The workout you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link
            href="/workouts"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Workouts</span>
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
              {workout.description && (
                <p className="text-gray-600 mb-4">{workout.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  <span>Created by: {workout.userName}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>Est. time: {estimateWorkoutDuration()}</span>
                </div>
                <div className="flex items-center">
                  <FaDumbbell className="mr-1" />
                  <span>{workout.exercises.length} exercises</span>
                </div>
                <div className="flex items-center">
                  <FaHistory className="mr-1" />
                  <span>Completed {workout.completions} times</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/workouts/edit/${workout.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center"
              >
                <FaEdit className="mr-2" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDeleteWorkout}
                className={`${
                  deleteConfirm
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                } py-2 px-4 rounded-md flex items-center`}
              >
                <FaTrash
                  className={`mr-2 ${deleteConfirm ? "text-white" : ""}`}
                />
                <span className={deleteConfirm ? "text-white" : ""}>
                  {deleteConfirm ? "Confirm Delete" : "Delete"}
                </span>
              </button>
              <Link
                href={`/workouts/start/${workout.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <FaPlay className="mr-2" />
                <span>Start Workout</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>

            {Object.entries(exercisesByMuscleGroup).map(
              ([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="mb-6">
                  <h3 className="font-medium text-lg mb-3">{muscleGroup}</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Exercise
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sets
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reps
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {exercises.map((exercise) => (
                          <tr key={exercise.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {exercise.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exercise.sets}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exercise.reps}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exercise.weight ? `${exercise.weight} kg` : "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {exercise.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>Created: {formatDate(workout.createdAt)}</p>
                {workout.lastPerformed && (
                  <p>Last performed: {formatDate(workout.lastPerformed)}</p>
                )}
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">
                  {workout.isPublic ? "Public" : "Private"} Workout
                </span>
                <span
                  className={`inline-flex rounded-full h-3 w-3 ${
                    workout.isPublic ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
