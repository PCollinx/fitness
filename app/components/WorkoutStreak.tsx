"use client";

import { useState } from "react";
import Image from "next/image";

export default function WorkoutStreak() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">You're on a roll!</h1>
      <p className="text-gray-400 mb-8">
        You've been exercising 3 consecutive days in a row! Add this workout to
        keep the streak going for the week.
      </p>

      {/* Illustration */}
      <div className="w-full max-w-xs mb-12">
        {/* This would be replaced with an actual image */}
        <div className="relative w-full aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="130" r="50" fill="#E4FF1A" />
              <rect
                x="85"
                y="30"
                width="30"
                height="100"
                rx="15"
                fill="#E4FF1A"
              />
              <rect
                x="50"
                y="65"
                width="100"
                height="30"
                rx="15"
                fill="#E4FF1A"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <button className="w-full py-3 px-4 rounded-lg bg-yellow-400 text-black font-medium">
          Continue work out
        </button>

        <button className="w-full py-3 px-4 text-red-500 font-medium">
          End session
        </button>
      </div>
    </div>
  );
}
