/**
 * Exercise Image Storage System
 * Provides muscle-group-based images for exercises and workouts
 */

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "glutes"
  | "core"
  | "cardio"
  | "full_body";

export type ExerciseImageSet = {
  keywords: string[];
  images: string[];
  fallbackImage: string;
};

// Exercise images organized by muscle group (matching API structure)
export const exerciseImageStorage: Record<MuscleGroup, ExerciseImageSet> = {
  chest: {
    keywords: ["chest", "pecs", "push", "press", "bench", "fly", "dip"],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  back: {
    keywords: ["back", "lat", "pull", "row", "deadlift", "rhomboids", "traps"],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  shoulders: {
    keywords: [
      "shoulder",
      "deltoid",
      "press",
      "raise",
      "lateral",
      "rear",
      "front",
    ],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  arms: {
    keywords: ["bicep", "tricep", "arm", "curl", "extension", "hammer", "dip"],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  legs: {
    keywords: [
      "legs",
      "quad",
      "hamstring",
      "squat",
      "lunge",
      "leg press",
      "calf",
    ],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  glutes: {
    keywords: [
      "glute",
      "hip thrust",
      "bridge",
      "bulgarian",
      "split squat",
      "clamshell",
    ],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  core: {
    keywords: [
      "core",
      "abs",
      "plank",
      "crunch",
      "twist",
      "mountain climber",
      "abdominal",
    ],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  cardio: {
    keywords: [
      "cardio",
      "running",
      "treadmill",
      "bike",
      "cycling",
      "elliptical",
      "jump rope",
      "burpee",
      "high knees",
    ],
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2320&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },

  full_body: {
    keywords: [
      "full body",
      "compound",
      "deadlift",
      "burpee",
      "thruster",
      "clean",
      "snatch",
      "circuit",
    ],
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
};

/**
 * Get image for exercise based on muscle group and exercise name
 * @param muscleGroup - The primary muscle group
 * @param exerciseName - Optional exercise name for keyword matching
 * @returns A relevant image URL
 */
export const getImageForExercise = (
  muscleGroup: string,
  exerciseName?: string
): string => {
  // Normalize muscle group
  const normalizedMuscleGroup = muscleGroup.toLowerCase() as MuscleGroup;

  // Try direct muscle group match first
  if (exerciseImageStorage[normalizedMuscleGroup]) {
    const imageSet = exerciseImageStorage[normalizedMuscleGroup];

    // If exercise name provided, try keyword matching for better selection
    if (exerciseName) {
      const lowerExerciseName = exerciseName.toLowerCase();
      const hasKeywordMatch = imageSet.keywords.some((keyword) =>
        lowerExerciseName.includes(keyword.toLowerCase())
      );

      if (hasKeywordMatch) {
        // Return random image from this muscle group
        const randomIndex = Math.floor(Math.random() * imageSet.images.length);
        return imageSet.images[randomIndex];
      }
    }

    return imageSet.fallbackImage;
  }

  // Fallback muscle group matching
  const fallbackMapping: Record<string, MuscleGroup> = {
    pecs: "chest",
    lats: "back",
    delts: "shoulders",
    deltoids: "shoulders",
    biceps: "arms",
    triceps: "arms",
    quads: "legs",
    quadriceps: "legs",
    hamstrings: "legs",
    calves: "legs",
    abs: "core",
    abdominals: "core",
    glute: "glutes",
    gluteus: "glutes",
  };

  const fallbackGroup = fallbackMapping[normalizedMuscleGroup];
  if (fallbackGroup && exerciseImageStorage[fallbackGroup]) {
    return exerciseImageStorage[fallbackGroup].fallbackImage;
  }

  // Ultimate fallback - full body
  return exerciseImageStorage.full_body.fallbackImage;
};

/**
 * Get image for workout based on dominant muscle groups and exercise patterns
 * @param exercises - Array of exercises with muscle groups
 * @returns A relevant image URL
 */
export const getImageForWorkout = (
  exercises: Array<{ muscleGroup?: string; name?: string }>
): string => {
  if (exercises.length === 0) {
    return exerciseImageStorage.full_body.fallbackImage;
  }

  // Count muscle groups and analyze exercise patterns
  const muscleGroupCounts: Record<string, number> = {};
  let cardioKeywords = 0;
  let strengthKeywords = 0;

  exercises.forEach((exercise) => {
    if (exercise.muscleGroup) {
      const normalized = exercise.muscleGroup.toLowerCase();
      muscleGroupCounts[normalized] = (muscleGroupCounts[normalized] || 0) + 1;
    }

    if (exercise.name) {
      const exerciseName = exercise.name.toLowerCase();

      // Check for cardio indicators
      const cardioTerms = [
        "running",
        "jump",
        "burpee",
        "mountain climber",
        "high knees",
        "jumping jacks",
      ];
      if (cardioTerms.some((term) => exerciseName.includes(term))) {
        cardioKeywords++;
      }

      // Check for strength indicators
      const strengthTerms = [
        "press",
        "curl",
        "squat",
        "deadlift",
        "bench",
        "row",
      ];
      if (strengthTerms.some((term) => exerciseName.includes(term))) {
        strengthKeywords++;
      }
    }
  });

  // If majority is cardio exercises, use cardio image
  if (cardioKeywords > exercises.length * 0.5) {
    return getImageForExercise("cardio");
  }

  // Determine workout type based on muscle group variety
  const uniqueMuscleGroups = Object.keys(muscleGroupCounts).length;

  // If hitting 3+ muscle groups, it's likely a full body workout
  if (uniqueMuscleGroups >= 3) {
    return exerciseImageStorage.full_body.fallbackImage;
  }

  // Find most common muscle group
  const dominantMuscleGroup = Object.entries(muscleGroupCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  if (dominantMuscleGroup) {
    // Get a random image from the muscle group for variety
    const imageSet = exerciseImageStorage[dominantMuscleGroup as MuscleGroup];
    if (imageSet) {
      const randomIndex = Math.floor(Math.random() * imageSet.images.length);
      return imageSet.images[randomIndex];
    }
    return getImageForExercise(dominantMuscleGroup);
  }

  return exerciseImageStorage.full_body.fallbackImage;
};

/**
 * Get all images for a specific muscle group
 * @param muscleGroup - The muscle group
 * @returns Array of image URLs for the muscle group
 */
export const getAllImagesForMuscleGroup = (muscleGroup: string): string[] => {
  const normalizedMuscleGroup = muscleGroup.toLowerCase() as MuscleGroup;
  const imageSet = exerciseImageStorage[normalizedMuscleGroup];

  if (!imageSet) {
    return [exerciseImageStorage.full_body.fallbackImage];
  }

  return imageSet.images;
};

/**
 * Get all available muscle groups
 * @returns Array of all supported muscle groups
 */
export const getAvailableMuscleGroups = (): MuscleGroup[] => {
  return Object.keys(exerciseImageStorage) as MuscleGroup[];
};

/**
 * Validate if a muscle group is supported
 * @param muscleGroup - Muscle group to validate
 * @returns Boolean indicating if muscle group is supported
 */
export const isMuscleGroupSupported = (muscleGroup: string): boolean => {
  const normalizedMuscleGroup = muscleGroup.toLowerCase();
  return normalizedMuscleGroup in exerciseImageStorage;
};

// Legacy backward compatibility functions
export const getImageByCategory = (category: string): string => {
  // Map old categories to new muscle groups
  const categoryMapping: Record<string, MuscleGroup> = {
    strength: "full_body",
    cardio: "cardio",
    flexibility: "core", // stretching/flexibility often involves core
    hiit: "cardio",
    yoga: "core",
    powerlifting: "full_body",
    bodyweight: "full_body",
    crossfit: "full_body",
    running: "cardio",
    cycling: "cardio",
    swimming: "cardio",
  };

  const mappedMuscleGroup = categoryMapping[category.toLowerCase()];
  return getImageForExercise(mappedMuscleGroup || "full_body");
};

export const getAllImagesForCategory = getAllImagesForMuscleGroup;
export const getFallbackImage = (category: string): string =>
  getImageByCategory(category);
export const isCategorySupported = isMuscleGroupSupported;
