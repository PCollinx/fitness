/**
 * API-based Workout Management
 * Replaces localStorage-based workoutStorage.ts with database-driven operations
 */

// Import existing image utilities
import {
  getImageForExercise,
  getImageForWorkout,
  getImageByCategory,
} from "./workoutImageStorage";

// Types matching the current workoutStorage.ts interface for compatibility
export type WorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order?: number;
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  duration?: number;
  intensity?: string;
  category?: string;
  rating?: number;
  image: string;
  exercises: number;
  lastPerformed?: string;
  createdAt: string;
  isPublic: boolean;
  isDefault?: boolean;
  workoutExercises?: WorkoutExercise[];
  // API-specific fields
  isOwner?: boolean;
  author?: string;
  exerciseCount?: number;
  muscleGroups?: string[];
  difficulty?: string;
  timesCompleted?: number;
};

export interface CreateWorkoutData {
  name: string;
  description?: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }>;
  image?: string;
  public?: boolean;
}

/**
 * Fetch all workouts from API (user's workouts + public workouts)
 */
export const loadWorkouts = async (options?: {
  muscleGroup?: string;
  limit?: number;
  offset?: number;
}): Promise<Workout[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.muscleGroup) params.append("muscleGroup", options.muscleGroup);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await fetch(`/api/workouts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workouts: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match expected format
    return data.workouts.map((workout: any) => ({
      id: workout.id,
      name: workout.name,
      description: workout.description || "",
      image: workout.image || getImageByCategory("strength"),
      exercises: workout.exerciseCount || workout.exercises?.length || 0,
      createdAt: workout.createdAt,
      isPublic: true, // API workouts are accessible to the user
      isDefault: false, // API workouts are not default workouts
      isOwner: workout.isOwner,
      author: workout.author,
      exerciseCount: workout.exerciseCount,
      muscleGroups: workout.muscleGroups || [],
      difficulty: workout.difficulty,
      timesCompleted: workout.timesCompleted || 0,
      workoutExercises: workout.exercises?.map((ex: any, index: number) => ({
        exerciseId: ex.exerciseId || ex.id,
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        notes: ex.notes,
        order: ex.order || index,
      })) || [],
      // Legacy compatibility fields
      duration: 0, // Will be calculated dynamically
      intensity: workout.difficulty || "Medium",
      category: workout.muscleGroups?.[0] || "strength",
      rating: 4.5, // Default rating
      lastPerformed: undefined,
    }));
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
};

/**
 * Get a single workout by ID from API
 */
export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
  try {
    const response = await fetch(`/api/workouts/${workoutId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch workout: ${response.status}`);
    }

    const workout = await response.json();
    
    // Transform API response to match expected format
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description || "",
      image: workout.image || getImageByCategory("strength"),
      exercises: workout.exerciseCount || workout.exercises?.length || 0,
      createdAt: workout.createdAt,
      isPublic: true,
      isDefault: false,
      isOwner: workout.isOwner,
      author: workout.author,
      exerciseCount: workout.exerciseCount,
      muscleGroups: workout.muscleGroups || [],
      difficulty: workout.difficulty,
      timesCompleted: workout.timesCompleted || 0,
      workoutExercises: workout.exercises?.map((ex: any, index: number) => ({
        exerciseId: ex.exerciseId || ex.id,
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        notes: ex.notes,
        order: ex.order || index,
      })) || [],
      // Legacy compatibility fields
      duration: 0,
      intensity: workout.difficulty || "Medium",
      category: workout.muscleGroups?.[0] || "strength",
      rating: 4.5,
      lastPerformed: undefined,
    };
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    return null;
  }
};

/**
 * Create a new workout via API
 */
export const addWorkout = async (workoutData: CreateWorkoutData): Promise<Workout | null> => {
  try {
    // Auto-assign image if not provided
    if (!workoutData.image) {
      if (workoutData.exercises && workoutData.exercises.length > 0) {
        // Try to fetch exercise data to get muscle groups for better image selection
        const exerciseDetails = await Promise.all(
          workoutData.exercises.map(async (ex) => {
            try {
              const response = await fetch(`/api/exercises/${ex.exerciseId}`);
              if (response.ok) {
                const exercise = await response.json();
                return {
                  name: exercise.name,
                  muscleGroup: exercise.muscleGroup,
                };
              }
            } catch (error) {
              console.warn("Failed to fetch exercise details:", error);
            }
            return { name: "unknown", muscleGroup: undefined };
          })
        );
        
        workoutData.image = getImageForWorkout(exerciseDetails);
      } else {
        workoutData.image = getImageByCategory("strength");
      }
    }

    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: workoutData.name,
        description: workoutData.description,
        exercises: workoutData.exercises.map((ex, index) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          notes: ex.notes,
          order: index,
        })),
        image: workoutData.image,
        public: workoutData.public || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create workout: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Failed to create workout");
    }

    // Fetch the complete workout data
    return await getWorkoutById(result.workout.id);
  } catch (error) {
    console.error("Error creating workout:", error);
    throw error;
  }
};

/**
 * Update an existing workout via API
 */
export const updateWorkout = async (
  workoutId: string,
  updates: Partial<CreateWorkoutData>
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updates.name,
        description: updates.description,
        exercises: updates.exercises?.map((ex, index) => ({
          name: ex.exerciseId, // API expects exercise name for now
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          notes: ex.notes,
        })) || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update workout: ${response.status}`);
    }

    const result = await response.json();
    return !!result.workout;
  } catch (error) {
    console.error("Error updating workout:", error);
    return false;
  }
};

