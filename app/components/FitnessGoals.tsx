"use client";

import { useState } from "react";

export default function FitnessGoals() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    { id: "weight-loss", label: "Weight loss" },
    { id: "weight-gain", label: "Weight gain" },
    { id: "muscle-building", label: "Muscle building" },
    { id: "strength-training", label: "Strength training" },
    { id: "endurance", label: "Endurance" },
    { id: "mobility", label: "Mobility" },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold">What brings you here?</h1>
        <p className="text-gray-400">You can choose more than one</p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`w-full py-4 px-4 rounded-lg flex items-center justify-between border ${
              selectedGoal === goal.id
                ? "border-yellow-400 bg-gray-900"
                : "border-gray-800 bg-gray-900"
            } transition-all duration-200`}
          >
            <span className="text-left text-lg">{goal.label}</span>
            {selectedGoal === goal.id && (
              <span className="h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-12">
        <button
          disabled={!selectedGoal}
          className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
            selectedGoal
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-gray-400"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
