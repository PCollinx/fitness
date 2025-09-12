"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheck,
  FaStopwatch,
  FaDumbbell,
  FaPlay,
  FaPause,
  FaRedo,
  FaHistory,
  FaTimes,
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

export default function WorkoutSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  // Track the progress of each set for each exercise
  const [setTrackers, setSetTrackers] = useState<Record<string, SetTracker[]>>(
    {}
  );

  useEffect(() => {
    // In a real app, fetch workout details from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      // Mock data for the specific workout
      const mockWorkout = {
        id: params.id,
        name: "Upper Body Power",
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
      };

      setWorkout(mockWorkout);

      // Initialize set trackers
      const initialSetTrackers: Record<string, SetTracker[]> = {};
      mockWorkout.exercises.forEach((exercise) => {
        initialSetTrackers[exercise.id] = Array(exercise.sets)
          .fill(null)
          .map(() => ({
            completed: false,
          }));
      });

      setSetTrackers(initialSetTrackers);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

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
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      resetTimer();
    } else {
      // Ask for confirmation before completing
      if (window.confirm("Are you sure you want to complete this workout?")) {
        completeSession();
      }
    }
  };

  // Move to the previous exercise
  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
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
      exercises: workout?.exercises.map((exercise) => ({
        exerciseId: exercise.id,
        sets: setTrackers[exercise.id],
      })),
    });
  };

  // Get the current exercise
  const currentExercise = workout?.exercises[currentExerciseIndex];

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

  if (sessionCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaCheck className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Workout Completed!</h1>
            <p className="text-xl text-gray-600">
              Great job on completing {workout.name}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Elapsed Time</h3>
              <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Exercises</h3>
              <p className="text-2xl font-bold">{workout.exercises.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sets Completed</h3>
              <p className="text-2xl font-bold">
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-md flex items-center justify-center"
            >
              <FaDumbbell className="mr-2" />
              <span>Back to Workouts</span>
            </Link>

            <Link
              href="/progress"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center"
            >
              <FaHistory className="mr-2" />
              <span>View Progress</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!sessionStarted ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <Link
              href={`/workouts/${workout.id}`}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Workout Details</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">{workout.name}</h1>
            <p className="text-gray-600">
              {workout.exercises.length} exercises |{" "}
              {workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)} total
              sets
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Workout Overview</h2>
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-500">
                      {exercise.sets} sets × {exercise.reps} reps{" "}
                      {exercise.weight ? `@ ${exercise.weight} kg` : ""}
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Exercise {index + 1} of {workout.exercises.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startSession}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg font-medium flex items-center justify-center mx-auto"
            >
              <FaPlay className="mr-2" />
              <span>Start Workout</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{workout.name}</h1>
              <div className="flex items-center">
                <FaStopwatch className="mr-2 text-gray-600" />
                <span className="text-lg font-medium">
                  {formatTime(
                    Math.floor(
                      (new Date().getTime() - (sessionStart?.getTime() || 0)) /
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
                <h2 className="text-xl font-semibold">
                  Exercise {currentExerciseIndex + 1} of{" "}
                  {workout.exercises.length}
                </h2>
                <p className="text-gray-600">{currentExercise?.muscleGroup}</p>
              </div>

              <div className="flex gap-2">
                {currentExerciseIndex > 0 && (
                  <button
                    onClick={prevExercise}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={nextExercise}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  {currentExerciseIndex === workout.exercises.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {currentExercise?.name}
                  </h3>
                  {currentExercise?.notes && (
                    <p className="text-gray-600 mt-1">
                      {currentExercise.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Target</div>
                    <div className="font-medium">
                      {currentExercise?.sets} sets × {currentExercise?.reps}{" "}
                      reps
                    </div>
                  </div>

                  {currentExercise?.weight && (
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Weight</div>
                      <div className="font-medium">
                        {currentExercise.weight} kg
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4">Sets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentExercise &&
                    Array.from({ length: currentExercise.sets }).map(
                      (_, setIndex) => {
                        const isCompleted =
                          setTrackers[currentExercise.id][setIndex]?.completed;

                        return (
                          <div
                            key={setIndex}
                            className={`border rounded-lg p-4 ${
                              isCompleted
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">
                                Set {setIndex + 1}
                              </div>
                              <button
                                onClick={() =>
                                  toggleSetCompletion(
                                    currentExercise.id,
                                    setIndex,
                                    !isCompleted
                                  )
                                }
                                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                  isCompleted
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200"
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
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">
                                  {currentExercise.reps}
                                </span>{" "}
                                reps
                              </div>
                              {currentExercise.weight && (
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">
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

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium mb-4">Rest Timer</h4>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-4xl font-bold">
                  {formatTime(timerSeconds)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`${
                      timerRunning
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white py-2 px-4 rounded-md flex items-center`}
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
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
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
    </div>
  );
}
