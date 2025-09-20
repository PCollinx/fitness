/**
 * Exercise API Service
 * Handles fetching and managing exercises from the API
 */

export type APIExercise = {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  difficulty?: string;
  instructions?: string;
  createdAt: string;
};

export type ExerciseFilters = {
  muscleGroup?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
};

/**
 * Fetch exercises from the API
 */
export const fetchExercises = async (
  filters?: ExerciseFilters
): Promise<APIExercise[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.muscleGroup) params.append("muscleGroup", filters.muscleGroup);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(`/api/exercises?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

/**
 * Fetch exercise metadata (muscle groups, difficulties, stats)
 */
export const fetchExerciseMetadata = async () => {
  try {
    const response = await fetch("/api/exercises/meta");

    if (!response.ok) {
      throw new Error("Failed to fetch exercise metadata");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercise metadata:", error);
    return {
      muscleGroups: [],
      difficulties: [],
      stats: { totalExercises: 0, byMuscleGroup: {} },
    };
  }
};

/**
 * Seed exercises database (admin function)
 */
export const seedExercises = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/exercises/seed", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to seed exercises");
    }

    const result = await response.json();
    console.log("Exercises seeded:", result);
    return true;
  } catch (error) {
    console.error("Error seeding exercises:", error);
    return false;
  }
};

/**
 * Create a new exercise
 */
export const createExercise = async (exerciseData: {
  name: string;
  description?: string;
  muscleGroup: string;
  difficulty?: string;
  instructions?: string;
}): Promise<APIExercise | null> => {
  try {
    const response = await fetch("/api/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exerciseData),
    });

    if (!response.ok) {
      throw new Error("Failed to create exercise");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating exercise:", error);
    return null;
  }
};

/**
 * Get exercises by muscle group with caching
 */
export const getExercisesByMuscleGroup = async (
  muscleGroup: string
): Promise<APIExercise[]> => {
  return fetchExercises({ muscleGroup, limit: 50 });
};

/**
 * Search exercises with debouncing support
 */
export const searchExercises = async (
  query: string,
  limit = 20
): Promise<APIExercise[]> => {
  if (query.length < 2) return [];
  return fetchExercises({ search: query, limit });
};
