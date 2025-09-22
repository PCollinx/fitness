"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheck,
  FaStopwatch,
  FaDumbbell,
  FaPlay,
  FaPause,
  FaStop,
  FaRedo,
  FaHistory,
  FaTimes,
  FaPlus,
  FaMinus,
  FaClock,
  FaLayerGroup,
  FaWeightHanging,
} from "react-icons/fa";
import {
  getWorkoutById,
  type Workout,
  type WorkoutExercise,
} from "../../../utils/workoutStorage";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  muscleGroup?: string;
};

type WorkoutSession = {
  id: string;
  name: string;
  exercises: Exercise[];
};

type SetTracker = {
  completed: boolean;
  actualReps?: number;
  actualWeight?: number;
  notes?: string;
};

export default function WorkoutSessionPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Track the progress of each set for each exercise
  const [setTrackers, setSetTrackers] = useState<Record<string, SetTracker[]>>(
    {}
  );

  useEffect(() => {
    // Load real workout from storage
    setIsLoading(true);

    const loadWorkout = () => {
      const foundWorkout = getWorkoutById(workoutId);

      if (!foundWorkout) {
        router.push("/workouts");
        return;
      }

      setWorkout(foundWorkout);

      // Initialize set trackers based on workout exercises
      const initialSetTrackers: Record<string, SetTracker[]> = {};
      if (foundWorkout.workoutExercises) {
        foundWorkout.workoutExercises.forEach((exercise) => {
          initialSetTrackers[exercise.exerciseId] = Array(exercise.sets)
            .fill(null)
            .map(() => ({
              completed: false,
            }));
        });
      }

      setSetTrackers(initialSetTrackers);
      setIsLoading(false);
    };

    loadWorkout();
  }, [workoutId, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start the workout session
  const startSession = () => {
    setSessionStarted(true);
    setSessionStart(new Date());
    setTimerRunning(true);
  };

  // Toggle the rest timer
  const toggleTimer = () => {
    setTimerRunning((prev) => !prev);
  };

  // Reset the rest timer
  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  // Mark a set as completed
  const toggleSetCompletion = (
    exerciseId: string,
    setIndex: number,
    isCompleted: boolean
  ) => {
    setSetTrackers((prev) => {
      const updated = { ...prev };
      updated[exerciseId][setIndex].completed = isCompleted;
      return updated;
    });

    // If all sets of all exercises are completed, mark the session as completed
    const allCompleted = Object.values(setTrackers).every((exerciseSets) =>
      exerciseSets.every((set) => set.completed)
    );

    if (allCompleted) {
      completeSession();
    }
  };

  // Move to the next exercise
  const nextExercise = () => {
    if (
      workout &&
      workout.workoutExercises &&
      currentExerciseIndex < workout.workoutExercises.length - 1
    ) {
      setCurrentExerciseIndex((prev) => prev + 1);
      resetTimer();
    } else {
      // Show confirmation modal before completing
      setShowCompleteModal(true);
    }
  };

  // Move to the previous exercise
  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  // Handle confirm completion
  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    completeSession();
  };

  // Handle cancel completion
  const handleCancelComplete = () => {
    setShowCompleteModal(false);
  };

  // Complete the workout session
  const completeSession = () => {
    setSessionCompleted(true);
    setTimerRunning(false);
    setElapsedTime(
      Math.floor((new Date().getTime() - (sessionStart?.getTime() || 0)) / 1000)
    );

    // In a real app, send the session data to the API
    console.log("Workout completed:", {
      workoutId: workout?.id,
      startTime: sessionStart,
      endTime: new Date(),
      elapsedTime: Math.floor(
        (new Date().getTime() - (sessionStart?.getTime() || 0)) / 1000
      ),
      exercises: workout?.workoutExercises?.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: setTrackers[exercise.exerciseId],
      })),
    });
  };

  // Get the current exercise
  const currentExercise = workout?.workoutExercises?.[currentExerciseIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pb-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pb-8 max-w-4xl">
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">
              Workout not found
            </h3>
            <p className="text-gray-400 mb-6">
              The workout you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
            <Link
              href="/workouts"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md inline-flex items-center font-medium"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Workouts</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pb-8 max-w-4xl">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500 rounded-full mb-4">
                <FaCheck className="h-12 w-12 text-gray-900" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                Workout Completed!
              </h1>
              <p className="text-xl text-gray-300">
                Great job on completing {workout.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-300">Elapsed Time</h3>
                <p className="text-2xl font-bold text-white">
                  {formatTime(elapsedTime)}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-300">Exercises</h3>
                <p className="text-2xl font-bold text-white">
                  {workout.workoutExercises?.length || 0}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-300">
                  Sets Completed
                </h3>
                <p className="text-2xl font-bold text-white">
                  {Object.values(setTrackers).reduce(
                    (acc, sets) =>
                      acc + sets.filter((set) => set.completed).length,
                    0
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/workouts"
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md flex items-center justify-center border border-gray-600"
              >
                <FaDumbbell className="mr-2" />
                <span>Back to Workouts</span>
              </Link>

              <Link
                href="/progress"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-6 rounded-md flex items-center justify-center font-medium"
              >
                <FaHistory className="mr-2" />
                <span>View Progress</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pb-8 max-w-4xl">
        {!sessionStarted ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="mb-6">
              <Link
                href={`/workouts/${workout.id}`}
                className="text-gray-400 hover:text-white flex items-center transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to Workout Details</span>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4 text-white">
                {workout.name}
              </h1>
              <p className="text-gray-300">
                {workout.workoutExercises?.length || 0} exercises |{" "}
                {workout.workoutExercises?.reduce(
                  (acc, ex) => acc + ex.sets,
                  0
                ) || 0}{" "}
                total sets
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Workout Overview
              </h2>
              <div className="space-y-4">
                {workout.workoutExercises?.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId}
                    className="flex justify-between items-center py-3 border-b border-gray-600 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {exercise.exerciseName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps{" "}
                        {exercise.weight ? `@ ${exercise.weight} kg` : ""}
                      </div>
                    </div>
                    <div className="text-yellow-400 text-sm font-medium">
                      Exercise {index + 1} of{" "}
                      {workout.workoutExercises?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startSession}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-8 rounded-md text-lg font-medium flex items-center justify-center mx-auto transition-colors"
              >
                <FaPlay className="mr-2" />
                <span>Start Workout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">
                  {workout.name}
                </h1>
                <div className="flex items-center bg-gray-700 px-3 py-2 rounded-lg">
                  <FaStopwatch className="mr-2 text-yellow-500" />
                  <span className="text-lg font-medium text-white">
                    {formatTime(
                      Math.floor(
                        (new Date().getTime() -
                          (sessionStart?.getTime() || 0)) /
                          1000
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Exercise {currentExerciseIndex + 1} of{" "}
                    {workout.workoutExercises?.length || 0}
                  </h2>
                  <p className="text-yellow-400 font-medium">
                    Exercise {currentExerciseIndex + 1}
                  </p>
                </div>

                <div className="flex gap-2">
                  {currentExerciseIndex > 0 && (
                    <button
                      onClick={prevExercise}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md border border-gray-600 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={nextExercise}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {currentExerciseIndex ===
                    (workout.workoutExercises?.length || 1) - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {currentExercise?.exerciseName}
                    </h3>
                    {currentExercise?.notes && (
                      <p className="text-gray-300 mt-1">
                        {currentExercise.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Target</div>
                      <div className="font-medium text-yellow-400">
                        {currentExercise?.sets} sets × {currentExercise?.reps}{" "}
                        reps
                      </div>
                    </div>

                    {currentExercise?.weight && (
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Weight</div>
                        <div className="font-medium text-yellow-400">
                          {currentExercise.weight} kg
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h4 className="font-medium mb-4 text-white">Sets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentExercise &&
                      Array.from({ length: currentExercise.sets }).map(
                        (_, setIndex) => {
                          const isCompleted =
                            setTrackers[currentExercise.exerciseId][setIndex]
                              ?.completed;

                          return (
                            <div
                              key={setIndex}
                              className={`border rounded-lg p-4 transition-colors ${
                                isCompleted
                                  ? "border-yellow-500 bg-yellow-500/10"
                                  : "border-gray-600 bg-gray-800"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium text-white">
                                  Set {setIndex + 1}
                                </div>
                                <button
                                  onClick={() =>
                                    toggleSetCompletion(
                                      currentExercise.exerciseId,
                                      setIndex,
                                      !isCompleted
                                    )
                                  }
                                  className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                                    isCompleted
                                      ? "bg-yellow-500 text-gray-900"
                                      : "bg-gray-600 text-gray-400"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <FaCheck size={10} />
                                  ) : (
                                    <FaTimes size={10} />
                                  )}
                                </button>
                              </div>

                              <div className="flex justify-between">
                                <div className="text-sm text-gray-400">
                                  <span className="font-medium text-white">
                                    {currentExercise.reps}
                                  </span>{" "}
                                  reps
                                </div>
                                {currentExercise.weight && (
                                  <div className="text-sm text-gray-400">
                                    <span className="font-medium text-white">
                                      {currentExercise.weight}
                                    </span>{" "}
                                    kg
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-medium mb-4 text-white">Rest Timer</h4>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-4xl font-bold text-yellow-500">
                    {formatTime(timerSeconds)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={toggleTimer}
                      className={`${
                        timerRunning
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-gray-900 py-2 px-4 rounded-md flex items-center font-medium transition-colors`}
                    >
                      {timerRunning ? (
                        <>
                          <FaPause className="mr-2" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <FaPlay className="mr-2" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetTimer}
                      className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center transition-colors"
                    >
                      <FaRedo className="mr-2" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Confirmation Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                  <FaCheck className="h-8 w-8 text-gray-900" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Complete Workout?
                </h3>

                <p className="text-gray-300 mb-6">
                  Are you sure you want to finish this workout? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleCancelComplete}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md border border-gray-600 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmComplete}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Complete Workout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
