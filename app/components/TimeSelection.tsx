"use client";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function TimeSelection() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Time slots from the design
  const timeSlots = [
    { time: "6", period: "AM", selected: false },
    { time: "7", period: "AM", selected: false },
    { time: "8", period: "AM", selected: false },
    { time: "9", period: "AM", selected: true }, // Default selected
    { time: "10", period: "AM", selected: false },
    { time: "11", period: "AM", selected: false },
    { time: "12", period: "PM", selected: false },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      <div className="mb-6 flex items-center space-x-4">
        <button className="text-white p-2">
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold flex-1">Time to stay fit</h1>
        <button className="text-white p-2">
          <FaArrowRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-gray-400 mb-8">
        What time do you want to work out regularly?
      </p>

      {/* Time Selection */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-3 px-6 rounded-lg ${
                slot.selected
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-white"
              }`}
              onClick={() => setSelectedTime(`${slot.time} ${slot.period}`)}
            >
              <span className="text-2xl font-bold">{slot.time}</span>
              <span className="text-lg">{slot.period}</span>
            </div>
          ))}
        </div>
      </div>

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
