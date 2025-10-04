export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";
import { getSmartWorkoutImage } from "@/app/utils/workoutImageRecommendation";

// Fitness Goal aligned workouts - 4 workouts per goal type
const defaultWorkouts = {
  // Weight Loss - High intensity, calorie burning workouts
  "weight-loss": [
    {
      name: "Fat Burner HIIT",
      description: "High-intensity interval training designed to maximize calorie burn and boost metabolism",
      category: "HIIT",
      exercises: [
        { name: "Burpees", muscleGroup: "full body", sets: 4, reps: 12, order: 1 },
        { name: "Mountain Climbers", muscleGroup: "full body", sets: 4, reps: 20, order: 2 },
        { name: "Jump Squats", muscleGroup: "legs", sets: 4, reps: 15, order: 3 },
        { name: "Push-ups", muscleGroup: "chest", sets: 4, reps: 10, order: 4 },
      ]
    },
    {
      name: "Cardio Power Blast",
      description: "Dynamic cardio workout to torch calories and improve endurance",
      category: "Cardio",
      exercises: [
        { name: "High Knees", muscleGroup: "legs", sets: 3, reps: 30, order: 1 },
        { name: "Jumping Jacks", muscleGroup: "full body", sets: 3, reps: 25, order: 2 },
        { name: "Bear Crawls", muscleGroup: "full body", sets: 3, reps: 10, order: 3 },
        { name: "Plank Jacks", muscleGroup: "core", sets: 3, reps: 15, order: 4 },
      ]
    },
    {
      name: "Metabolic Meltdown",
      description: "Full-body metabolic workout to accelerate fat loss and build lean muscle",
      category: "HIIT",
      exercises: [
        { name: "Thrusters", muscleGroup: "full body", sets: 4, reps: 12, order: 1 },
        { name: "Battle Ropes", muscleGroup: "full body", sets: 4, reps: 30, order: 2 },
        { name: "Box Jumps", muscleGroup: "legs", sets: 4, reps: 10, order: 3 },
        { name: "Russian Twists", muscleGroup: "core", sets: 4, reps: 20, order: 4 },
      ]
    },
    {
      name: "Lean Body Circuit", 
      description: "Circuit training focused on building lean muscle while burning fat",
      category: "Strength",
      exercises: [
        { name: "Squat to Press", muscleGroup: "full body", sets: 3, reps: 15, order: 1 },
        { name: "Renegade Rows", muscleGroup: "back", sets: 3, reps: 12, order: 2 },
        { name: "Lunge with Twist", muscleGroup: "legs", sets: 3, reps: 14, order: 3 },
        { name: "Pike Push-ups", muscleGroup: "shoulders", sets: 3, reps: 10, order: 4 },
      ]
    }
  ],

  // Weight Gain - Strength focused, muscle building workouts
  "weight-gain": [
    {
      name: "Mass Builder Upper",
      description: "Upper body focused workout designed to build muscle mass and strength",
      category: "Strength",
      exercises: [
        { name: "Bench Press", muscleGroup: "chest", sets: 4, reps: 8, order: 1 },
        { name: "Bent-Over Rows", muscleGroup: "back", sets: 4, reps: 8, order: 2 },
        { name: "Overhead Press", muscleGroup: "shoulders", sets: 4, reps: 10, order: 3 },
        { name: "Barbell Curls", muscleGroup: "arms", sets: 3, reps: 12, order: 4 },
      ]
    },
    {
      name: "Power Leg Builder",
      description: "Lower body mass building workout with compound movements",
      category: "Strength", 
      exercises: [
        { name: "Squats", muscleGroup: "legs", sets: 5, reps: 6, order: 1 },
        { name: "Deadlifts", muscleGroup: "legs", sets: 4, reps: 8, order: 2 },
        { name: "Bulgarian Split Squats", muscleGroup: "glutes", sets: 3, reps: 12, order: 3 },
        { name: "Calf Raises", muscleGroup: "legs", sets: 4, reps: 15, order: 4 },
      ]
    },
    {
      name: "Full Body Mass",
      description: "Complete full-body workout for maximum muscle growth stimulus",
      category: "Strength",
      exercises: [
        { name: "Deadlifts", muscleGroup: "back", sets: 4, reps: 6, order: 1 },
        { name: "Squats", muscleGroup: "legs", sets: 4, reps: 8, order: 2 },
        { name: "Pull-ups", muscleGroup: "back", sets: 3, reps: 10, order: 3 },
        { name: "Dips", muscleGroup: "chest", sets: 3, reps: 12, order: 4 },
      ]
    },
    {
      name: "Hypertrophy Focus",
      description: "Muscle hypertrophy workout with time under tension emphasis",
      category: "Strength",
      exercises: [
        { name: "Incline Dumbbell Press", muscleGroup: "chest", sets: 4, reps: 10, order: 1 },
        { name: "Cable Rows", muscleGroup: "back", sets: 4, reps: 12, order: 2 },
        { name: "Leg Press", muscleGroup: "legs", sets: 4, reps: 15, order: 3 },
        { name: "Tricep Dips", muscleGroup: "arms", sets: 3, reps: 12, order: 4 },
      ]
    }
  ],

  // Muscle Building - Bodybuilding style workouts
  "muscle-building": [
    {
      name: "Push Day Power",
      description: "Push movement focused workout for chest, shoulders, and triceps",
      category: "Strength",
      exercises: [
        { name: "Bench Press", muscleGroup: "chest", sets: 4, reps: 8, order: 1 },
        { name: "Overhead Press", muscleGroup: "shoulders", sets: 4, reps: 10, order: 2 },
        { name: "Incline Dumbbell Press", muscleGroup: "chest", sets: 3, reps: 12, order: 3 },
        { name: "Tricep Extensions", muscleGroup: "arms", sets: 3, reps: 15, order: 4 },
      ]
    },
    {
      name: "Pull Day Strength",
      description: "Pull movement workout targeting back and biceps for muscle growth",
      category: "Strength",
      exercises: [
        { name: "Pull-ups", muscleGroup: "back", sets: 4, reps: 8, order: 1 },
        { name: "Barbell Rows", muscleGroup: "back", sets: 4, reps: 10, order: 2 },
        { name: "Lat Pulldowns", muscleGroup: "back", sets: 3, reps: 12, order: 3 },
        { name: "Hammer Curls", muscleGroup: "arms", sets: 3, reps: 15, order: 4 },
      ]
    },
    {
      name: "Leg Day Beast",
      description: "Comprehensive leg workout for maximum muscle development",
      category: "Strength",
      exercises: [
        { name: "Squats", muscleGroup: "legs", sets: 5, reps: 8, order: 1 },
        { name: "Romanian Deadlifts", muscleGroup: "legs", sets: 4, reps: 10, order: 2 },
        { name: "Walking Lunges", muscleGroup: "legs", sets: 3, reps: 16, order: 3 },
        { name: "Leg Curls", muscleGroup: "legs", sets: 3, reps: 15, order: 4 },
      ]
    },
    {
      name: "Arms & Shoulders",
      description: "Focused arm and shoulder workout for definition and size",
      category: "Strength",
      exercises: [
        { name: "Shoulder Press", muscleGroup: "shoulders", sets: 4, reps: 10, order: 1 },
        { name: "Barbell Curls", muscleGroup: "arms", sets: 4, reps: 12, order: 2 },
        { name: "Tricep Dips", muscleGroup: "arms", sets: 3, reps: 15, order: 3 },
        { name: "Lateral Raises", muscleGroup: "shoulders", sets: 3, reps: 15, order: 4 },
      ]
    }
  ],

  // Strength Training - Powerlifting/strength focused
  "strength-training": [
    {
      name: "Powerlifting Basics",
      description: "Foundation powerlifting workout focusing on the big three lifts",
      category: "Strength",
      exercises: [
        { name: "Squats", muscleGroup: "legs", sets: 5, reps: 5, order: 1 },
        { name: "Bench Press", muscleGroup: "chest", sets: 5, reps: 5, order: 2 },
        { name: "Deadlifts", muscleGroup: "back", sets: 3, reps: 5, order: 3 },
        { name: "Overhead Press", muscleGroup: "shoulders", sets: 3, reps: 8, order: 4 },
      ]
    },
    {
      name: "Heavy Compound",
      description: "Heavy compound movements for maximum strength development",
      category: "Strength",
      exercises: [
        { name: "Deadlifts", muscleGroup: "back", sets: 5, reps: 3, order: 1 },
        { name: "Front Squats", muscleGroup: "legs", sets: 4, reps: 6, order: 2 },
        { name: "Weighted Pull-ups", muscleGroup: "back", sets: 4, reps: 8, order: 3 },
        { name: "Close-Grip Bench", muscleGroup: "chest", sets: 3, reps: 10, order: 4 },
      ]
    },
    {
      name: "Functional Strength",
      description: "Functional movement patterns for real-world strength",
      category: "Strength",
      exercises: [
        { name: "Farmers Walk", muscleGroup: "full body", sets: 3, reps: 50, order: 1 },
        { name: "Turkish Get-ups", muscleGroup: "full body", sets: 3, reps: 8, order: 2 },
        { name: "Sled Push", muscleGroup: "legs", sets: 4, reps: 20, order: 3 },
        { name: "Kettlebell Swings", muscleGroup: "glutes", sets: 4, reps: 20, order: 4 },
      ]
    },
    {
      name: "Max Strength Block",
      description: "Low rep, high weight training for peak strength development",
      category: "Strength", 
      exercises: [
        { name: "Box Squats", muscleGroup: "legs", sets: 6, reps: 3, order: 1 },
        { name: "Floor Press", muscleGroup: "chest", sets: 5, reps: 5, order: 2 },
        { name: "Rack Pulls", muscleGroup: "back", sets: 4, reps: 3, order: 3 },
        { name: "Push Press", muscleGroup: "shoulders", sets: 4, reps: 6, order: 4 },
      ]
    }
  ],

  // Endurance - Cardio and stamina focused
  "endurance": [
    {
      name: "Cardio Endurance",
      description: "Steady-state cardio workout to build aerobic capacity",
      category: "Cardio",
      exercises: [
        { name: "Treadmill Run", muscleGroup: "legs", sets: 1, reps: 30, order: 1 },
        { name: "Rowing Machine", muscleGroup: "full body", sets: 3, reps: 10, order: 2 },
        { name: "Cycling", muscleGroup: "legs", sets: 1, reps: 25, order: 3 },
        { name: "Stair Climber", muscleGroup: "legs", sets: 1, reps: 15, order: 4 },
      ]
    },
    {
      name: "Stamina Builder", 
      description: "Circuit training for improved muscular endurance",
      category: "Cardio",
      exercises: [
        { name: "Jump Rope", muscleGroup: "full body", sets: 5, reps: 60, order: 1 },
        { name: "Bodyweight Squats", muscleGroup: "legs", sets: 4, reps: 25, order: 2 },
        { name: "Push-ups", muscleGroup: "chest", sets: 4, reps: 20, order: 3 },
        { name: "Plank Hold", muscleGroup: "core", sets: 3, reps: 45, order: 4 },
      ]
    },
    {
      name: "Aerobic Power",
      description: "High-volume aerobic workout for cardiovascular fitness",
      category: "Cardio",
      exercises: [
        { name: "Elliptical Machine", muscleGroup: "full body", sets: 1, reps: 35, order: 1 },
        { name: "Battle Ropes", muscleGroup: "arms", sets: 6, reps: 30, order: 2 },
        { name: "Step-ups", muscleGroup: "legs", sets: 4, reps: 20, order: 3 },
        { name: "Burpees", muscleGroup: "full body", sets: 3, reps: 12, order: 4 },
      ]
    },
    {
      name: "Distance Training",
      description: "Long-duration training for endurance sports preparation", 
      category: "Cardio",
      exercises: [
        { name: "Long Run", muscleGroup: "legs", sets: 1, reps: 45, order: 1 },
        { name: "Swimming", muscleGroup: "full body", sets: 1, reps: 30, order: 2 },
        { name: "Bike Ride", muscleGroup: "legs", sets: 1, reps: 60, order: 3 },
        { name: "Walking", muscleGroup: "legs", sets: 1, reps: 90, order: 4 },
      ]
    }
  ],

  // Mobility & Flexibility - Yoga, stretching, mobility work  
  "mobility": [
    {
      name: "Morning Mobility",
      description: "Gentle morning routine to improve flexibility and joint mobility",
      category: "Flexibility",
      exercises: [
        { name: "Cat-Cow Stretch", muscleGroup: "back", sets: 3, reps: 12, order: 1 },
        { name: "Hip Circles", muscleGroup: "glutes", sets: 3, reps: 10, order: 2 },
        { name: "Shoulder Rolls", muscleGroup: "shoulders", sets: 3, reps: 15, order: 3 },
        { name: "Leg Swings", muscleGroup: "legs", sets: 3, reps: 12, order: 4 },
      ]
    },
    {
      name: "Deep Stretch Flow",
      description: "Comprehensive stretching routine for full-body flexibility",
      category: "Flexibility", 
      exercises: [
        { name: "Downward Dog", muscleGroup: "full body", sets: 3, reps: 30, order: 1 },
        { name: "Pigeon Pose", muscleGroup: "glutes", sets: 2, reps: 60, order: 2 },
        { name: "Hamstring Stretch", muscleGroup: "legs", sets: 3, reps: 45, order: 3 },
        { name: "Spinal Twist", muscleGroup: "core", sets: 3, reps: 30, order: 4 },
      ]
    },
    {
      name: "Yoga Flow Basic",
      description: "Basic yoga sequence for beginners to improve flexibility",
      category: "Flexibility",
      exercises: [
        { name: "Sun Salutation", muscleGroup: "full body", sets: 5, reps: 1, order: 1 },
        { name: "Warrior Pose", muscleGroup: "legs", sets: 3, reps: 45, order: 2 },
        { name: "Tree Pose", muscleGroup: "legs", sets: 3, reps: 30, order: 3 },
        { name: "Child's Pose", muscleGroup: "back", sets: 2, reps: 60, order: 4 },
      ]
    },
    {
      name: "Recovery Stretches",
      description: "Post-workout recovery stretches for muscle relaxation",
      category: "Recovery",
      exercises: [
        { name: "Quad Stretch", muscleGroup: "legs", sets: 3, reps: 30, order: 1 },
        { name: "Chest Opener", muscleGroup: "chest", sets: 3, reps: 45, order: 2 },
        { name: "IT Band Stretch", muscleGroup: "legs", sets: 3, reps: 30, order: 3 },
        { name: "Neck Rolls", muscleGroup: "shoulders", sets: 3, reps: 10, order: 4 },
      ]
    }
  ]
};

