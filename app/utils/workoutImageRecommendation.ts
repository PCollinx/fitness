import { getImageForExercise, getImageByCategory } from './workoutImageStorage';

export interface WorkoutExerciseData {
  name: string;
  muscleGroup: string;
}

/**
 * Get recommended image for a workout based on its exercises and fitness goals
 */
export const getWorkoutImageRecommendation = (
  exercises: WorkoutExerciseData[],
  category?: string,
  fitnessGoals?: string[]
): string => {
  if (!exercises || exercises.length === 0) {
    return getImageByCategory(category || 'strength');
  }

  // Count muscle group distribution
  const muscleGroupCount: Record<string, number> = {};
  exercises.forEach(exercise => {
    if (exercise.muscleGroup) {
      muscleGroupCount[exercise.muscleGroup] = (muscleGroupCount[exercise.muscleGroup] || 0) + 1;
    }
  });

  // Find the most targeted muscle group
  const primaryMuscleGroup = Object.entries(muscleGroupCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  if (primaryMuscleGroup) {
    // Use the primary muscle group and first exercise name for context
    return getImageForExercise(primaryMuscleGroup as any, exercises[0].name);
  }

  // Fallback to category-based image
  return getImageByCategory(category || 'strength');
};

/**
 * Get fitness goal-aligned image recommendation
 */
export const getFitnessGoalImageRecommendation = (
  fitnessGoals: string[],
  exercises?: WorkoutExerciseData[],
  category?: string
): string => {
  // Map fitness goals to preferred muscle groups/categories
  const goalImageMap: Record<string, string> = {
    'weight-loss': 'cardio',
    'weight-gain': 'full_body', 
    'muscle-building': 'chest',
    'strength-training': 'back',
    'endurance': 'cardio',
    'mobility': 'core'
  };

  // Use the first fitness goal to determine image preference
  const primaryGoal = fitnessGoals?.[0];
  
  if (primaryGoal && goalImageMap[primaryGoal]) {
    const preferredMuscleGroup = goalImageMap[primaryGoal];
    
    // If we have exercises, try to find one that matches the preferred muscle group
    if (exercises?.length) {
      const matchingExercise = exercises.find(ex => 
        ex.muscleGroup === preferredMuscleGroup
      );
      
      if (matchingExercise) {
        return getImageForExercise(preferredMuscleGroup as any, matchingExercise.name);
      }
      
      // Otherwise use general recommendation based on exercises
      return getWorkoutImageRecommendation(exercises, category, fitnessGoals);
    }
    
    // No exercises, use muscle group directly
    return getImageForExercise(preferredMuscleGroup as any);
  }

  // Fallback to general workout image recommendation
  return getWorkoutImageRecommendation(exercises || [], category, fitnessGoals);
};

/**
 * Get category-specific image with fitness goal alignment
 */
export const getCategoryImageWithGoalAlignment = (
  category: string,
  fitnessGoals?: string[]
): string => {
  // Enhanced category mapping based on fitness goals
  if (fitnessGoals?.includes('weight-loss')) {
    if (category.toLowerCase().includes('cardio') || category.toLowerCase().includes('hiit')) {
      return getImageForExercise('cardio');
    }
  }
  
  if (fitnessGoals?.includes('muscle-building') || fitnessGoals?.includes('weight-gain')) {
    if (category.toLowerCase().includes('strength')) {
      return getImageForExercise('chest'); // Chest exercises are very visual for muscle building
    }
  }
  
  if (fitnessGoals?.includes('strength-training')) {
    if (category.toLowerCase().includes('strength')) {
      return getImageForExercise('back'); // Deadlifts, rows are classic strength exercises
    }
  }
  
  if (fitnessGoals?.includes('endurance')) {
    return getImageForExercise('cardio');
  }
  
  if (fitnessGoals?.includes('mobility')) {
    return getImageForExercise('core');
  }
  
  // Default category-based selection
  return getImageByCategory(category);
};

/**
 * Smart image recommendation that considers all available context
 */
export const getSmartWorkoutImage = (context: {
  exercises?: WorkoutExerciseData[];
  category?: string;
  fitnessGoals?: string[];
  workoutName?: string;
  description?: string;
}): string => {
  const { exercises, category, fitnessGoals, workoutName, description } = context;
  
  // Use exercise-based recommendation as primary method
  if (exercises && exercises.length > 0) {
    return getFitnessGoalImageRecommendation(fitnessGoals || [], exercises, category);
  }
  
  // Use workout name/description to infer muscle groups
  if (workoutName || description) {
    const text = `${workoutName || ''} ${description || ''}`.toLowerCase();
    
    // Infer muscle groups from text
    const inferredExercises: WorkoutExerciseData[] = [];
    
    if (text.includes('chest') || text.includes('push')) {
      inferredExercises.push({ name: 'Chest Exercise', muscleGroup: 'chest' });
    }
    if (text.includes('back') || text.includes('pull')) {
      inferredExercises.push({ name: 'Back Exercise', muscleGroup: 'back' });
    }
    if (text.includes('leg') || text.includes('squat')) {
      inferredExercises.push({ name: 'Leg Exercise', muscleGroup: 'legs' });
    }
    if (text.includes('arm') || text.includes('bicep') || text.includes('tricep')) {
      inferredExercises.push({ name: 'Arm Exercise', muscleGroup: 'arms' });
    }
    if (text.includes('shoulder')) {
      inferredExercises.push({ name: 'Shoulder Exercise', muscleGroup: 'shoulders' });
    }
    if (text.includes('core') || text.includes('abs')) {
      inferredExercises.push({ name: 'Core Exercise', muscleGroup: 'core' });
    }
    if (text.includes('glute') || text.includes('hip')) {
      inferredExercises.push({ name: 'Glute Exercise', muscleGroup: 'glutes' });
    }
    if (text.includes('cardio') || text.includes('hiit') || text.includes('endurance')) {
      inferredExercises.push({ name: 'Cardio Exercise', muscleGroup: 'cardio' });
    }
    if (text.includes('full body') || text.includes('total body')) {
      inferredExercises.push({ name: 'Full Body Exercise', muscleGroup: 'full_body' });
    }
    
    if (inferredExercises.length > 0) {
      return getFitnessGoalImageRecommendation(fitnessGoals || [], inferredExercises, category);
    }
  }
  
  // Use category with fitness goal alignment
  if (category) {
    return getCategoryImageWithGoalAlignment(category, fitnessGoals);
  }
  
  // Ultimate fallback
  return getImageByCategory('strength');
};