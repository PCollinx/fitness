"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaCheck,
  FaRedo,
  FaClock,
  FaDumbbell,
  FaFire,
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaHeart,
} from "react-icons/fa";

interface WorkoutExercise {
  id: string;
  exerciseId: string;
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
  exercises: WorkoutExercise[];
}

interface ExerciseSet {
  completed: boolean;
  actualReps?: number;
  actualWeight?: number;
}

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseSets, setExerciseSets] = useState<
    Record<string, ExerciseSet[]>
  >({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalDuration, setFinalDuration] = useState(0);

  const workoutId = params.id as string;

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;

      setIsLoading(true);

      try {
        const response = await fetch(`/api/workouts/${workoutId}`);

        if (!response.ok) {
          throw new Error("Failed to load workout");
        }

        const data = await response.json();
        setWorkout(data);

        // Initialize exercise sets
        const initialSets: Record<string, ExerciseSet[]> = {};
        data.exercises.forEach((exercise: WorkoutExercise) => {
          initialSets[exercise.id] = Array(exercise.sets)
            .fill(null)
            .map(() => ({
              completed: false,
            }));
        });
        setExerciseSets(initialSets);

        // Auto-start the session immediately
        setIsSessionActive(true);
        setSessionStartTime(new Date());
      } catch (err) {
        console.error("Error loading workout:", err);
        router.push("/workouts");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, router]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - sessionStartTime.getTime());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, sessionStartTime]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
  };

  const completeWorkout = () => {
    // Capture the final duration and stop the timer
    if (sessionStartTime) {
      const finalTime = Date.now() - sessionStartTime.getTime();
      setFinalDuration(finalTime);
    }
    // Stop the session timer by setting isSessionActive to false
    setIsSessionActive(false);
    // Show completion modal
    setShowCompletionModal(true);
  };

  const continueSession = () => {
    // Restart the session with the current elapsed time as the base
    setIsSessionActive(true);
    setSessionStartTime(new Date(Date.now() - finalDuration));
    setShowCompletionModal(false);
  };

  const endSession = async () => {
    // Save workout session data
    if (sessionStartTime && workout) {
      try {
        const endTime = Date.now();
        const startTimeMs = sessionStartTime.getTime();
        
        // Prepare exercise data with sets
        const exerciseData = workout.exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: (exerciseSets[exercise.id] || []).map((set, index) => ({
            targetReps: exercise.reps,
            actualReps: set.actualReps || exercise.reps,
            targetWeight: exercise.weight,
            actualWeight: set.actualWeight || exercise.weight,
            completed: set.completed,
          }))
        }));

        console.log("Saving workout session with data:", {
          workoutId: workout.id,
          startTime: startTimeMs,
          endTime: endTime,
          duration: finalDuration || (endTime - startTimeMs),
          exercises: exerciseData,
        });

        const response = await fetch('/api/workout-sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workoutId: workout.id,
            startTime: startTimeMs,
            endTime: endTime,
            duration: finalDuration || (endTime - startTimeMs),
            exercises: exerciseData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save workout session:', errorData);
          throw new Error(`Failed to save session: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving workout session:', error);
        // Don't block navigation on save error
      }
    }

    setIsSessionActive(false);
    setSessionStartTime(null);
    setElapsedTime(0);
    setShowCompletionModal(false);
    router.push("/workouts");
  };

  const completeSet = (exerciseId: string, setIndex: number) => {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set, index) =>
        index === setIndex ? { ...set, completed: true } : set
      ),
    }));

    // Start rest timer (90 seconds default)
    setRestTimer(90);
    setIsResting(true);
  };

  const skipRest = () => {
    setRestTimer(0);
    setIsResting(false);
  };

  const nextExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-800 rounded-lg mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <FaDumbbell className="text-gray-600 h-16 w-16 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-white mb-3">
            Workout Not Found
          </h2>
          <button
            onClick={() => router.push("/workouts")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-medium transition"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSets = exerciseSets[currentExercise?.id] || [];
  const completedSets = currentSets.filter((set) => set.completed).length;

  return (
    <div className="min-h-screen bg-black text-white mt-8">
      {/* Header */}
      <div className="bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push(`/workouts/${workout.id}`)}
              className="flex items-center text-yellow-400 hover:text-yellow-300 transition"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>

            {isSessionActive && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  <FaClock className="mr-2" />
                  <span className="font-mono">{formatTime(elapsedTime)}</span>
                </div>
                <button
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  End Session
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{workout.name}</h1>

          {!isSessionActive ? (
            <button
              onClick={startSession}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
            >
              <FaPlay className="mr-3" />
              Start Workout Session
            </button>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300">
                  Exercise {currentExerciseIndex + 1} of{" "}
                  {workout.exercises.length}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={previousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextExercise}
                    disabled={
                      currentExerciseIndex === workout.exercises.length - 1
                    }
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <div className="h-2 bg-gray-700 rounded-full mb-4">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentExerciseIndex +
                        completedSets / currentExercise.sets) /
                        workout.exercises.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Exercise */}
      {isSessionActive && currentExercise && (
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Rest Timer */}
            {isResting && (
              <div className="bg-blue-900 border border-blue-700 p-6 rounded-lg mb-6 text-center">
                <h3 className="text-xl font-bold text-blue-300 mb-2">
                  Rest Time
                </h3>
                <div className="text-4xl font-mono text-blue-400 mb-4">
                  {Math.floor(restTimer / 60)}:
                  {(restTimer % 60).toString().padStart(2, "0")}
                </div>
                <button
                  onClick={skipRest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Skip Rest
                </button>
              </div>
            )}

            {/* Exercise Info */}
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentExercise.name}
              </h2>
              <p className="text-gray-300 capitalize mb-4">
                {currentExercise.muscleGroup.replace("_", " ")} • Target muscle
                group
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {currentExercise.sets}
                  </div>
                  <div className="text-gray-300">Sets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {currentExercise.reps}
                  </div>
                  <div className="text-gray-300">Reps</div>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {currentSets.map((set, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      set.completed
                        ? "bg-green-900 border-green-700"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-bold text-white mr-3">
                          Set {index + 1}
                        </span>
                        <span className="text-gray-300">
                          {currentExercise.reps} reps
                          {currentExercise.weight &&
                            ` • ${currentExercise.weight} lbs`}
                        </span>
                      </div>

                      {!set.completed ? (
                        <button
                          onClick={() => completeSet(currentExercise.id, index)}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-medium transition flex items-center"
                        >
                          <FaCheck className="mr-2" />
                          Complete
                        </button>
                      ) : (
                        <div className="text-green-400 flex items-center">
                          <FaCheck className="mr-2" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {completedSets === currentExercise.sets && (
              <div className="text-center">
                {currentExerciseIndex < workout.exercises.length - 1 ? (
                  <button
                    onClick={nextExercise}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-bold flex items-center mx-auto transition"
                  >
                    Next Exercise
                    <FaChevronRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={completeWorkout}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center mx-auto transition"
                  >
                    <FaCheck className="mr-2" />
                    Finish Workout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workout Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            {/* Celebration Icon */}
            <div className="mb-6">
              <FaTrophy className="text-yellow-400 text-6xl mx-auto mb-4" />
            </div>
            
            {/* Completion Message */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Workout Complete!
            </h2>
            <p className="text-gray-300 mb-6">
              Great job! You've completed "{workout?.name}"
            </p>
            
            {/* Workout Stats */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-center text-yellow-400 mb-1">
                    <FaClock className="mr-2" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {formatTime(finalDuration)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-center text-yellow-400 mb-1">
                    <FaDumbbell className="mr-2" />
                    <span className="text-sm">Exercises</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {workout?.exercises.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Motivational Message */}
            <div className="flex items-center justify-center text-red-400 mb-6">
              <FaHeart className="mr-2" />
              <span className="text-sm">Keep up the great work!</span>
            </div>
            
            {/* Action Button */}
            <button
              onClick={endSession}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-bold transition"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
