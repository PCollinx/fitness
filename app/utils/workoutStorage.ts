// Import the new image storage system
import {
  getImageForExercise,
  getImageForWorkout,
  getImageByCategory,
} from "./workoutImageStorage";

// Types
export type WorkoutExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  duration: number;
  intensity: string;
  category: string;
  rating: number;
  image: string;
  exercises: number;
  lastPerformed?: string;
  createdAt: string;
  isPublic: boolean;
  isDefault?: boolean; // Flag to identify default workouts
  workoutExercises?: WorkoutExercise[];
};

// Default workouts that come with the app
export const defaultWorkouts: Workout[] = [
  {
    id: "default-1",
    name: "Upper Body Focus",
    description:
      "Build strength in your chest, shoulders, and arms with this comprehensive upper body routine.",
    duration: 45,
    intensity: "High",
    category: "strength",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    exercises: 8,
    lastPerformed: "2025-09-05",
    createdAt: "2025-09-01T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
  {
    id: "default-2",
    name: "Core Crusher",
    description:
      "Strengthen your core with this targeted abdominal and lower back workout.",
    duration: 30,
    intensity: "Medium",
    category: "strength",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=300&fit=crop&crop=center",
    exercises: 6,
    lastPerformed: "2025-09-08",
    createdAt: "2025-09-02T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
  {
    id: "default-3",
    name: "HIIT Cardio Blast",
    description:
      "Burn calories fast with this high-intensity interval training session.",
    duration: 25,
    intensity: "High",
    category: "cardio",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop&crop=center",
    exercises: 10,
    lastPerformed: "2025-09-01",
    createdAt: "2025-09-03T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
  {
    id: "default-4",
    name: "Total Body Tone",
    description:
      "A complete full-body workout to build strength and endurance.",
    duration: 50,
    intensity: "Medium",
    category: "strength",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=300&fit=crop&crop=center",
    exercises: 12,
    lastPerformed: "2025-09-03",
    createdAt: "2025-09-04T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
  {
    id: "default-5",
    name: "Leg Day Challenge",
    description:
      "Build powerful legs with this comprehensive lower body workout.",
    duration: 40,
    intensity: "High",
    category: "strength",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=400&h=300&fit=crop&crop=center",
    exercises: 7,
    lastPerformed: "2025-09-10",
    createdAt: "2025-09-05T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
  {
    id: "default-6",
    name: "Flexibility Flow",
    description:
      "Improve your mobility and flexibility with this dynamic stretching routine.",
    duration: 35,
    intensity: "Low",
    category: "flexibility",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
    exercises: 9,
    createdAt: "2025-09-06T12:00:00Z",
    isPublic: true,
    isDefault: true,
  },
];

// Load custom workouts from localStorage
export const loadCustomWorkouts = (): Workout[] => {
  if (typeof window === "undefined") return [];

  try {
    const savedWorkouts = localStorage.getItem("customWorkouts");
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  } catch (error) {
    console.error("Error loading custom workouts from localStorage:", error);
    return [];
  }
};

// Save custom workouts to localStorage
export const saveCustomWorkouts = (workouts: Workout[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("customWorkouts", JSON.stringify(workouts));
  } catch (error) {
    console.error("Error saving custom workouts to localStorage:", error);
  }
};

// Get all workouts (custom + default)
export const loadWorkouts = (): Workout[] => {
  const customWorkouts = loadCustomWorkouts();
  // Combine custom workouts (first) with default workouts
  return [...customWorkouts, ...defaultWorkouts];
};

// Add a new custom workout to the beginning of the list
export const addWorkout = (workout: Workout): void => {
  const customWorkouts = loadCustomWorkouts();

  // Auto-assign exercise-based image if not provided
  if (!workout.image || workout.image === "") {
    // Try to use exercise data for smarter image selection
    if (workout.workoutExercises && workout.workoutExercises.length > 0) {
      const exerciseDetails = workout.workoutExercises.map((ex) => ({
        name: ex.exerciseName,
        muscleGroup: undefined, // Will be enhanced when we have muscle group data
      }));
      workout.image = getImageForWorkout(exerciseDetails);
    } else {
      // Fallback to category-based selection
      workout.image = getImageByCategory(workout.category);
    }
  }

  saveCustomWorkouts([workout, ...customWorkouts]);
};

// Create a new workout with auto-generated image based on exercises
export const createWorkoutWithExerciseImage = (
  workoutData: Omit<Workout, "id" | "image" | "createdAt" | "isDefault">
): Workout => {
  let image: string;

  // Generate image based on exercises if available
  if (workoutData.workoutExercises && workoutData.workoutExercises.length > 0) {
    const exerciseDetails = workoutData.workoutExercises.map((ex) => ({
      name: ex.exerciseName,
      muscleGroup: undefined, // Will be enhanced when we have muscle group data
    }));
    image = getImageForWorkout(exerciseDetails);
  } else {
    // Fallback to category-based selection
    image = getImageByCategory(workoutData.category);
  }

  const workout: Workout = {
    ...workoutData,
    id: generateId(),
    image,
    createdAt: new Date().toISOString(),
    isDefault: false,
  };

  addWorkout(workout);
  return workout;
};

// Legacy function for backwards compatibility
export const createWorkoutWithCategoryImage = createWorkoutWithExerciseImage;

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Get random image for workout based on exercises or category
export const getRandomWorkoutImage = (
  category: string = "strength",
  exercises?: WorkoutExercise[]
): string => {
  // If exercises are provided, use exercise-based image generation
  if (exercises && exercises.length > 0) {
    const exerciseDetails = exercises.map((ex) => ({
      name: ex.exerciseName,
      muscleGroup: undefined, // Will be enhanced when we have muscle group data
    }));
    return getImageForWorkout(exerciseDetails);
  }

  // Fallback to category-based selection
  return getImageByCategory(category);
};

// Legacy function for backwards compatibility
export const getRandomWorkoutImageLegacy = (): string => {
  return getImageByCategory("strength");
};

// Enhanced image generation with API exercise data
export const getImageForWorkoutWithExerciseData = async (
  workoutExercises: WorkoutExercise[]
): Promise<string> => {
  try {
    // Fetch exercise data from API to get muscle groups
    const exercisePromises = workoutExercises.map(async (ex) => {
      const response = await fetch(
        `/api/exercises?search=${encodeURIComponent(ex.exerciseName)}&limit=1`
      );
      if (response.ok) {
        const exercises = await response.json();
        if (exercises.length > 0) {
          return {
            name: ex.exerciseName,
            muscleGroup: exercises[0].muscleGroup,
          };
        }
      }
      return {
        name: ex.exerciseName,
        muscleGroup: undefined,
      };
    });

    const exerciseDetails = await Promise.all(exercisePromises);
    return getImageForWorkout(exerciseDetails);
  } catch (error) {
    console.error("Error fetching exercise data for image generation:", error);
    // Fallback to name-based matching
    const exerciseDetails = workoutExercises.map((ex) => ({
      name: ex.exerciseName,
      muscleGroup: undefined,
    }));
    return getImageForWorkout(exerciseDetails);
  }
};

// Fix broken images in localStorage workouts with exercise-based approach
export const fixBrokenWorkoutImages = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    const customWorkouts = loadCustomWorkouts();
    let hasChanges = false;

    const fixedWorkouts = await Promise.all(
      customWorkouts.map(async (workout) => {
        // Check if image URL is broken or empty
        if (
          !workout.image ||
          workout.image === "" ||
          workout.image === "undefined"
        ) {
          hasChanges = true;

          // Try to use exercise data with API lookup for smarter image selection
          if (workout.workoutExercises && workout.workoutExercises.length > 0) {
            try {
              const image = await getImageForWorkoutWithExerciseData(
                workout.workoutExercises
              );
              return {
                ...workout,
                image,
              };
            } catch (error) {
              console.error(
                "Error getting exercise-based image, falling back to category:",
                error
              );
              // Fallback to exercise name-based matching without API
              const exerciseDetails = workout.workoutExercises.map((ex) => ({
                name: ex.exerciseName,
                muscleGroup: undefined,
              }));
              return {
                ...workout,
                image: getImageForWorkout(exerciseDetails),
              };
            }
          }

          // Fallback to category-based selection
          return {
            ...workout,
            image: getImageByCategory(workout.category),
          };
        }
        return workout;
      })
    );

    if (hasChanges) {
      saveCustomWorkouts(fixedWorkouts);
      console.log("Fixed broken workout images with exercise-based selection");
    }
  } catch (error) {
    console.error("Error fixing broken workout images:", error);
  }
};

// Synchronous version for backwards compatibility
export const fixBrokenWorkoutImagesSync = (): void => {
  if (typeof window === "undefined") return;

  try {
    const customWorkouts = loadCustomWorkouts();
    let hasChanges = false;

    const fixedWorkouts = customWorkouts.map((workout) => {
      if (
        !workout.image ||
        workout.image === "" ||
        workout.image === "undefined"
      ) {
        hasChanges = true;

        if (workout.workoutExercises && workout.workoutExercises.length > 0) {
          const exerciseDetails = workout.workoutExercises.map((ex) => ({
            name: ex.exerciseName,
            muscleGroup: undefined,
          }));
          return {
            ...workout,
            image: getImageForWorkout(exerciseDetails),
          };
        }

        return {
          ...workout,
          image: getImageByCategory(workout.category),
        };
      }
      return workout;
    });

    if (hasChanges) {
      saveCustomWorkouts(fixedWorkouts);
      console.log(
        "Fixed broken workout images with exercise-based selection (sync)"
      );
    }
  } catch (error) {
    console.error("Error fixing broken workout images:", error);
  }
};

// Delete a workout by ID
export const deleteWorkout = (workoutId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const customWorkouts = loadCustomWorkouts();
    const updatedWorkouts = customWorkouts.filter(
      (workout) => workout.id !== workoutId
    );

    // Only update localStorage if we actually removed a workout
    if (updatedWorkouts.length !== customWorkouts.length) {
      saveCustomWorkouts(updatedWorkouts);
      console.log(`Workout ${workoutId} deleted successfully`);
      return true;
    }

    // Workout not found in custom workouts (might be a default workout)
    console.warn(
      `Workout ${workoutId} not found or cannot be deleted (default workout)`
    );
    return false;
  } catch (error) {
    console.error("Error deleting workout:", error);
    return false;
  }
};

// Update a workout by ID
export const updateWorkout = (
  workoutId: string,
  updatedWorkout: Partial<Workout>
): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const customWorkouts = loadCustomWorkouts();
    const workoutIndex = customWorkouts.findIndex(
      (workout) => workout.id === workoutId
    );

    if (workoutIndex !== -1) {
      customWorkouts[workoutIndex] = {
        ...customWorkouts[workoutIndex],
        ...updatedWorkout,
      };
      saveCustomWorkouts(customWorkouts);
      console.log(`Workout ${workoutId} updated successfully`);
      return true;
    }

    console.warn(`Workout ${workoutId} not found for update`);
    return false;
  } catch (error) {
    console.error("Error updating workout:", error);
    return false;
  }
};

// Get a single workout by ID
export const getWorkoutById = (workoutId: string): Workout | null => {
  const allWorkouts = loadWorkouts();
  return allWorkouts.find((workout) => workout.id === workoutId) || null;
};

// Check if a workout can be deleted (not a default workout)
export const canDeleteWorkout = (workoutId: string): boolean => {
  const workout = getWorkoutById(workoutId);
  return workout ? !workout.isDefault : false;
};

// Reliable fallback images for different categories
export const getFallbackImageByCategory = (category: string): string => {
  const fallbackImages: Record<string, string> = {
    strength:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center&auto=format",
    cardio:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop&crop=center&auto=format",
    flexibility:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center&auto=format",
    hiit: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=300&fit=crop&crop=center&auto=format",
    bodyweight:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center&auto=format",
    yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center&auto=format",
  };

  return fallbackImages[category.toLowerCase()] || fallbackImages["strength"];
};
