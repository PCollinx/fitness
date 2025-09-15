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
  FaCalendarAlt,
  FaLayerGroup,
  FaWeightHanging,
  FaClipboardList,
  FaStar,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import {
  loadWorkouts,
  Workout,
  WorkoutExercise,
} from "../../utils/workoutStorage";

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
  intensity: string;
  category: string;
  rating: number;
  image: string;
  isDefault?: boolean;
  workoutExercises?: WorkoutExercise[];
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  useEffect(() => {
    // Load workout from storage or mock data
    setIsLoading(true);

    // Try to find the workout in our storage
    const allWorkouts = loadWorkouts();
    const foundWorkout = allWorkouts.find((w) => w.id === params.id);

    setTimeout(() => {
      if (foundWorkout) {
        // Convert the stored workout to our WorkoutDetail type
        const exercises = foundWorkout.workoutExercises
          ? foundWorkout.workoutExercises.map((ex) => ({
              id: ex.exerciseId,
              name: ex.exerciseName,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              notes: ex.notes,
              muscleGroup: getMuscleGroupForExercise(ex.exerciseName),
            }))
          : mockExercises;

        setWorkout({
          ...foundWorkout,
          exercises,
          userId: "user123",
          userName: foundWorkout.isDefault ? "MyTrainer" : "You",
          completions: foundWorkout.isDefault ? 128 : 0,
        });
      } else {
        // Fallback to mock data if not found
        setWorkout({
          id: params.id,
          name: "Upper Body Power",
          description:
            "A comprehensive upper body workout focusing on strength and hypertrophy. Targets chest, shoulders, back, and arms.",
          createdAt: "2025-08-15",
          lastPerformed: "2025-09-05",
          exercises: mockExercises,
          userId: "user123",
          userName: "John Doe",
          isPublic: true,
          completions: 8,
          intensity: "High",
          category: "strength",
          rating: 4.7,
          image: "https://source.unsplash.com/random/400x300/?workout,gym",
        });
      }

      setIsLoading(false);
    }, 500);
  }, [params.id]);

  // Mock exercises for fallback
  const mockExercises = [
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
    {
      id: "3",
      name: "Pull-up",
      sets: 3,
      reps: 8,
      muscleGroup: "Back",
    },
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
  ];

  // Helper function to determine muscle group from exercise name
  const getMuscleGroupForExercise = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("bench") ||
      lowerName.includes("chest") ||
      lowerName.includes("fly")
    )
      return "Chest";
    if (
      lowerName.includes("shoulder") ||
      lowerName.includes("press") ||
      lowerName.includes("delt")
    )
      return "Shoulders";
    if (
      lowerName.includes("back") ||
      lowerName.includes("row") ||
      lowerName.includes("pull")
    )
      return "Back";
    if (
      lowerName.includes("bicep") ||
      lowerName.includes("curl") ||
      lowerName.includes("arm")
    )
      return "Arms";
    if (lowerName.includes("tricep") || lowerName.includes("extension"))
      return "Arms";
    if (
      lowerName.includes("leg") ||
      lowerName.includes("squat") ||
      lowerName.includes("lunge")
    )
      return "Legs";
    if (
      lowerName.includes("abs") ||
      lowerName.includes("core") ||
      lowerName.includes("plank")
    )
      return "Core";
    return "Other";
  };

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

  // Open exercise detail modal
  const openExerciseModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  // Close exercise detail modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedExercise(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <FaDumbbell className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Workout not found
          </h3>
          <p className="text-gray-300 mb-6">
            The workout you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link
            href="/workouts"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Workouts</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-4 sm:mt-16 fade-in">
      <div className="mb-4 sm:mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="text-yellow-500 hover:text-yellow-400 flex items-center transition-all"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Workouts</span>
        </button>
      </div>

      {/* Workout Header */}
      <div className="relative overflow-hidden rounded-xl mb-4 sm:mb-6 transition-all scale-in">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900"></div>
        <div className="relative h-36 sm:h-48 md:h-64 lg:h-80">
          <img
            src={workout.image}
            alt={workout.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
            <span className="bg-yellow-500 text-gray-900 text-xs font-medium px-2 py-1 rounded capitalize">
              {workout.category}
            </span>
            {workout.isDefault && (
              <span className="bg-gray-700 text-gray-200 text-xs font-medium px-2 py-1 rounded">
                Default
              </span>
            )}
            <span className="bg-gray-800/80 text-yellow-500 text-xs font-medium px-2 py-1 rounded flex items-center">
              <FaStar className="mr-1" /> {workout.rating}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            {workout.name}
          </h1>
          {workout.description && (
            <p className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-4 max-w-3xl">
              {workout.description}
            </p>
          )}
        </div>
      </div>

      {/* Workout Info Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8 slide-up">
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-500/20 p-2 sm:p-3 mr-3 sm:mr-4">
              <FaClock className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Duration</p>
              <p className="text-white font-bold text-base sm:text-lg">
                {estimateWorkoutDuration()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-500/20 p-2 sm:p-3 mr-3 sm:mr-4">
              <FaDumbbell className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Exercises</p>
              <p className="text-white font-bold text-base sm:text-lg">
                {workout.exercises.length} exercises
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-500/20 p-2 sm:p-3 mr-3 sm:mr-4">
              <FaHistory className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Completions</p>
              <p className="text-white font-bold text-base sm:text-lg">
                {workout.completions} times
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-500/20 p-2 sm:p-3 mr-3 sm:mr-4">
              <FaUser className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Created by</p>
              <p className="text-white font-bold text-base sm:text-lg">
                {workout.userName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mb-4 sm:mb-8 slide-in-right">
        <Link
          href={`/workouts/start/${workout.id}`}
          className="w-full xs:flex-1 md:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center font-semibold transition-all"
        >
          <FaPlay className="mr-2" />
          <span>Start Workout</span>
        </Link>

        {!workout.isDefault && (
          <>
            <Link
              href={`/workouts/edit/${workout.id}`}
              className="w-full xs:flex-1 md:w-auto bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-all"
            >
              <FaEdit className="mr-2" />
              <span>Edit</span>
            </Link>

            <button
              onClick={handleDeleteWorkout}
              className={`w-full xs:flex-1 md:w-auto py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-all ${
                deleteConfirm
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <FaTrash className="mr-2" />
              <span>{deleteConfirm ? "Confirm Delete" : "Delete"}</span>
            </button>
          </>
        )}
      </div>

      {/* Exercises Section */}
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 slide-up">
        <div className="p-3 sm:p-5 border-b border-gray-800 flex items-center">
          <FaClipboardList className="text-yellow-500 mr-2 sm:mr-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Workout Exercises
          </h2>
        </div>

        <div className="p-3 sm:p-5">
          {Object.entries(exercisesByMuscleGroup).map(
            ([muscleGroup, exercises]) => (
              <div key={muscleGroup} className="mb-6 sm:mb-8 last:mb-0">
                <h3 className="font-semibold text-yellow-500 mb-2 sm:mb-4 flex items-center">
                  <FaLayerGroup className="mr-2" /> {muscleGroup}
                </h3>

                <div className="grid gap-2 sm:gap-4">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 cursor-pointer transition-all"
                      onClick={() => openExerciseModal(exercise)}
                    >
                      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center">
                        <div className="w-full sm:w-auto mb-2 sm:mb-0">
                          <h4 className="text-white font-medium text-base sm:text-lg">
                            {exercise.name}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                          <div className="bg-gray-700 rounded-lg px-2 sm:px-3 py-1 flex items-center text-sm">
                            <FaLayerGroup className="text-yellow-500 mr-1 sm:mr-2" />
                            <span className="text-gray-200">
                              {exercise.sets} sets
                            </span>
                          </div>

                          <div className="bg-gray-700 rounded-lg px-2 sm:px-3 py-1 flex items-center text-sm">
                            <FaClipboardList className="text-yellow-500 mr-1 sm:mr-2" />
                            <span className="text-gray-200">
                              {exercise.reps} reps
                            </span>
                          </div>

                          {exercise.weight && (
                            <div className="bg-gray-700 rounded-lg px-2 sm:px-3 py-1 flex items-center text-sm">
                              <FaWeightHanging className="text-yellow-500 mr-1 sm:mr-2" />
                              <span className="text-gray-200">
                                {exercise.weight} kg
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {exercise.notes && (
                        <div className="mt-2 sm:mt-3 text-gray-400 text-xs sm:text-sm">
                          <span className="flex items-start">
                            <FaInfoCircle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                            {exercise.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="bg-gray-800 p-3 sm:p-5 border-t border-gray-700">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-400">
              <div className="flex items-center">
                <FaCalendarAlt className="text-yellow-500 mr-2" />
                <p>Created: {formatDate(workout.createdAt)}</p>
              </div>
              {workout.lastPerformed && (
                <div className="flex items-center mt-1">
                  <FaHistory className="text-yellow-500 mr-2" />
                  <p>Last performed: {formatDate(workout.lastPerformed)}</p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-xs sm:text-sm text-gray-300">
                {workout.isPublic ? "Public" : "Private"} Workout
              </span>
              <span
                className={`inline-flex rounded-full h-2 sm:h-3 w-2 sm:w-3 ${
                  workout.isPublic ? "bg-yellow-500" : "bg-gray-500"
                }`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {modalOpen && selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 fade-in">
          <div
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg mx-auto overflow-hidden border border-gray-700 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 sm:p-5 border-b border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {selectedExercise.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 sm:p-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-700 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-yellow-500 flex justify-center mb-1">
                    <FaLayerGroup className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Sets</div>
                  <div className="text-white font-bold text-sm sm:text-base">
                    {selectedExercise.sets}
                  </div>
                </div>

                <div className="bg-gray-700 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-yellow-500 flex justify-center mb-1">
                    <FaClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Reps</div>
                  <div className="text-white font-bold text-sm sm:text-base">
                    {selectedExercise.reps}
                  </div>
                </div>

                <div className="bg-gray-700 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-yellow-500 flex justify-center mb-1">
                    <FaWeightHanging className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Weight</div>
                  <div className="text-white font-bold text-sm sm:text-base">
                    {selectedExercise.weight
                      ? `${selectedExercise.weight} kg`
                      : "-"}
                  </div>
                </div>
              </div>

              <div className="mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-gray-400 mb-1">
                  Muscle Group
                </div>
                <div className="bg-gray-700 p-2 sm:p-3 rounded-lg text-white text-sm sm:text-base">
                  {selectedExercise.muscleGroup || "Not specified"}
                </div>
              </div>

              {selectedExercise.notes && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">
                    Notes
                  </div>
                  <div className="bg-gray-700 p-2 sm:p-3 rounded-lg text-gray-200 text-xs sm:text-sm">
                    {selectedExercise.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-5 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
