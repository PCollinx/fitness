"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import BackButton from "@/app/components/BackButton";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaCheck,
  FaClock,
  FaDumbbell,
  FaFire,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets?: number;
  reps?: string;
  duration?: number;
  completed?: boolean;
}

interface WorkoutData {
  name: string;
  exercises: Exercise[];
  targetMuscles: string[];
}

function StartWorkoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60); // seconds
  const [restTimer, setRestTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [fallbackRoute, setFallbackRoute] = useState("/workouts");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);

  const isTemp = searchParams.get("temp") === "true";

  useEffect(() => {
    // Check if coming from plan flow
    const from = searchParams.get("from");
    if (from === "plan") {
      setFallbackRoute("/workouts?from=plan&quick=true");
    }

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Load workout data
    if (isTemp) {
      const tempData = sessionStorage.getItem("tempWorkout");
      if (!tempData) {
        router.push("/workouts");
        return;
      }
      try {
        const data = JSON.parse(tempData);
        setWorkoutData(data);
        setWorkoutStartTime(new Date());
      } catch (error) {
        console.error("Error parsing temp workout:", error);
        router.push("/workouts");
      }
    }
  }, [status, isTemp, router]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && isResting && restTimer > 0 && !isWorkoutPaused) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setIsTimerRunning(false);
      setRestTimer(restTime);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, isResting, restTimer, restTime, isWorkoutPaused]);

  const startRestTimer = () => {
    setIsResting(true);
    setIsTimerRunning(true);
    setRestTimer(restTime);
  };

  const skipRest = () => {
    setIsResting(false);
    setIsTimerRunning(false);
    setRestTimer(restTime);
  };

  const completeSet = () => {
    const currentExercise = workoutData?.exercises[currentExerciseIndex];
    if (!currentExercise) return;

    const totalSets = currentExercise.sets || 3;

    if (currentSet < totalSets) {
      // More sets remaining, start rest timer
      setCurrentSet(currentSet + 1);
      startRestTimer();
    } else {
      // Exercise completed, move to next
      setCompletedExercises([...completedExercises, currentExercise.id]);

      if (currentExerciseIndex < (workoutData?.exercises.length || 0) - 1) {
        // Move to next exercise
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        // Workout completed
        completeWorkout();
      }
    }
  };

  const skipExercise = () => {
    if (currentExerciseIndex < (workoutData?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsTimerRunning(false);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsTimerRunning(false);
    }
  };

  const completeWorkout = async () => {
    if (!workoutData || !workoutStartTime) return;

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - workoutStartTime.getTime()) / 1000 / 60
    ); // minutes

    try {
      // Save workout session
      const sessionData = {
        workoutName: workoutData.name,
        targetMuscles: workoutData.targetMuscles,
        exercises: workoutData.exercises.map((exercise) => ({
          exerciseId: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets || 3,
          reps: exercise.reps || "10-12",
          completed: completedExercises.includes(exercise.id),
        })),
        duration,
        completedAt: endTime.toISOString(),
      };

      const response = await fetch("/api/workout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save workout session");
      }

      // Clear temp data
      sessionStorage.removeItem("tempWorkout");

      // Redirect to completed workout page
      router.push("/workouts/history?completed=true");
    } catch (error) {
      console.error("Error saving workout session:", error);
      setError("Failed to save workout. Please try again.");
    }
  };

  const endWorkout = () => {
    if (
      confirm(
        "Are you sure you want to end this workout? Your progress will be saved."
      )
    ) {
      completeWorkout();
    }
  };

  const cancelWorkout = () => {
    setShowCancelModal(true);
  };

  const confirmCancelWorkout = () => {
    // Clear any temp data
    sessionStorage.removeItem("tempWorkout");
    // Navigate back without saving progress
    router.push(fallbackRoute);
  };

  const toggleWorkoutPause = () => {
    if (isWorkoutPaused) {
      // Resume workout - add pause duration to total paused time
      if (pauseStartTime) {
        setPausedTime(prev => prev + (new Date().getTime() - pauseStartTime.getTime()));
      }
      setPauseStartTime(null);
    } else {
      // Pause workout - record when pause started
      setPauseStartTime(new Date());
    }
    setIsWorkoutPaused(!isWorkoutPaused);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workoutData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No workout data found</p>
          <BackButton fallbackRoute={fallbackRoute} />
        </div>
      </div>
    );
  }

  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const progress =
    ((currentExerciseIndex + (currentSet - 1) / (currentExercise?.sets || 1)) /
      workoutData.exercises.length) *
    100;
  const workoutTime = workoutStartTime
    ? Math.floor(
        (new Date().getTime() - workoutStartTime.getTime() - pausedTime) / 1000 / 60
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <BackButton fallbackRoute={fallbackRoute} />
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isWorkoutPaused ? "Workout Paused" : "Workout In Progress"}
            </p>
            <p className="text-yellow-500 font-medium">{workoutTime}min</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleWorkoutPause}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              {isWorkoutPaused ? <FaPlay className="mr-1" /> : <FaPause className="mr-1" />}
              {isWorkoutPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={cancelWorkout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <FaTimes className="mr-1" />
              Cancel
            </button>
            <button
              onClick={endWorkout}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              End
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Workout Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {workoutData.name}
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <FaDumbbell className="mr-2" />
              <span>{workoutData.exercises.length} exercises</span>
            </div>
            <div className="flex items-center">
              <FaFire className="mr-2" />
              <span>{workoutData.targetMuscles.join(", ")}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Rest Timer */}
        {isResting && (
          <div className={`bg-blue-900/50 border border-blue-500 rounded-lg p-6 mb-6 text-center ${isWorkoutPaused ? 'opacity-60' : ''}`}>
            <FaClock className="text-4xl text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Rest Time</h2>
            <p className="text-4xl font-mono text-blue-400 mb-4">
              {Math.floor(restTimer / 60)}:
              {(restTimer % 60).toString().padStart(2, "0")}
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={skipRest}
                disabled={isWorkoutPaused}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Skip Rest
              </button>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                disabled={isWorkoutPaused}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                {isTimerRunning ? (
                  <FaPause className="mr-2" />
                ) : (
                  <FaPlay className="mr-2" />
                )}
                {isTimerRunning ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
        )}

        {/* Current Exercise */}
        {!isResting && (
          <div className={`bg-gray-800 rounded-lg p-6 mb-6 ${isWorkoutPaused ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">
                  Exercise {currentExerciseIndex + 1} of{" "}
                  {workoutData.exercises.length}
                </p>
                <h2 className="text-2xl font-bold text-white">
                  {currentExercise.name}
                </h2>
                <p className="text-gray-400 capitalize">
                  {currentExercise.muscleGroup}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-500">
                  {currentSet}/{currentExercise.sets}
                </p>
                <p className="text-gray-400 text-sm">sets</p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Target Reps</p>
                  <p className="text-2xl font-bold text-white">
                    {currentExercise.reps}
                  </p>
                </div>
                <FaDumbbell className="text-4xl text-yellow-500" />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={completeSet}
                disabled={isWorkoutPaused}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FaCheck className="mr-2" />
                Complete Set
              </button>

              <button
                onClick={skipExercise}
                disabled={isWorkoutPaused}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Skip
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Exercise List
          </h3>
          <div className="space-y-3">
            {workoutData.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === currentExerciseIndex
                    ? "bg-yellow-500/20 border border-yellow-500/30"
                    : completedExercises.includes(exercise.id)
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-gray-700"
                }`}
              >
                <div>
                  <p className="font-medium text-white">{exercise.name}</p>
                  <p className="text-gray-400 text-sm">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
                <div className="text-right">
                  {completedExercises.includes(exercise.id) ? (
                    <FaCheck className="text-green-400 text-xl" />
                  ) : index === currentExerciseIndex ? (
                    <div className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                      {currentSet}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-gray-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Workout Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <div className="text-center mb-6">
                <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Cancel Workout?</h3>
                <p className="text-gray-400">
                  Are you sure you want to cancel this workout? Your progress will not be saved.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue Workout
                </button>
                <button
                  onClick={confirmCancelWorkout}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel Workout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StartWorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading workout...</p>
          </div>
        </div>
      }
    >
      <StartWorkoutContent />
    </Suspense>
  );
}
