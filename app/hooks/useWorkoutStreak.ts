import { useState, useEffect } from 'react';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkout: string | null;
  streakDays: string[];
  isActiveToday: boolean;
}

export interface UseStreakReturn {
  streakData: StreakData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWorkoutStreak(): UseStreakReturn {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreakData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/streak');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch streak data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load streak data');
      }
      
      setStreakData(data.streak);
    } catch (err) {
      console.error('Error fetching streak data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load streak data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  return {
    streakData,
    isLoading,
    error,
    refetch: fetchStreakData,
  };
}

// Utility functions for streak-related UI
export const getStreakMessage = (streak: number, isActive: boolean): string => {
  if (streak === 0) return "Ready to start your fitness journey?";
  if (streak === 1) return "Great start! One day down!";
  if (streak < 7) return `You're on a ${streak}-day streak! Keep it up!`;
  if (streak < 30) return `Amazing! ${streak} days in a row! You're unstoppable!`;
  return `Incredible! ${streak} consecutive days! You're a fitness legend!`;
};

export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return "🎯";
  if (streak < 3) return "🔥";
  if (streak < 7) return "⚡";
  if (streak < 30) return "🚀";
  return "👑";
};

export const getStreakColor = (streak: number): string => {
  if (streak === 0) return "text-gray-400";
  if (streak < 3) return "text-orange-400";
  if (streak < 7) return "text-yellow-400";
  if (streak < 30) return "text-blue-400";
  return "text-purple-400";
};