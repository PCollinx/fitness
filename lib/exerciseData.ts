// Shared exercise data used by both Prisma seed and API seed
export const exerciseData = [
  // Chest exercises
  {
    name: "Push-ups",
    description: "Classic bodyweight chest exercise",
    muscleGroup: "chest",
    difficulty: "beginner",
    instructions: "Start in plank position, lower body to ground, push back up",
  },
  {
    name: "Bench Press",
    description: "Barbell chest press on bench",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions: "Lie on bench, grip bar, lower to chest, press up",
  },
  {
    name: "Incline Dumbbell Press",
    description: "Dumbbell press on inclined bench",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions: "Set bench to 30-45 degrees, press dumbbells up and forward",
  },
  {
    name: "Dips",
    description: "Bodyweight chest exercise on parallel bars",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions:
      "Support body on bars, lower until shoulders below elbows, push up",
  },

  // Back exercises
  {
    name: "Pull-ups",
    description: "Bodyweight back exercise",
    muscleGroup: "back",
    difficulty: "intermediate",
    instructions: "Hang from bar, pull body up until chin clears bar",
  },
  {
    name: "Bent-over Rows",
    description: "Barbell rowing exercise",
    muscleGroup: "back",
    difficulty: "intermediate",
    instructions:
      "Bend at hips, pull bar to lower chest, squeeze shoulder blades",
  },
  {
    name: "Lat Pulldowns",
    description: "Machine-based lat exercise",
    muscleGroup: "back",
    difficulty: "beginner",
    instructions: "Sit at machine, pull bar to upper chest",
  },
  {
    name: "Deadlifts",
    description: "Compound barbell exercise",
    muscleGroup: "back",
    difficulty: "advanced",
    instructions:
      "Feet hip-width apart, grip bar, drive through heels to stand",
  },

  // Legs exercises
  {
    name: "Squats",
    description: "Bodyweight leg exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Stand shoulder-width apart, lower as if sitting in chair",
  },
  {
    name: "Lunges",
    description: "Single-leg bodyweight exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Step forward, lower back knee toward ground, push back",
  },
  {
    name: "Leg Press",
    description: "Machine-based leg exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions:
      "Sit in machine, lower weight until knees at 90 degrees, press up",
  },
  {
    name: "Romanian Deadlifts",
    description: "Hip hinge movement with barbell",
    muscleGroup: "legs",
    difficulty: "intermediate",
    instructions:
      "Hold bar, hinge at hips, lower bar close to legs, return to standing",
  },
  {
    name: "Calf Raises",
    description: "Bodyweight calf exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Rise onto toes as high as possible, hold, lower slowly",
  },

  // Shoulders exercises
  {
    name: "Overhead Press",
    description: "Barbell shoulder press",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    instructions: "Bar at shoulder height, press straight up overhead",
  },
  {
    name: "Lateral Raises",
    description: "Dumbbell shoulder isolation",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    instructions:
      "Hold dumbbells at sides, raise out to sides until parallel to floor",
  },
  {
    name: "Front Raises",
    description: "Anterior deltoid exercise",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    instructions:
      "Hold dumbbells in front, raise one arm forward until parallel",
  },
  {
    name: "Rear Delt Flyes",
    description: "Posterior deltoid exercise",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    instructions:
      "Bend forward, raise weights out to sides, squeeze shoulder blades",
  },

  // Arms exercises
  {
    name: "Bicep Curls",
    description: "Basic bicep exercise",
    muscleGroup: "arms",
    difficulty: "beginner",
    instructions: "Hold dumbbells at sides, curl up to shoulders",
  },
  {
    name: "Tricep Dips",
    description: "Bodyweight tricep exercise",
    muscleGroup: "arms",
    difficulty: "beginner",
    instructions:
      "Sit on edge of bench, lower body by bending elbows, push back up",
  },
  {
    name: "Hammer Curls",
    description: "Neutral grip bicep exercise",
    muscleGroup: "arms",
    difficulty: "beginner",
    instructions: "Hold dumbbells with palms facing each other, curl up",
  },
  {
    name: "Tricep Extensions",
    description: "Overhead tricep exercise",
    muscleGroup: "arms",
    difficulty: "intermediate",
    instructions: "Hold dumbbell overhead, lower behind head, extend back up",
  },

  // Core exercises
  {
    name: "Plank",
    description: "Isometric core exercise",
    muscleGroup: "core",
    difficulty: "beginner",
    instructions:
      "Hold push-up position, body in straight line, keep core tight",
  },
  {
    name: "Crunches",
    description: "Basic abdominal exercise",
    muscleGroup: "core",
    difficulty: "beginner",
    instructions: "Lie on back with knees bent, lift shoulders off ground",
  },
  {
    name: "Russian Twists",
    description: "Rotational core exercise",
    muscleGroup: "core",
    difficulty: "intermediate",
    instructions: "Sit with knees bent, lean back, rotate torso side to side",
  },
  {
    name: "Mountain Climbers",
    description: "Dynamic core and cardio exercise",
    muscleGroup: "core",
    difficulty: "intermediate",
    instructions:
      "Plank position, alternate bringing knees to chest in running motion",
  },

  // Cardio exercises
  {
    name: "Jumping Jacks",
    description: "Full-body cardio exercise",
    muscleGroup: "cardio",
    difficulty: "beginner",
    instructions: "Jump while spreading legs and raising arms overhead",
  },
  {
    name: "Burpees",
    description: "High-intensity full-body exercise",
    muscleGroup: "full body",
    difficulty: "advanced",
    instructions:
      "Squat, kick back to plank, push-up, jump feet back, jump up with arms overhead",
  },
  {
    name: "High Knees",
    description: "Running in place with high knees",
    muscleGroup: "cardio",
    difficulty: "beginner",
    instructions: "Run in place lifting knees high toward chest",
  },
  {
    name: "Running",
    description: "Cardiovascular endurance exercise",
    muscleGroup: "cardio",
    difficulty: "beginner",
    instructions: "Maintain steady pace, land on midfoot, slight forward lean",
  },
];
