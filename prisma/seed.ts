import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample exercises for different muscle groups
  const exercises = [
    // Chest exercises
    {
      name: "Push-ups",
      description: "Classic bodyweight chest exercise",
      muscleGroup: "chest",
      difficulty: "beginner",
      instructions: "Start in plank position, lower body to ground, push back up"
    },
    {
      name: "Bench Press",
      description: "Barbell chest press on bench",
      muscleGroup: "chest", 
      difficulty: "intermediate",
      instructions: "Lie on bench, grip bar, lower to chest, press up"
    },
    {
      name: "Incline Dumbbell Press",
      description: "Dumbbell press on inclined bench",
      muscleGroup: "chest",
      difficulty: "intermediate", 
      instructions: "Set bench to 30-45 degrees, press dumbbells from chest level"
    },
    {
      name: "Chest Dips",
      description: "Bodyweight chest exercise on parallel bars",
      muscleGroup: "chest",
      difficulty: "intermediate",
      instructions: "Support body on bars, lower down, push back up"
    },

    // Back exercises  
    {
      name: "Pull-ups",
      description: "Upper body pulling exercise",
      muscleGroup: "back",
      difficulty: "intermediate",
      instructions: "Hang from bar, pull body up until chin over bar"
    },
    {
      name: "Bent-over Rows",
      description: "Barbell rowing exercise",
      muscleGroup: "back",
      difficulty: "intermediate", 
      instructions: "Bend over with bar, pull to lower chest, control down"
    },
    {
      name: "Lat Pulldowns",
      description: "Cable machine lat exercise",
      muscleGroup: "back",
      difficulty: "beginner",
      instructions: "Sit at machine, pull bar down to upper chest"
    },
    {
      name: "Deadlifts",
      description: "Full body compound lift",
      muscleGroup: "back", 
      difficulty: "advanced",
      instructions: "Lift bar from ground to standing position, keep back straight"
    },

    // Legs exercises
    {
      name: "Squats", 
      description: "Fundamental leg exercise",
      muscleGroup: "legs",
      difficulty: "beginner",
      instructions: "Stand with feet shoulder-width, sit back and down, stand up"
    },
    {
      name: "Lunges",
      description: "Single leg strengthening exercise", 
      muscleGroup: "legs",
      difficulty: "beginner",
      instructions: "Step forward, lower back knee, push back to start"
    },
    {
      name: "Leg Press",
      description: "Machine-based leg exercise",
      muscleGroup: "legs",
      difficulty: "beginner",
      instructions: "Sit on machine, place feet on platform, press weight"
    },
    {
      name: "Romanian Deadlifts",
      description: "Hip hinge movement for hamstrings",
      muscleGroup: "legs",
      difficulty: "intermediate", 
      instructions: "Hold bar, hinge at hips, lower with straight legs"
    },

    // Shoulders exercises
    {
      name: "Shoulder Press",
      description: "Overhead pressing movement",
      muscleGroup: "shoulders",
      difficulty: "beginner", 
      instructions: "Press weight from shoulder level to overhead"
    },
    {
      name: "Lateral Raises",
      description: "Side deltoid isolation",
      muscleGroup: "shoulders",
      difficulty: "beginner",
      instructions: "Raise arms to sides until parallel to ground"
    },
    {
      name: "Face Pulls", 
      description: "Rear deltoid and upper back exercise",
      muscleGroup: "shoulders",
      difficulty: "beginner",
      instructions: "Pull cable to face level, squeeze shoulder blades"
    },
    {
      name: "Pike Push-ups",
      description: "Bodyweight shoulder exercise",
      muscleGroup: "shoulders", 
      difficulty: "intermediate",
      instructions: "Start in downward dog, lower head to ground, push up"
    },

    // Arms exercises  
    {
      name: "Bicep Curls",
      description: "Classic bicep isolation exercise",
      muscleGroup: "arms",
      difficulty: "beginner",
      instructions: "Curl weight from extended arm to shoulder level"
    },
    {
      name: "Tricep Dips",
      description: "Bodyweight tricep exercise", 
      muscleGroup: "arms",
      difficulty: "beginner",
      instructions: "Support body on chair/bench, lower and raise body"
    },
    {
      name: "Hammer Curls",
      description: "Neutral grip bicep exercise",
      muscleGroup: "arms",
      difficulty: "beginner", 
      instructions: "Curl with neutral grip, thumbs pointing up"
    },
    {
      name: "Overhead Tricep Extension",
      description: "Tricep isolation exercise",
      muscleGroup: "arms",
      difficulty: "intermediate",
      instructions: "Hold weight overhead, lower behind head, extend up"
    },

    // Core exercises
    {
      name: "Plank",
      description: "Isometric core strengthening",
      muscleGroup: "core", 
      difficulty: "beginner",
      instructions: "Hold body straight in push-up position"
    },
    {
      name: "Crunches",
      description: "Basic abdominal exercise",
      muscleGroup: "core",
      difficulty: "beginner",
      instructions: "Lie down, lift shoulders off ground toward knees"
    },
    {
      name: "Russian Twists",
      description: "Rotational core exercise",
      muscleGroup: "core",
      difficulty: "intermediate", 
      instructions: "Sit with knees bent, rotate torso side to side"
    },
    {
      name: "Dead Bug",
      description: "Core stability exercise",
      muscleGroup: "core",
      difficulty: "beginner",
      instructions: "Lie on back, extend opposite arm and leg, alternate"
    },
    
    // Glutes exercises
    {
      name: "Hip Thrusts",
      description: "Primary glute activation exercise",
      muscleGroup: "glutes",
      difficulty: "beginner",
      instructions: "Lie on back with knees bent, lift hips up by squeezing glutes"
    },
    {
      name: "Bulgarian Split Squats",
      description: "Single-leg glute and quad exercise",
      muscleGroup: "glutes",
      difficulty: "intermediate",
      instructions: "Rear foot elevated, lunge down on front leg, focus on glute activation"
    },
    {
      name: "Glute Bridges",
      description: "Basic glute strengthening",
      muscleGroup: "glutes",
      difficulty: "beginner",
      instructions: "Lie on back, lift hips by squeezing glutes, hold briefly"
    },
    {
      name: "Curtsy Lunges",
      description: "Lateral glute activation",
      muscleGroup: "glutes",
      difficulty: "intermediate",
      instructions: "Step one leg back and across behind the other, lunge down"
    },
    {
      name: "Clamshells",
      description: "Glute medius strengthening",
      muscleGroup: "glutes",
      difficulty: "beginner",
      instructions: "Lie on side, knees bent, lift top knee while keeping feet together"
    },
    
    // Full body exercises
    {
      name: "Burpees",
      description: "High-intensity full body exercise",
      muscleGroup: "full body",
      difficulty: "intermediate",
      instructions: "Squat down, jump back to plank, do push-up, jump feet to hands, jump up"
    },
    {
      name: "Mountain Climbers",
      description: "Cardio and core full body exercise",
      muscleGroup: "full body",
      difficulty: "intermediate", 
      instructions: "Plank position, alternate bringing knees to chest rapidly"
    },
    {
      name: "Thrusters",
      description: "Squat to overhead press combination",
      muscleGroup: "full body",
      difficulty: "intermediate",
      instructions: "Hold weights, squat down, stand and press weights overhead"
    },
    {
      name: "Turkish Get-ups",
      description: "Complex full body movement",
      muscleGroup: "full body",
      difficulty: "advanced",
      instructions: "Lie down with weight, get to standing position in controlled steps"
    },
    {
      name: "Bear Crawls",
      description: "Full body stability and strength",
      muscleGroup: "full body",
      difficulty: "intermediate",
      instructions: "Crawl forward on hands and feet, keeping knees slightly off ground"
    },
    {
      name: "Man Makers",
      description: "Burpee variation with weights",
      muscleGroup: "full body",
      difficulty: "advanced",
      instructions: "Burpee with dumbbells, add row at bottom and overhead press at top"
    }
  ];

  // Create exercises (check if they exist first)
  for (const exercise of exercises) {
    const existingExercise = await prisma.exercise.findFirst({
      where: { name: exercise.name }
    });
    
    if (!existingExercise) {
      await prisma.exercise.create({
        data: exercise
      });
    }
  }

  console.log('✅ Database seeded with sample exercises');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });