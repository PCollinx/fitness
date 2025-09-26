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
  deleteWorkout,
  canDeleteWorkout,
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

type SessionStats = {
  totalSessions: number;
  completionRate: number;
  totalCompletedSets: number;
  totalSets: number;
  lastPerformed?: string;
};

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  // Fetch session statistics from API
  const fetchSessionStats = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/sessions`);
      if (response.ok) {
        const data = await response.json();
        // The API returns stats in a nested structure
        if (data.stats) {
          setSessionStats({
            totalSessions: data.stats.totalSessions || 0,
            completionRate: data.stats.completionRate || 0,
            totalCompletedSets: data.stats.totalCompletedSets || 0,
            totalSets: data.stats.totalSets || 0,
            lastPerformed: data.stats.lastPerformed || undefined,
          });
        } else {
          setSessionStats({
            totalSessions: 0,
            completionRate: 0,
            totalCompletedSets: 0,
            totalSets: 0,
            lastPerformed: undefined,
          });
        }
      } else {
        console.log("No session stats available yet");
        setSessionStats({
          totalSessions: 0,
          completionRate: 0,
          totalCompletedSets: 0,
          totalSets: 0,
          lastPerformed: undefined,
        });
      }
    } catch (error) {
      console.error("Failed to fetch session stats:", error);
      setSessionStats({
        totalSessions: 0,
        completionRate: 0,
        totalCompletedSets: 0,
        totalSets: 0,
        lastPerformed: undefined,
      });
    }
  };

  useEffect(() => {
    // Load workout from storage
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

      // Fetch session statistics
      fetchSessionStats(params.id);

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
    if (!workout || !canDeleteWorkout(workout.id)) {
      console.warn("Cannot delete this workout - it may be a default workout");
      return;
    }

    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setIsLoading(true);

      // Delete the workout from localStorage
      const success = deleteWorkout(workout.id);

      if (success) {
        // Add a small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Redirect to the workouts page
        router.push("/workouts");
      } else {
        console.error("Failed to delete workout");
        setDeleteConfirm(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      setDeleteConfirm(false);
      setIsLoading(false);
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
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pb-8 max-w-4xl fade-in">
        <div className="mb-4 sm:mb-6 flex items-center">
          <button
            onClick={() => router.push("/workouts")}
            className="text-yellow-500 hover:text-yellow-400 flex items-center transition-all text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2 text-xs sm:text-sm" />
            <span className="inline">Back to Workouts</span>
          </button>
        </div>

        {/* Workout Header */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl mb-4 sm:mb-6 transition-all scale-in">
          <div className="relative h-40 xs:h-48 sm:h-56 md:h-64 lg:h-72">
            <img
              src={workout.image}
              alt={workout.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format";
              }}
            />
            {/* Strong gradient overlay focused on text area */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            {/* Additional solid overlay for extra contrast */}
            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
          </div>
          {/* Text container with background for maximum readability */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="bg-gradient-to-t from-black/75 via-black/65 to-transparent p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span className="bg-yellow-500 text-gray-900 text-xs sm:text-sm font-black px-3 py-1.5 rounded-full capitalize shadow-xl border-2 border-yellow-400">
                  {workout.category}
                </span>
                {workout.isDefault && (
                  <span className="bg-white/95 backdrop-blur text-gray-900 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-xl border-2 border-gray-300">
                    Default
                  </span>
                )}
                <span className="bg-black/90 backdrop-blur text-yellow-400 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full flex items-center shadow-xl border-2 border-yellow-500/30">
                  <FaStar className="mr-1 text-xs" /> {workout.rating}
                </span>
              </div>
              <h1
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 leading-tight"
                style={{
                  textShadow:
                    "0 0 10px rgba(0,0,0,1), 2px 2px 8px rgba(0,0,0,0.9), -1px -1px 4px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                }}
              >
                {workout.name}
              </h1>
              {workout.description && (
                <p
                  className="text-xs xs:text-sm sm:text-base text-white mb-0 sm:mb-2 max-w-3xl leading-relaxed line-clamp-3 sm:line-clamp-none font-medium"
                  style={{
                    textShadow:
                      "0 0 8px rgba(0,0,0,1), 1px 1px 6px rgba(0,0,0,0.9)",
                    WebkitTextStroke: "0.5px rgba(0,0,0,0.4)",
                  }}
                >
                  {workout.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Workout Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-8 slide-up">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-all">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-500/20 p-2 sm:p-2.5 mr-2 sm:mr-3 flex-shrink-0">
                <FaClock className="text-yellow-500 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  Duration
                </p>
                <p className="text-white font-bold text-sm xs:text-base sm:text-lg truncate">
                  {estimateWorkoutDuration()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-all">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-500/20 p-2 sm:p-2.5 mr-2 sm:mr-3 flex-shrink-0">
                <FaDumbbell className="text-yellow-500 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  Exercises
                </p>
                <p className="text-white font-bold text-sm xs:text-base sm:text-lg truncate">
                  {workout.exercises.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-all">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-500/20 p-2 sm:p-2.5 mr-2 sm:mr-3 flex-shrink-0">
                <FaHistory className="text-yellow-500 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  Sessions
                </p>
                <p className="text-white font-bold text-sm xs:text-base sm:text-lg truncate">
                  {sessionStats?.totalSessions ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 transition-all">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-500/20 p-2 sm:p-2.5 mr-2 sm:mr-3 flex-shrink-0">
                <FaWeightHanging className="text-yellow-500 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  Completed Sets
                </p>
                <p className="text-white font-bold text-sm xs:text-base sm:text-lg truncate">
                  {`${sessionStats?.totalCompletedSets ?? 0}/${
                    sessionStats?.totalSets ?? 0
                  }`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8 slide-in-right">
          <Link
            href={`/workouts/start/${workout.id}`}
            className="w-full sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center font-semibold transition-all text-sm sm:text-base"
          >
            <FaPlay className="mr-2 text-xs sm:text-sm" />
            <span>Start Workout</span>
          </Link>

          {!workout.isDefault && (
            <>
              <Link
                href={`/workouts/edit/${workout.id}`}
                className="w-full sm:flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-all text-sm sm:text-base"
              >
                <FaEdit className="mr-2 text-xs sm:text-sm" />
                <span className="inline">Edit Workout</span>
              </Link>

              <button
                onClick={handleDeleteWorkout}
                disabled={isLoading}
                className={`w-full sm:flex-1 py-3 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  deleteConfirm
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                <FaTrash className="mr-2 text-xs sm:text-sm" />
                <span className="inline">
                  {deleteConfirm ? "Confirm Delete" : "Delete Workout"}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Session Statistics */}
        {sessionStats && sessionStats.totalSessions > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 slide-up border border-gray-700">
            <div className="flex items-center mb-4">
              <FaHistory className="text-yellow-500 mr-2 sm:mr-3" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Workout Progress
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
                  {sessionStats?.completionRate ?? 0}%
                </p>
                <p className="text-gray-400 text-sm">Completion Rate</p>
              </div>

              {sessionStats?.lastPerformed && (
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {new Date(sessionStats.lastPerformed).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">Last Performed</p>
                </div>
              )}

              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-bold text-white">
                  {sessionStats?.totalCompletedSets ?? 0} Sets
                </p>
                <p className="text-gray-400 text-sm">Total Completed</p>
              </div>
            </div>
          </div>
        )}

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
                        className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 cursor-pointer transition-all active:scale-95"
                        onClick={() => openExerciseModal(exercise)}
                      >
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm sm:text-base lg:text-lg truncate">
                              {exercise.name}
                            </h4>
                          </div>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                            <div className="bg-gray-700 rounded px-2 sm:px-2.5 py-1 flex items-center text-xs sm:text-sm">
                              <FaLayerGroup className="text-yellow-500 mr-1 text-xs" />
                              <span className="text-gray-200 font-medium">
                                {exercise.sets}
                              </span>
                            </div>

                            <div className="bg-gray-700 rounded px-2 sm:px-2.5 py-1 flex items-center text-xs sm:text-sm">
                              <FaClipboardList className="text-yellow-500 mr-1 text-xs" />
                              <span className="text-gray-200 font-medium">
                                {exercise.reps}
                              </span>
                            </div>

                            {exercise.weight && (
                              <div className="bg-gray-700 rounded px-2 sm:px-2.5 py-1 flex items-center text-xs sm:text-sm">
                                <FaWeightHanging className="text-yellow-500 mr-1 text-xs" />
                                <span className="text-gray-200 font-medium">
                                  {exercise.weight}kg
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {exercise.notes && (
                          <div className="mt-2 text-gray-400 text-xs sm:text-sm">
                            <div className="flex items-start">
                              <FaInfoCircle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0 text-xs" />
                              <span className="leading-relaxed">
                                {exercise.notes}
                              </span>
                            </div>
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
          <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/80 backdrop-blur-sm fade-in"
            onClick={closeModal}
          >
            <div
              className="bg-gray-800 rounded-t-xl sm:rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg mx-auto overflow-hidden border-t sm:border border-gray-700 scale-in mb-16 sm:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-white pr-4 truncate">
                  {selectedExercise.name}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-all p-1 rounded-full hover:bg-gray-700"
                >
                  <FaTimes className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 max-h-[60vh] sm:max-h-none overflow-y-auto">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-700 p-3 sm:p-3 rounded-lg text-center">
                    <div className="text-yellow-500 flex justify-center mb-1.5">
                      <FaLayerGroup className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-1">
                      Sets
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {selectedExercise.sets}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-3 sm:p-3 rounded-lg text-center">
                    <div className="text-yellow-500 flex justify-center mb-1.5">
                      <FaClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-1">
                      Reps
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {selectedExercise.reps}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-3 sm:p-3 rounded-lg text-center">
                    <div className="text-yellow-500 flex justify-center mb-1.5">
                      <FaWeightHanging className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-1">
                      Weight
                    </div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {selectedExercise.weight
                        ? `${selectedExercise.weight}kg`
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-2">
                    Muscle Group
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-white text-sm sm:text-base">
                    {selectedExercise.muscleGroup || "Not specified"}
                  </div>
                </div>

                {selectedExercise.notes && (
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-2">
                      Notes
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg text-gray-200 text-sm sm:text-sm leading-relaxed">
                      {selectedExercise.notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-700 bg-gray-850 safe-area-pb">
                <button
                  onClick={closeModal}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-4 rounded-lg transition-all text-sm sm:text-base font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
