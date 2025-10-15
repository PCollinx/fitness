/**
 * Exercise Image Storage System
 * Provides muscle-group-based images for exercises and workouts
 * Uses dynamic Pexels API for fresh, relevant fitness images
 */

import { getPexelsService } from "./pexelsImageService";

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

// High-Quality Curated Fitness Images with Enhanced Filtering
// Uses Unsplash API with strict fitness-focused search terms to avoid irrelevant content
export const exerciseImageStorage: Record<MuscleGroup, ExerciseImageSet> = {
  chest: {
    keywords: [
      "gym chest workout",
      "bench press exercise",
      "chest training gym",
      "dumbbell chest press",
      "push up workout",
      "chest fly exercise",
      "incline bench press",
      "fitness chest training",
    ],
    images: [
      // High-quality fitness-focused chest workout images
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
  },

  back: {
    keywords: [
      "gym back workout",
      "pull up exercise",
      "back training gym",
      "rowing machine workout",
      "deadlift exercise gym",
      "lat pulldown machine",
      "back muscle training",
      "fitness back workout",
    ],
    images: [
      // High-quality fitness-focused back workout images
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
  },

  shoulders: {
    keywords: [
      "shoulder workout gym",
      "dumbbell shoulder press",
      "shoulder training fitness",
      "lateral raises exercise",
      "overhead press gym",
      "deltoid workout",
      "shoulder muscle training",
      "fitness shoulder exercise",
    ],
    images: [
      // High-quality fitness-focused shoulder workout images
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
  },

  arms: {
    keywords: [
      "arm workout gym",
      "bicep curl exercise",
      "tricep workout fitness",
      "dumbbell arm training",
      "arm muscle workout",
      "bicep training gym",
      "tricep extension exercise",
      "fitness arm workout",
    ],
    images: [
      // High-quality fitness-focused arm workout images
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
  },

  legs: {
    keywords: [
      "leg workout gym",
      "squat exercise fitness",
      "leg training gym",
      "lunge workout",
      "leg press machine",
      "quadriceps training",
      "hamstring workout",
      "fitness leg exercise",
    ],
    images: [
      // High-quality fitness-focused leg workout images
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
  },

  glutes: {
    keywords: [
      "glute workout gym",
      "hip thrust exercise",
      "glute training fitness",
      "squat glute focus",
      "glute bridge exercise",
      "deadlift glute workout",
    ],
    images: [
      // High-quality fitness-focused glute workout images
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
  },

  core: {
    keywords: [
      "core workout gym",
      "abs training fitness",
      "plank exercise",
      "core strengthening",
      "abdominal workout",
      "core training fitness",
      "fitness core exercise",
    ],
    images: [
      // High-quality fitness-focused core workout images
      "https://images.unsplash.com/photo-1571019612263-2becf64b04ba?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571019612263-2becf64b04ba?auto=format&fit=crop&w=800&h=600",
  },

  cardio: {
    keywords: [
      "gym cardio workout",
      "treadmill exercise gym",
      "indoor cardio fitness",
      "gym cycling workout",
      "fitness cardio training",
      "elliptical machine gym",
      "HIIT cardio workout",
      "cardio exercise gym",
    ],
    images: [
      // High-quality fitness-focused cardio workout images
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
  },

  full_body: {
    keywords: [
      "full body workout gym",
      "compound exercise gym",
      "deadlift exercise gym",
      "functional training fitness",
      "crossfit gym workout",
      "circuit training gym",
      "full body fitness",
      "compound movement gym",
    ],
    images: [
      // High-quality fitness-focused full body workout images
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1521805103424-d8f8430e8933?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&h=600",
    ],
    fallbackImage:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
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

// Track used images to prevent duplicates within a session
let usedImages: Set<string> = new Set();

/**
 * Reset the used images tracker (useful for seeding operations)
 */
export const resetUsedImagesTracker = (): void => {
  usedImages.clear();

  // Also clear Pexels service history for fresh images
  try {
    const pexelsService = getPexelsService();
    pexelsService.clearImageHistory();
  } catch (error) {
    console.log(
      "No Pexels service available for history clearing (expected during seeding)"
    );
  }
};

/**
 * Get a unique image that hasn't been used recently
 * @param imageSet - Set of images to choose from
 * @param fallback - Fallback image if all are used
 * @returns A unique image URL
 */
const getUniqueImageFromSet = (
  imageSet: ExerciseImageSet,
  fallback: string
): string => {
  const availableImages = imageSet.images.filter((img) => !usedImages.has(img));

  if (availableImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    usedImages.add(selectedImage);
    return selectedImage;
  }

  // If all images used, reset and use fallback or first image
  if (usedImages.size >= imageSet.images.length) {
    usedImages.clear();
    const selectedImage = imageSet.images[0];
    usedImages.add(selectedImage);
    return selectedImage;
  }

  return fallback;
};

/**
 * Enhanced image selection for workouts with smart contextual analysis
 * @param exercises - Array of exercises with muscle groups and names
 * @param workoutName - Optional workout name for additional context
 * @param category - Optional workout category for context
 * @returns A relevant, unique image URL
 */
export const getImageForWorkout = async (
  exercises: Array<{ muscleGroup?: string; name?: string }>,
  workoutName?: string,
  category?: string
): Promise<string> => {
  try {
    // Use dynamic Pexels API for fresh, contextual images
    const pexelsService = getPexelsService();
    return await pexelsService.fetchImageForWorkout(
      exercises,
      workoutName,
      category
    );
  } catch (error) {
    console.error("Failed to fetch dynamic image, using fallback:", error);
    // Fallback to static selection if API fails
    return getStaticImageForWorkout(exercises, workoutName, category);
  }
};

/**
 * Static fallback image selection (original logic)
 */
export const getStaticImageForWorkout = (
  exercises: Array<{ muscleGroup?: string; name?: string }>,
  workoutName?: string,
  category?: string
): string => {
  if (exercises.length === 0) {
    return getUniqueImageFromSet(
      exerciseImageStorage.full_body,
      exerciseImageStorage.full_body.fallbackImage
    );
  }

  // Analyze workout context from name and category with enhanced specificity
  const workoutContext = {
    isHIIT: false,
    isPowerlifting: false,
    isYoga: false,
    isCardio: false,
    isStrength: false,
    isFunctional: false,
    isStretching: false,
    isRecovery: false,
    isEndurance: false,
    isMobility: false,
  };

  if (workoutName) {
    const nameWords = workoutName.toLowerCase();
    // More specific pattern matching with explicit workout type detection
    workoutContext.isHIIT = /hiit|high.intensity|metabolic|blast|circuit/.test(
      nameWords
    );
    workoutContext.isPowerlifting =
      /powerlifting|max.*strength|heavy|compound/.test(nameWords);
    workoutContext.isStretching =
      /stretch|recovery.*stretch|deep.*stretch/.test(nameWords);
    workoutContext.isRecovery = /recovery|rest|restore|relax/.test(nameWords);
    workoutContext.isMobility = /mobility|flow|morning.*mobility/.test(
      nameWords
    );
    workoutContext.isYoga = /yoga|flow.*yoga|yoga.*flow/.test(nameWords);
    // Enhanced cardio/endurance detection
    workoutContext.isEndurance =
      /endurance|stamina|distance|long.*run|marathon|aerobic.*power/.test(
        nameWords
      );
    workoutContext.isCardio =
      /cardio|running|cycling|bike.*ride|swimming|aerobic/.test(nameWords);
    // Enhanced strength training detection
    workoutContext.isStrength =
      /mass.*builder|hypertrophy|muscle.*building|strength.*block|pull.*day|push.*day|leg.*day/.test(
        nameWords
      );
    workoutContext.isFunctional = /functional|athletic|performance/.test(
      nameWords
    );
  }

  if (category) {
    const categoryLower = category.toLowerCase();
    workoutContext.isHIIT =
      workoutContext.isHIIT || categoryLower.includes("hiit");
    workoutContext.isCardio =
      workoutContext.isCardio || categoryLower.includes("cardio");
    workoutContext.isStrength =
      workoutContext.isStrength || categoryLower.includes("strength");
    workoutContext.isYoga =
      workoutContext.isYoga || categoryLower.includes("flexibility");
  }

  // Count muscle groups and analyze exercise patterns
  const muscleGroupCounts: Record<string, number> = {};
  let cardioExercises = 0;
  let strengthExercises = 0;
  let compoundExercises = 0;

  exercises.forEach((exercise) => {
    if (exercise.muscleGroup) {
      const normalized = exercise.muscleGroup
        .toLowerCase()
        .replace(/\s+/g, "_");
      muscleGroupCounts[normalized] = (muscleGroupCounts[normalized] || 0) + 1;
    }

    if (exercise.name) {
      const exerciseName = exercise.name.toLowerCase();

      // Cardio exercise patterns
      const cardioPatterns = [
        "running",
        "treadmill",
        "bike",
        "cycling",
        "elliptical",
        "rowing",
        "jump",
        "burpee",
        "mountain climber",
        "high knees",
        "jumping jacks",
        "battle rope",
        "jump rope",
        "step-up",
        "box jump",
      ];

      // Strength exercise patterns
      const strengthPatterns = [
        "press",
        "curl",
        "squat",
        "deadlift",
        "bench",
        "row",
        "pull-up",
        "dip",
        "raise",
        "extension",
        "fly",
        "thrust",
      ];

      // Compound exercise patterns
      const compoundPatterns = [
        "deadlift",
        "squat",
        "clean",
        "snatch",
        "thruster",
        "burpee",
        "turkish get-up",
        "farmer",
        "sled",
        "kettlebell swing",
      ];

      if (cardioPatterns.some((term) => exerciseName.includes(term))) {
        cardioExercises++;
      }

      if (strengthPatterns.some((term) => exerciseName.includes(term))) {
        strengthExercises++;
      }

      if (compoundPatterns.some((term) => exerciseName.includes(term))) {
        compoundExercises++;
      }
    }
  });

  // Determine workout type with enhanced priority system
  const totalExercises = exercises.length;
  const uniqueMuscleGroups = Object.keys(muscleGroupCounts).length;

  // 1. Stretching/Recovery priority (highest - most specific)
  if (
    workoutContext.isStretching ||
    workoutContext.isRecovery ||
    workoutContext.isMobility
  ) {
    return getUniqueImageFromSet(
      exerciseImageStorage.core,
      exerciseImageStorage.core.fallbackImage
    );
  }

  // 2. Yoga/Flexibility priority
  if (workoutContext.isYoga) {
    return getUniqueImageFromSet(
      exerciseImageStorage.core,
      exerciseImageStorage.core.fallbackImage
    );
  }

  // 3. Endurance/Distance training priority (including Aerobic Power)
  if (workoutContext.isEndurance || workoutContext.isCardio) {
    return getUniqueImageFromSet(
      exerciseImageStorage.cardio,
      exerciseImageStorage.cardio.fallbackImage
    );
  }

  // 4. HIIT/High Intensity priority
  if (workoutContext.isHIIT || cardioExercises > totalExercises * 0.5) {
    return getUniqueImageFromSet(
      exerciseImageStorage.cardio,
      exerciseImageStorage.cardio.fallbackImage
    );
  }

  // 5. Strength Training priority (Mass builders, Hypertrophy, Pull/Push Days)
  if (workoutContext.isStrength || strengthExercises > totalExercises * 0.6) {
    // Check if it's specifically a pull day (back-focused)
    if (workoutName && /pull.*day/.test(workoutName.toLowerCase())) {
      return getUniqueImageFromSet(
        exerciseImageStorage.back,
        exerciseImageStorage.back.fallbackImage
      );
    }
    // Check if it's specifically a push day (chest/shoulders-focused)
    if (workoutName && /push.*day/.test(workoutName.toLowerCase())) {
      return getUniqueImageFromSet(
        exerciseImageStorage.chest,
        exerciseImageStorage.chest.fallbackImage
      );
    }
    // General strength training
    return getUniqueImageFromSet(
      exerciseImageStorage.full_body,
      exerciseImageStorage.full_body.fallbackImage
    );
  }

  // 6. Full body/Compound priority
  if (
    uniqueMuscleGroups >= 3 ||
    compoundExercises > totalExercises * 0.3 ||
    workoutContext.isFunctional
  ) {
    return getUniqueImageFromSet(
      exerciseImageStorage.full_body,
      exerciseImageStorage.full_body.fallbackImage
    );
  }

  // 8. Dominant muscle group selection
  const dominantMuscleGroup = Object.entries(muscleGroupCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  if (dominantMuscleGroup) {
    // Map common variations to our muscle groups
    const muscleGroupMapping: Record<string, MuscleGroup> = {
      full_body: "full_body",
      "full body": "full_body",
      chest: "chest",
      pecs: "chest",
      back: "back",
      lats: "back",
      shoulders: "shoulders",
      deltoids: "shoulders",
      arms: "arms",
      biceps: "arms",
      triceps: "arms",
      legs: "legs",
      quads: "legs",
      quadriceps: "legs",
      hamstrings: "legs",
      calves: "legs",
      glutes: "glutes",
      glute: "glutes",
      core: "core",
      abs: "core",
      abdominals: "core",
      cardio: "cardio",
    };

    const mappedMuscleGroup =
      muscleGroupMapping[dominantMuscleGroup] || "full_body";
    const imageSet = exerciseImageStorage[mappedMuscleGroup];

    if (imageSet) {
      return getUniqueImageFromSet(imageSet, imageSet.fallbackImage);
    }
  }

  // 9. Absolute fallback - ensure we always return an image
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

/**
 * Test function to validate image diversity for default workouts
 * @param workouts - Array of workout templates to test
 * @returns Analysis of image diversity and uniqueness
 */
export const analyzeImageDiversity = async (
  workouts: Array<{
    name: string;
    category?: string;
    exercises: Array<{ name: string; muscleGroup: string }>;
  }>
): Promise<{
  totalWorkouts: number;
  uniqueImages: number;
  duplicateImages: Record<string, string[]>;
  diversityScore: number;
}> => {
  resetUsedImagesTracker();
  const imageUsage: Record<string, string[]> = {};

  // Process workouts sequentially to get images
  for (const workout of workouts) {
    const exerciseData = workout.exercises.map((ex) => ({
      name: ex.name,
      muscleGroup: ex.muscleGroup,
    }));

    const selectedImage = await getImageForWorkout(
      exerciseData,
      workout.name,
      workout.category
    );

    if (!imageUsage[selectedImage]) {
      imageUsage[selectedImage] = [];
    }
    imageUsage[selectedImage].push(workout.name);
  }

  const uniqueImages = Object.keys(imageUsage).length;
  const duplicateImages: Record<string, string[]> = {};

  Object.entries(imageUsage).forEach(([image, workoutNames]) => {
    if (workoutNames.length > 1) {
      duplicateImages[image] = workoutNames;
    }
  });

  const diversityScore = (uniqueImages / workouts.length) * 100;

  return {
    totalWorkouts: workouts.length,
    uniqueImages,
    duplicateImages,
    diversityScore: Math.round(diversityScore * 100) / 100,
  };
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
