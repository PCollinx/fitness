"use client";

import { useState, useEffect } from "react";
import {
  FaClock,
  FaBell,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTrash,
  FaSave,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  useWorkoutSchedule,
  getDayName,
  getDayShortName,
  formatTime,
  parseTime12Hour,
  type WorkoutSchedule as IWorkoutSchedule,
  type BulkUpdateScheduleData,
} from "../hooks/useWorkoutSchedule";

interface WorkoutScheduleProps {
  onScheduleUpdate?: (schedules: IWorkoutSchedule[]) => void;
  compact?: boolean;
}

interface ScheduleDay {
  dayOfWeek: number;
  time: string;
  isEnabled: boolean;
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  reminderMinutes: number;
}

export default function WorkoutScheduleComponent({
  onScheduleUpdate,
  compact = false,
}: WorkoutScheduleProps) {
  const {
    schedules,
    isLoading,
    error,
    updateSchedules,
    refetch,
  } = useWorkoutSchedule();

  const [editingSchedules, setEditingSchedules] = useState<ScheduleDay[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize editing schedules from fetched schedules
  useEffect(() => {
    const initialSchedules: ScheduleDay[] = [];
    
    // Create schedule for each day of the week
    for (let day = 0; day < 7; day++) {
      const existingSchedule = schedules.find(s => s.dayOfWeek === day && s.isActive);
      
      initialSchedules.push({
        dayOfWeek: day,
        time: existingSchedule?.time || "09:00",
        isEnabled: !!existingSchedule,
        notificationsEnabled: existingSchedule?.notificationsEnabled ?? true,
        reminderEnabled: existingSchedule?.reminderEnabled ?? true,
        reminderMinutes: existingSchedule?.reminderMinutes ?? 15,
      });
    }
    
    setEditingSchedules(initialSchedules);
    setHasChanges(false);
  }, [schedules]);

  const handleScheduleChange = (dayOfWeek: number, field: keyof ScheduleDay, value: any) => {
    setEditingSchedules(prev => 
      prev.map(schedule => 
        schedule.dayOfWeek === dayOfWeek 
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
    setHasChanges(true);
  };

  const handleTimeChange = (dayOfWeek: number, timeString: string) => {
    const time24 = parseTime12Hour(timeString) || timeString;
    handleScheduleChange(dayOfWeek, 'time', time24);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const enabledSchedules = editingSchedules.filter(s => s.isEnabled);
      
      const updateData: BulkUpdateScheduleData = {
        schedules: enabledSchedules.map(schedule => ({
          dayOfWeek: schedule.dayOfWeek,
          time: schedule.time,
          isActive: true,
          isEnabled: true,
          notificationsEnabled: schedule.notificationsEnabled,
          reminderEnabled: schedule.reminderEnabled,
          reminderMinutes: schedule.reminderMinutes,
        })),
      };
      
      const result = await updateSchedules(updateData);
      
      if (result) {
        setHasChanges(false);
        // Refresh the schedules data to get the latest from the server
        await refetch();
        onScheduleUpdate?.(result);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (dayOfWeek: number) => {
    const currentValue = editingSchedules[dayOfWeek]?.isEnabled;
    handleScheduleChange(dayOfWeek, 'isEnabled', !currentValue);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 23; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      const time12 = formatTime(time24);
      slots.push({ value: time24, label: time12 });
    }
    return slots;
  };

  if (isLoading && !editingSchedules.length) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-400">Loading schedule...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
            <FaCalendarAlt className="mr-2 text-yellow-500 text-sm sm:text-base" />
            Workout Schedule
          </h3>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 sm:p-3 rounded-lg mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {editingSchedules.map((schedule) => (
            <div key={schedule.dayOfWeek} className="text-center">
              <div className="text-xs text-gray-400 mb-1 truncate">
                {getDayShortName(schedule.dayOfWeek)}
              </div>
              <button
                onClick={() => toggleDay(schedule.dayOfWeek)}
                className={`w-full h-8 sm:h-10 rounded text-xs sm:text-sm font-medium transition-colors ${
                  schedule.isEnabled
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {schedule.isEnabled ? formatTime(schedule.time).split(' ')[0] : "Off"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center px-1">
          Click days to enable/disable • All times include reminders
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <FaCalendarAlt className="mr-2 sm:mr-3 text-yellow-500" />
          Workout Schedule
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <FaTimes className="mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {editingSchedules.map((schedule) => (
          <div
            key={schedule.dayOfWeek}
            className={`border rounded-lg p-3 sm:p-4 transition-all ${
              schedule.isEnabled
                ? "border-yellow-500/50 bg-yellow-500/5"
                : "border-gray-700 bg-gray-750"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleDay(schedule.dayOfWeek)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    schedule.isEnabled
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-600 bg-gray-700"
                  }`}
                >
                  {schedule.isEnabled && (
                    <FaCheck className="text-black text-xs" />
                  )}
                </button>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {getDayName(schedule.dayOfWeek)}
                </h3>
              </div>

              {schedule.isEnabled && (
                <div className="flex items-center space-x-2 sm:space-x-3 ml-9 sm:ml-0">
                  <div className="flex items-center text-gray-400">
                    <FaClock className="mr-1 sm:mr-2 text-sm" />
                    <select
                      value={schedule.time}
                      onChange={(e) => handleTimeChange(schedule.dayOfWeek, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-2 sm:px-3 py-1 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 min-w-0 w-full max-w-[120px] sm:max-w-none"
                    >
                      {getTimeSlots().map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {schedule.isEnabled && (
              <div className="pl-0 sm:pl-9 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleScheduleChange(
                          schedule.dayOfWeek,
                          'notificationsEnabled',
                          !schedule.notificationsEnabled
                        )
                      }
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        schedule.notificationsEnabled
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-gray-600 bg-gray-700"
                      }`}
                    >
                      {schedule.notificationsEnabled && (
                        <FaCheck className="text-black text-xs" />
                      )}
                    </button>
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Enable notifications
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 ml-7 sm:ml-0">
                    <FaBell className="text-gray-400 text-sm" />
                    <select
                      value={schedule.reminderMinutes}
                      onChange={(e) =>
                        handleScheduleChange(
                          schedule.dayOfWeek,
                          'reminderMinutes',
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!schedule.notificationsEnabled}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 min-w-0 w-full max-w-[110px] sm:max-w-none"
                    >
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save/Cancel Buttons */}
      {hasChanges && (
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => {
              refetch();
              setHasChanges(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Schedule
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-750 rounded-lg">
        <div className="text-sm text-gray-400">
          <p className="mb-2">
            <strong className="text-white">Schedule Tips:</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Enable days when you want to work out regularly</li>
            <li>Set consistent times to build a habit</li>
            <li>Notifications will remind you when it's time to exercise</li>
            <li>You can adjust reminder timing for each day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}