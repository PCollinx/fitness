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
    const response = await fetch("/api/workouts/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workoutId: sessionData.workoutId,
        startTime: sessionData.startTime.toISOString(),
        endTime: sessionData.endTime.toISOString(),
        elapsedTime: sessionData.elapsedTime,
        exercises: sessionData.exercises,
        notes: sessionData.notes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
  notes?: string
): WorkoutSessionData {
  const elapsedTime = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000
  );

  const exercises = Object.entries(setTrackers).map(([exerciseId, sets]) => ({
    exerciseId,
    sets,
  }));

  return {
    workoutId,
    startTime,
    endTime,
    elapsedTime,
    exercises,
    notes,
  };
}
