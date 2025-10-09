"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useWorkoutSchedule } from "../hooks/useWorkoutSchedule";

interface TimeSelectionProps {
  onTimeSelect?: (time: string) => void;
  onContinue?: () => void;
  selectedDay?: number; // Day of week (0-6)
  showNavigation?: boolean;
  title?: string;
  subtitle?: string;
}

export default function TimeSelection({
  onTimeSelect,
  onContinue,
  selectedDay = new Date().getDay(),
  showNavigation = true,
  title = "Time to stay fit",
  subtitle = "What time do you want to work out regularly?",
}: TimeSelectionProps) {
  const router = useRouter();
  const { createSchedule, schedules } = useWorkoutSchedule();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if there's already a schedule for the selected day
  useEffect(() => {
    const existingSchedule = schedules.find(
      (s) => s.dayOfWeek === selectedDay && s.isActive
    );
    if (existingSchedule) {
      // Convert 24h format to display format for initial selection
      const timeSlot = timeSlots.find(
        (slot) => slot.value === existingSchedule.time
      );
      if (timeSlot) {
        setSelectedTime(timeSlot.value);
      }
    }
  }, [schedules, selectedDay]);

  // Generate time slots
  const timeSlots = [
    { time: "6", period: "AM", value: "06:00", display: "6 AM" },
    { time: "7", period: "AM", value: "07:00", display: "7 AM" },
    { time: "8", period: "AM", value: "08:00", display: "8 AM" },
    { time: "9", period: "AM", value: "09:00", display: "9 AM" },
    { time: "10", period: "AM", value: "10:00", display: "10 AM" },
    { time: "11", period: "AM", value: "11:00", display: "11 AM" },
    { time: "12", period: "PM", value: "12:00", display: "12 PM" },
    { time: "1", period: "PM", value: "13:00", display: "1 PM" },
    { time: "2", period: "PM", value: "14:00", display: "2 PM" },
    { time: "3", period: "PM", value: "15:00", display: "3 PM" },
    { time: "4", period: "PM", value: "16:00", display: "4 PM" },
    { time: "5", period: "PM", value: "17:00", display: "5 PM" },
    { time: "6", period: "PM", value: "18:00", display: "6 PM" },
    { time: "7", period: "PM", value: "19:00", display: "7 PM" },
    { time: "8", period: "PM", value: "20:00", display: "8 PM" },
  ];

  const handleTimeSelect = async (timeValue: string) => {
    setSelectedTime(timeValue);
    onTimeSelect?.(timeValue);
  };

  const handleContinue = async () => {
    if (!selectedTime) return;

    setIsLoading(true);
    try {
      // Create schedule if callback is provided
      if (createSchedule && selectedDay !== undefined) {
        await createSchedule({
          dayOfWeek: selectedDay,
          time: selectedTime,
          isActive: true,
          notificationsEnabled: true,
          reminderMinutes: 15,
        });
      }

      if (onContinue) {
        onContinue();
      } else {
        // Default navigation to schedule page
        router.push("/schedule");
      }
    } catch (error) {
      console.error("Error setting schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      {showNavigation && (
        <div className="mb-6 flex items-center space-x-4">
          <button className="text-white p-2" onClick={() => router.back()}>
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold flex-1">{title}</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      )}

      {!showNavigation && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        </div>
      )}

      <p className="text-gray-400 mb-8 text-center">{subtitle}</p>

      {/* Time Selection */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              className={`flex items-center justify-between py-3 px-6 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTime === slot.value
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
              onClick={() => handleTimeSelect(slot.value)}
            >
              <span className="text-2xl font-bold">{slot.time}</span>
              <span className="text-lg">{slot.period}</span>
              {selectedTime === slot.value && (
                <FaCheck className="text-black ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      {selectedTime && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Setting Schedule..." : "Continue"}
          </button>
        </div>
      )}

      {/* Note */}
      <div className="mt-10 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>We'll set up a reminder to workout at this time</span>
        </div>
      </div>
    </div>
  );
}
