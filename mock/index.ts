/**
 * Mock Data Index
 * 
 * This file provides easy imports for all mock data files.
 * Use this to import mock data in your tests, development, or demos.
 */

import users from './users.json';
import exercises from './exercises.json';
import workouts from './workouts.json';
import workoutSessions from './workout-sessions.json';
import progress from './progress.json';
import fitnessGoals from './fitness-goals.json';
import workoutSchedules from './workout-schedules.json';

export const mockData = {
  users,
  exercises,
  workouts,
  workoutSessions,
  progress,
  fitnessGoals,
  workoutSchedules,
};

// Individual exports for convenience
export { users, exercises, workouts, workoutSessions, progress, fitnessGoals, workoutSchedules };

// Helper functions
export const getMockUser = (id: string) => users.find(user => user.id === id);
export const getMockExercise = (id: string) => exercises.find(exercise => exercise.id === id);
export const getMockWorkout = (id: string) => workouts.find(workout => workout.id === id);
export const getMockWorkoutSession = (id: string) => workoutSessions.find(session => session.id === id);
export const getMockProgress = (id: string) => progress.find(prog => prog.id === id);
export const getMockFitnessGoal = (id: string) => fitnessGoals.find(goal => goal.id === id);
export const getMockWorkoutSchedule = (id: string) => workoutSchedules.find(schedule => schedule.id === id);

// Get all data for a specific user
export const getUserMockData = (userId: string) => ({
  user: getMockUser(userId),
  workouts: workouts.filter(workout => workout.userId === userId),
  workoutSessions: workoutSessions.filter(session => session.userId === userId),
  progress: progress.filter(prog => prog.userId === userId),
  fitnessGoals: fitnessGoals.filter(goal => goal.userId === userId),
  workoutSchedules: workoutSchedules.filter(schedule => schedule.userId === userId),
});

export default mockData;