export async function POST(request: Request) {
  try {
    // Check for admin secret key in headers
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'dev-admin-secret';
    
    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🌱 Starting workout seeding process...');

    // Create system user if it doesn't exist
    let systemUser = await prisma.user.findUnique({
      where: { email: 'system@workouts.app' }
    });

    if (!systemUser) {
      console.log('Creating system user for default workouts...');
      systemUser = await prisma.user.create({
        data: {
          email: 'system@workouts.app',
          name: 'System',
          role: 'ADMIN',
          onboardingCompleted: true
        }
      });
    }

    // Create default workouts for each fitness goal category
    const createdWorkouts = [];
    
    for (const [goalType, workouts] of Object.entries(defaultWorkouts)) {
      console.log(`🏋️ Creating workouts for ${goalType}...`);
      
      for (const workoutTemplate of workouts) {
        // Create exercises first
        const exercisePromises = workoutTemplate.exercises.map(async (exerciseData) => {
          // Try to find existing exercise first
          let exercise = await prisma.exercise.findFirst({
            where: { name: exerciseData.name, muscleGroup: exerciseData.muscleGroup }
          });
          
          if (!exercise) {
            // Create new exercise if not found
            exercise = await prisma.exercise.create({
              data: {
                name: exerciseData.name,
                muscleGroup: exerciseData.muscleGroup,
                description: `${exerciseData.name} targeting ${exerciseData.muscleGroup}`,
              }
            });
          }
          
          return {
            exerciseId: exercise.id,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            order: exerciseData.order,
          };
        });
        
        const exerciseConnections = await Promise.all(exercisePromises);
        
        // Get image recommendation for this workout
        const exerciseData = workoutTemplate.exercises.map(ex => ({
          name: ex.name,
          muscleGroup: ex.muscleGroup
        }));
        
        const workoutImage = getSmartWorkoutImage({
          exercises: exerciseData,
          category: workoutTemplate.category,
          fitnessGoals: [goalType],
          workoutName: workoutTemplate.name,
          description: workoutTemplate.description
        });
        
        // Create workout
        const workout = await prisma.workout.create({
          data: {
            name: workoutTemplate.name,
            description: workoutTemplate.description,
            image: workoutImage,
            public: true,
            userId: systemUser.id,
            exercises: {
              create: exerciseConnections
            }
          },
          include: {
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        });
        
        createdWorkouts.push(workout);
        console.log(`✅ Created workout: ${workout.name} with ${workout.exercises.length} exercises`);
      }
    }

    console.log(`🎉 Successfully seeded ${createdWorkouts.length} default workouts!`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdWorkouts.length} default workouts`,
      workouts: createdWorkouts.map(w => ({
        id: w.id,
        name: w.name,
        description: w.description,
        image: w.image,
        exerciseCount: w.exercises.length
      }))
    });

  } catch (error) {
    console.error("Error seeding default workouts:", error);
    return NextResponse.json(
      { error: "Failed to seed default workouts", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all public (default) workouts
    const deleteResult = await prisma.workout.deleteMany({
      where: { public: true }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.count} default workouts`
    });

  } catch (error) {
    console.error("Error deleting default workouts:", error);
    return NextResponse.json(
      { error: "Failed to delete default workouts" },
      { status: 500 }
    );
  }
}