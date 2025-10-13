// Workout session API utilities

export interface WorkoutSessionData {
  workoutId: string;
  startTime: Date;
  endTime: Date;
  elapsedTime: number; // in seconds
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      completed: boolean;
      actualReps?: number;
      actualWeight?: number;
      targetReps?: number;
      targetWeight?: number;
      notes?: string;
    }>;
  }>;
  notes?: string;
}

export interface WorkoutSessionResponse {
  success: boolean;
  sessionId: string;
  message: string;
  session?: any;
}

export interface WorkoutSessionsResponse {
  success: boolean;
  sessions: WorkoutSessionWithDetails[];
}

export interface WorkoutSessionWithDetails {
  id: string;
  workoutId: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  workout: {
    id: string;
    name: string;
  };
  exercises: Array<{
    id: string;
    order: number;
    exercise: {
      id: string;
      name: string;
    };
    sets: Array<{
      id: string;
      setNumber: number;
      targetReps: number;
      actualReps?: number;
      targetWeight?: number;
      actualWeight?: number;
      completed: boolean;
      notes?: string;
    }>;
  }>;
}

/**
 * Submit a completed workout session to the API
 */
export async function submitWorkoutSession(
  sessionData: WorkoutSessionData
): Promise<WorkoutSessionResponse> {
  try {
    const requestBody = {
      workoutId: sessionData.workoutId,
      startTime: sessionData.startTime.toISOString(),
      endTime: sessionData.endTime.toISOString(),
      duration: sessionData.elapsedTime * 1000, // Convert to milliseconds as API expects
      exercises: sessionData.exercises,
      notes: sessionData.notes,
    };

    const response = await fetch("/api/workout-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Could not parse error response, use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to save workout session");
    }

    return data;
  } catch (error) {
    console.error("Error submitting workout session:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save workout session"
    );
  }
}

/**
 * Fetch recent workout sessions from the API
 */
export async function fetchWorkoutSessions(): Promise<WorkoutSessionsResponse> {
  try {
    const response = await fetch("/api/workouts/sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch workout sessions");
    }

    return data;
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch workout sessions"
    );
  }
}

/**
 * Fetch workout session statistics from the API
 */
export async function fetchWorkoutSessionStats(): Promise<any> {
  try {
    const response = await fetch("/api/workouts/sessions/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch workout session stats");
    }

    return data.stats;
  } catch (error) {
    console.error("Error fetching workout session stats:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch workout session stats"
    );
  }
}

/**
 * Format workout session data for API submission
 */
export function formatWorkoutSessionData(
  workoutId: string,
  startTime: Date,
  endTime: Date,
  setTrackers: Record<
    string,
    Array<{
      completed: boolean;
      actualReps?: number;
      actualWeight?: number;
      notes?: string;
    }>
  >,
  workoutExercises?: Array<{
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
  }>,
  notes?: string
): WorkoutSessionData {
  const elapsedTime = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000
  );

  const exercises = Object.entries(setTrackers)
    .filter(([exerciseId, sets]) => exerciseId && sets && sets.length > 0)
    .map(([exerciseId, sets]) => {
      // Find the corresponding workout exercise to get target values
      const workoutExercise = workoutExercises?.find(
        (ex) => ex.exerciseId === exerciseId
      );

      return {
        exerciseId,
        sets: sets.map((set) => ({
          completed: set.completed || false,
          actualReps:
            set.actualReps ??
            (workoutExercise
              ? parseInt(workoutExercise.reps.toString())
              : undefined),
          actualWeight: set.actualWeight ?? workoutExercise?.weight,
          targetReps: workoutExercise
            ? parseInt(workoutExercise.reps.toString())
            : undefined,
          targetWeight: workoutExercise?.weight,
          notes: set.notes,
        })),
      };
    });

  return {
    workoutId,
    startTime,
    endTime,
    elapsedTime,
    exercises,
    notes,
  };
}
