import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

// Comprehensive exercise database
const exerciseData = [
  // Chest Exercises
  {
    name: "Push-ups",
    description: "Classic bodyweight chest exercise",
    muscleGroup: "chest",
    difficulty: "beginner",
    instructions: "Start in plank position, lower chest to floor, push back up",
  },
  {
    name: "Bench Press",
    description: "Barbell chest press on bench",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions:
      "Lie on bench, press barbell from chest to full arm extension",
  },
  {
    name: "Dumbbell Flyes",
    description: "Chest isolation with dumbbells",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions:
      "Lie on bench, open arms wide with dumbbells, squeeze chest together",
  },
  {
    name: "Incline Bench Press",
    description: "Upper chest focus with inclined bench",
    muscleGroup: "chest",
    difficulty: "intermediate",
    instructions: "Bench press on 30-45 degree incline",
  },

  // Back Exercises
  {
    name: "Pull-ups",
    description: "Bodyweight back and bicep exercise",
    muscleGroup: "back",
    difficulty: "intermediate",
    instructions: "Hang from bar, pull body up until chin clears bar",
  },
  {
    name: "Lat Pulldowns",
    description: "Machine-based latissimus dorsi exercise",
    muscleGroup: "back",
    difficulty: "beginner",
    instructions: "Pull bar down to chest while keeping torso upright",
  },
  {
    name: "Bent-over Rows",
    description: "Compound pulling exercise with barbell or dumbbells",
    muscleGroup: "back",
    difficulty: "intermediate",
    instructions: "Bend over, pull weight to lower chest/upper abdomen",
  },
  {
    name: "Deadlifts",
    description: "Full body compound exercise",
    muscleGroup: "back",
    difficulty: "advanced",
    instructions: "Lift barbell from floor to hip level with straight back",
  },

  // Leg Exercises
  {
    name: "Squats",
    description: "Fundamental lower body exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Lower hips back and down, keep knees tracking over toes",
  },
  {
    name: "Lunges",
    description: "Single-leg strength and stability",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Step forward, lower back knee toward ground",
  },
  {
    name: "Leg Press",
    description: "Machine-based quad and glute exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Push weight plate with feet from seated position",
  },
  {
    name: "Leg Curls",
    description: "Hamstring isolation exercise",
    muscleGroup: "legs",
    difficulty: "beginner",
    instructions: "Curl weight toward glutes using hamstrings",
  },

  // Shoulder Exercises
  {
    name: "Shoulder Press",
    description: "Overhead pressing movement",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    instructions: "Press weights overhead from shoulder level",
  },
  {
    name: "Lateral Raises",
    description: "Side deltoid isolation",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    instructions: "Raise arms to sides until parallel with floor",
  },
  {
    name: "Front Raises",
    description: "Anterior deltoid isolation",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    instructions: "Raise arms to front until parallel with floor",
  },
  {
    name: "Rear Delt Flyes",
    description: "Posterior deltoid isolation",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    instructions: "Bend over, raise arms to sides squeezing shoulder blades",
  },

  // Arm Exercises
  {
    name: "Bicep Curls",
    description: "Basic bicep isolation exercise",
    muscleGroup: "arms",
    difficulty: "beginner",
    instructions: "Curl weight toward shoulder, control the descent",
  },
  {
    name: "Tricep Dips",
    description: "Bodyweight tricep exercise",
    muscleGroup: "arms",
    difficulty: "intermediate",
    instructions: "Lower and raise body using tricep strength",
  },
  {
    name: "Hammer Curls",
    description: "Neutral grip bicep exercise",
    muscleGroup: "arms",
    difficulty: "beginner",
    instructions: "Curl with neutral (hammer) grip",
  },
  {
    name: "Tricep Extensions",
    description: "Overhead tricep isolation",
    muscleGroup: "arms",
    difficulty: "intermediate",
    instructions: "Extend weight overhead, lower behind head",
  },

  // Core Exercises
  {
    name: "Plank",
    description: "Isometric core strengthening",
    muscleGroup: "core",
    difficulty: "beginner",
    instructions: "Hold straight line from head to heels",
  },
  {
    name: "Crunches",
    description: "Basic abdominal exercise",
    muscleGroup: "core",
    difficulty: "beginner",
    instructions: "Contract abs to lift shoulders off ground",
  },
  {
    name: "Russian Twists",
    description: "Rotational core exercise",
    muscleGroup: "core",
    difficulty: "intermediate",
    instructions: "Rotate torso side to side while balancing",
  },
  {
    name: "Mountain Climbers",
    description: "Dynamic core and cardio exercise",
    muscleGroup: "core",
    difficulty: "intermediate",
    instructions: "Alternate bringing knees to chest in plank position",
  },

  // Cardio Exercises
  {
    name: "Running",
    description: "Cardiovascular endurance exercise",
    muscleGroup: "cardio",
    difficulty: "beginner",
    instructions: "Maintain steady pace, focus on breathing and form",
  },
  {
    name: "Jump Rope",
    description: "High-intensity cardio with coordination",
    muscleGroup: "cardio",
    difficulty: "intermediate",
    instructions: "Jump over rope with minimal foot lift",
  },
  {
    name: "Burpees",
    description: "Full body explosive movement",
    muscleGroup: "cardio",
    difficulty: "advanced",
    instructions: "Squat, jump back to plank, push-up, jump forward, jump up",
  },
  {
    name: "High Knees",
    description: "In-place cardio exercise",
    muscleGroup: "cardio",
    difficulty: "beginner",
    instructions: "Run in place bringing knees to waist level",
  },

  // Glute Exercises
  {
    name: "Hip Thrusts",
    description: "Glute isolation with hip extension",
    muscleGroup: "glutes",
    difficulty: "intermediate",
    instructions: "Thrust hips up from seated position with weight on lap",
  },
  {
    name: "Glute Bridges",
    description: "Bodyweight glute activation",
    muscleGroup: "glutes",
    difficulty: "beginner",
    instructions: "Lift hips up from lying position, squeeze glutes",
  },
  {
    name: "Bulgarian Split Squats",
    description: "Single-leg squat variation",
    muscleGroup: "glutes",
    difficulty: "intermediate",
    instructions: "Rear foot elevated, squat down on front leg",
  },
  {
    name: "Clamshells",
    description: "Hip abductor strengthening",
    muscleGroup: "glutes",
    difficulty: "beginner",
    instructions: "Lie on side, open and close top leg like clamshell",
  },
];

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if exercises already exist to avoid duplicates
    const existingCount = await prisma.exercise.count();

    if (existingCount > 0) {
      return NextResponse.json({
        message: "Exercises already seeded",
        count: existingCount,
      });
    }

    // Create all exercises
    const created = await prisma.exercise.createMany({
      data: exerciseData.map((exercise) => ({
        ...exercise,
        userId: null, // System exercises, not user-created
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Exercises seeded successfully",
      created: created.count,
    });
  } catch (error) {
    console.error("Error seeding exercises:", error);
    return NextResponse.json(
      { error: "Failed to seed exercises" },
      { status: 500 }
    );
  }
}