/**
 * Delete a workout via API
 */
export const deleteWorkout = async (workoutId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete workout: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    return false;
  }
};

/**
 * Update workout image via API
 */
export const updateWorkoutImage = async (
  workoutId: string,
  imageUrl: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update workout image: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error updating workout image:", error);
    return false;
  }
};

/**
 * Check if a workout can be deleted (user must own it)
 */
export const canDeleteWorkout = async (workoutId: string): Promise<boolean> => {
  try {
    const workout = await getWorkoutById(workoutId);
    return workout ? (workout.isOwner ?? false) : false;
  } catch (error) {
    console.error("Error checking workout ownership:", error);
    return false;
  }
};

/**
 * Create workout with smart image selection based on exercises
 */
export const createWorkoutWithExerciseImage = async (
  workoutData: Omit<CreateWorkoutData, "image">
): Promise<Workout | null> => {
  return addWorkout(workoutData);
};

// Legacy compatibility functions
export const createWorkoutWithCategoryImage = createWorkoutWithExerciseImage;
export const loadCustomWorkouts = () => loadWorkouts();
export const saveCustomWorkouts = () => Promise.resolve(); // No-op for API version

/**
 * Generate a unique ID (for compatibility - API generates real IDs)
 */
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Get random workout image (uses existing image utilities)
 */
export const getRandomWorkoutImage = (
  category: string = "strength",
  exercises?: WorkoutExercise[]
): string => {
  if (exercises && exercises.length > 0) {
    const exerciseDetails = exercises.map((ex) => ({
      name: ex.exerciseName,
      muscleGroup: undefined, // Will be enhanced when we have muscle group data
    }));
    return getImageForWorkout(exerciseDetails);
  }
  
  return getImageByCategory(category);
};

/**
 * Get fallback image by category
 */
export const getFallbackImageByCategory = (category: string): string => {
  return getImageByCategory(category);
};

// For backwards compatibility, export image functions
export {
  getImageForExercise,
  getImageForWorkout, 
  getImageByCategory
} from "./workoutImageStorage";

/**
 * Migration function to handle localStorage to API transition
 * This will be called automatically when components load
 */
export const migrateLocalStorageWorkouts = async (): Promise<boolean> => {
  if (typeof window === "undefined") return true;
  
  try {
    // Check if migration was already completed
    const migrationComplete = localStorage.getItem("workout_migration_complete");
    if (migrationComplete === "true") {
      return true;
    }

    // Check for existing localStorage workouts
    const savedWorkouts = localStorage.getItem("customWorkouts");
    if (!savedWorkouts) {
      // No localStorage workouts to migrate
      localStorage.setItem("workout_migration_complete", "true");
      return true;
    }

    const localWorkouts = JSON.parse(savedWorkouts) as Workout[];
    if (localWorkouts.length === 0) {
      localStorage.setItem("workout_migration_complete", "true");
      return true;
    }

    console.log(`Migrating ${localWorkouts.length} workouts from localStorage to API...`);

    // Migrate each workout
    let successCount = 0;
    for (const workout of localWorkouts) {
      try {
        if (workout.workoutExercises && workout.workoutExercises.length > 0) {
          const migrationData: CreateWorkoutData = {
            name: workout.name,
            description: workout.description,
            exercises: workout.workoutExercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              notes: ex.notes,
            })),
            image: workout.image,
            public: false, // Keep user workouts private by default
          };

          await addWorkout(migrationData);
          successCount++;
          console.log(`Successfully migrated workout: ${workout.name}`);
        }
      } catch (error) {
        console.error(`Failed to migrate workout "${workout.name}":`, error);
      }
    }

    if (successCount > 0) {
      localStorage.setItem("workout_migration_complete", "true");
      console.log(`Successfully migrated ${successCount}/${localWorkouts.length} workouts`);
    }

    return successCount === localWorkouts.length;
  } catch (error) {
    console.error("Error during workout migration:", error);
    return false;
  }
};

/**
 * Initialize API-based workout system
 * Call this in components that need workout data
 */
export const initializeWorkoutSystem = async (): Promise<void> => {
  try {
    await migrateLocalStorageWorkouts();
  } catch (error) {
    console.warn("Workout migration failed, but continuing with API system:", error);
  }
};