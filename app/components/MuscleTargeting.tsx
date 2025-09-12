"use client";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

export default function MuscleTargeting() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  const muscleGroups = [
    { id: "chest", label: "Chest" },
    { id: "shoulders", label: "Shoulder" },
    { id: "biceps", label: "Biceps" },
    { id: "triceps", label: "Triceps" },
    { id: "back", label: "Back" },
    { id: "legs", label: "Legs" },
    { id: "core", label: "Core" },
    { id: "glutes", label: "Glutes" },
  ];

  const toggleMuscleSelection = (id: string) => {
    if (selectedMuscles.includes(id)) {
      setSelectedMuscles(selectedMuscles.filter((muscleId) => muscleId !== id));
    } else {
      setSelectedMuscles([...selectedMuscles, id]);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button className="text-white p-2">
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-1">
          <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-8 rounded-full bg-gray-700"></div>
          <div className="h-1 w-8 rounded-full bg-gray-700"></div>
        </div>
        <div className="w-5"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            What muscles do you want to target?
          </h1>
          <p className="text-gray-400 mt-1">Select target muscles</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-6">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle.id}
              onClick={() => toggleMuscleSelection(muscle.id)}
              className={`w-full py-4 px-6 rounded-lg flex items-center justify-between border ${
                selectedMuscles.includes(muscle.id)
                  ? "border-yellow-400 bg-gray-900"
                  : "border-gray-800 bg-gray-900"
              } transition-all duration-200`}
            >
              <span className="text-left text-lg">{muscle.label}</span>
              {selectedMuscles.includes(muscle.id) && (
                <span className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaCheck className="h-3 w-3 text-black" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between">
        <button className="flex-1 py-3 mr-2 rounded-lg bg-gray-800 text-white font-medium">
          Back
        </button>
        <button
          className={`flex-1 py-3 ml-2 rounded-lg font-medium ${
            selectedMuscles.length > 0
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-gray-400"
          }`}
          disabled={selectedMuscles.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
