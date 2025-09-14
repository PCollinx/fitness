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
    image: "https://source.unsplash.com/random/400x300/?fitness,weights",
    exercises: 8,
    lastPerformed: "2025-09-05",
    createdAt: "2025-09-01T12:00:00Z",
    isPublic: true,
    isDefault: true
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
    image: "https://source.unsplash.com/random/400x300/?abs,workout",
    exercises: 6,
    lastPerformed: "2025-09-08",
    createdAt: "2025-09-02T12:00:00Z",
    isPublic: true,
    isDefault: true
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
    image: "https://source.unsplash.com/random/400x300/?cardio,workout",
    exercises: 10,
    lastPerformed: "2025-09-01",
    createdAt: "2025-09-03T12:00:00Z",
    isPublic: true,
    isDefault: true
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
    image: "https://source.unsplash.com/random/400x300/?workout,gym",
    exercises: 12,
    lastPerformed: "2025-09-03",
    createdAt: "2025-09-04T12:00:00Z",
    isPublic: true,
    isDefault: true
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
    image: "https://source.unsplash.com/random/400x300/?legs,squat",
    exercises: 7,
    lastPerformed: "2025-09-10",
    createdAt: "2025-09-05T12:00:00Z",
    isPublic: true,
    isDefault: true
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
    image: "https://source.unsplash.com/random/400x300/?stretch,yoga",
    exercises: 9,
    createdAt: "2025-09-06T12:00:00Z",
    isPublic: true,
    isDefault: true
  },
];

// Load custom workouts from localStorage
export const loadCustomWorkouts = (): Workout[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedWorkouts = localStorage.getItem('customWorkouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  } catch (error) {
    console.error('Error loading custom workouts from localStorage:', error);
    return [];
  }
};

// Save custom workouts to localStorage
export const saveCustomWorkouts = (workouts: Workout[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('customWorkouts', JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving custom workouts to localStorage:', error);
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
  saveCustomWorkouts([workout, ...customWorkouts]);
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Get random image for workout
export const getRandomWorkoutImage = (): string => {
  const categories = ['fitness', 'gym', 'workout', 'weights', 'strength'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return `https://source.unsplash.com/random/400x300/?${randomCategory}`;
};