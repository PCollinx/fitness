"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  FaArrowLeft,
  FaPlay,
  FaClock,
  FaDumbbell,
  FaLayerGroup,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number | null;
  order: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  image: string;
  isOwner: boolean;
  author: string;
  exerciseCount: number;
  muscleGroups: string[];
  difficulty: string | null;
  timesCompleted: number;
  createdAt: string;
  exercises: WorkoutExercise[];
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const workoutId = params.id as string;

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/workouts/${workoutId}`);

        if (!response.ok) {
          throw new Error("Failed to load workout");
        }

        const data = await response.json();
        setWorkout(data);
      } catch (err) {
        console.error("Error loading workout:", err);
        setError("Failed to load workout. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId]);

  const handleStartWorkout = () => {
    if (workout) {
      router.push(`/workouts/${workout.id}/session`);
    }
  };

  const handleBack = () => {
    router.push("/workouts");
  };

  const handleEditWorkout = () => {
    router.push(`/workouts/${workout?.id}/edit`);
  };

  const handleDeleteWorkout = async () => {
    if (!workout || !workout.isOwner) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }
      
      router.push('/workouts');
    } catch (err) {
      console.error('Error deleting workout:', err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-800 rounded-lg mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-black text-white p-6 mt-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-yellow-400 hover:text-yellow-300 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Workouts
          </button>
          <div className="text-center py-16">
            <FaDumbbell className="text-gray-600 h-16 w-16 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-3">
              {error || "Workout Not Found"}
            </h2>
            <p className="text-gray-300 mb-8">
              The workout you're looking for could not be loaded.
            </p>
            <button
              onClick={handleBack}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-medium transition"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estimatedDuration = workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets * 2;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white mt-8">
      <div className="bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-yellow-400 hover:text-yellow-300 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Workouts
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
              <Image
                src={workout.image}
                alt={workout.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {workout.name}
              </h1>

              <p className="text-gray-300 text-lg mb-6">
                {workout.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <FaDumbbell className="mr-2" />
                    <span className="text-sm">Exercises</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {workout.exerciseCount}
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center text-yellow-400 mb-2">
                    <FaClock className="mr-2" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ~{estimatedDuration}m
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-yellow-400 mb-3">
                  <FaLayerGroup className="mr-2" />
                  <span className="text-sm font-medium">Target Muscles</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workout.muscleGroups.map((muscle) => (
                    <span
                      key={muscle}
                      className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium capitalize"
                    >
                      {muscle.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Created by {workout.author} • Completed {workout.timesCompleted}{" "}
                times
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleStartWorkout}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
                >
                  <FaPlay className="mr-3" />
                  Start Workout
                </button>

                {workout.isOwner && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditWorkout}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center transition"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center transition"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Exercises</h2>

          <div className="space-y-4">
            {workout.exercises
              .sort((a, b) => a.order - b.order)
              .map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {exercise.name}
                        </h3>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 capitalize">
                        {exercise.muscleGroup.replace("_", " ")} • Target muscle
                        group
                      </p>

                      <div className="flex items-center space-x-6">
                        <div className="text-yellow-400">
                          <span className="font-bold">{exercise.sets}</span>
                          <span className="text-gray-300 ml-1">sets</span>
                        </div>

                        <div className="text-yellow-400">
                          <span className="font-bold">{exercise.reps}</span>
                          <span className="text-gray-300 ml-1">reps</span>
                        </div>

                        {exercise.weight && (
                          <div className="text-yellow-400">
                            <span className="font-bold">{exercise.weight}</span>
                            <span className="text-gray-300 ml-1">lbs</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-400 mb-4">
              <FaExclamationTriangle className="mr-3 text-xl" />
              <h3 className="text-lg font-bold">Delete Workout</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{workout?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkout}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}