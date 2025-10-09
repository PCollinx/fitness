import { useState, useEffect } from "react";

export interface WorkoutSchedule {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  time: string; // HH:MM format
  isActive: boolean;
  isEnabled: boolean;
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  reminderMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  dayOfWeek: number;
  time: string;
  isActive?: boolean;
  notificationsEnabled?: boolean;
  reminderMinutes?: number;
}

export interface UpdateScheduleData extends CreateScheduleData {
  isEnabled?: boolean;
  reminderEnabled?: boolean;
}

export interface BulkUpdateScheduleData {
  schedules: Array<{
    dayOfWeek: number;
    time: string;
    isActive?: boolean;
    isEnabled?: boolean;
    notificationsEnabled?: boolean;
    reminderEnabled?: boolean;
    reminderMinutes?: number;
  }>;
}

export interface UseWorkoutScheduleReturn {
  schedules: WorkoutSchedule[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  createSchedule: (data: CreateScheduleData) => Promise<WorkoutSchedule | null>;
  updateSchedules: (
    data: BulkUpdateScheduleData
  ) => Promise<WorkoutSchedule[] | null>;
  deleteSchedule: (scheduleId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useWorkoutSchedule(): UseWorkoutScheduleReturn {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/workout-schedule");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view your workout schedules");
        }
        throw new Error(`Failed to fetch schedules: ${response.status}`);
      }

      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching workout schedules:", err);
      setError(err instanceof Error ? err.message : "Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };

  const createSchedule = async (
    data: CreateScheduleData
  ): Promise<WorkoutSchedule | null> => {
    try {
      setError(null);

      const response = await fetch("/api/user/workout-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to create schedule: ${response.status}`
        );
      }

      const newSchedule = await response.json();
      setSchedules((prev) => [...prev, newSchedule]);
      return newSchedule;
    } catch (err) {
      console.error("Error creating workout schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create schedule"
      );
      return null;
    }
  };

  const updateSchedules = async (
    data: BulkUpdateScheduleData
  ): Promise<WorkoutSchedule[] | null> => {
    try {
      setError(null);

      const response = await fetch("/api/user/workout-schedule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update schedules: ${response.status}`
        );
      }

      const updatedSchedules = await response.json();
      setSchedules(updatedSchedules);
      return updatedSchedules;
    } catch (err) {
      console.error("Error updating workout schedules:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update schedules"
      );
      return null;
    }
  };

  const deleteSchedule = async (scheduleId: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(
        `/api/user/workout-schedule?id=${scheduleId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete schedule: ${response.status}`
        );
      }

      // Remove from local state
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      return true;
    } catch (err) {
      console.error("Error deleting workout schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete schedule"
      );
      return false;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedules,
    deleteSchedule,
    refetch: fetchSchedules,
  };
}

// Utility functions for schedule management
export const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
};

export const getDayShortName = (dayOfWeek: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayOfWeek];
};

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
};

export const parseTime12Hour = (time12: string): string => {
  try {
    const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return time12;

    let [, hours, minutes, period] = match;
    let hour24 = parseInt(hours);

    if (period.toUpperCase() === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toUpperCase() === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  } catch {
    return time12;
  }
};
