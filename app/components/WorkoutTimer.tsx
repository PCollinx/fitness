"use client";

import { useState, useEffect } from "react";
import { FaPause, FaPlay, FaStop, FaStepForward } from "react-icons/fa";

export default function WorkoutTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(5);
  const [currentExercise, setCurrentExercise] = useState("Squat");

  // Format time as mm:ss:ms
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0 && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  // Handle timer controls
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
  };

  const nextExercise = () => {
    resetTimer();
    // For demo purposes, we'll just cycle through a few exercises
    const exercises = ["Squat", "Push-up", "Plank", "Lunges", "Burpees"];
    const currentIndex = exercises.indexOf(currentExercise);
    const nextIndex = (currentIndex + 1) % exercises.length;
    setCurrentExercise(exercises[nextIndex]);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Timer Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="text-white p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Timer</h1>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Current Exercise Image */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 aspect-video">
        <img
          src="https://source.unsplash.com/random/800x600/?fitness"
          alt={currentExercise}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center mb-8">
        <div className="text-5xl font-bold tracking-wider mb-2">
          {formatTime(time)}
        </div>
        <div className="text-gray-400">
          {sets} sets, {reps} reps
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={resetTimer}
          className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition duration-200"
        >
          <FaStop className="h-6 w-6" />
        </button>

        <button
          onClick={toggleTimer}
          className="bg-yellow-400 p-6 rounded-full text-black hover:bg-yellow-300 transition duration-200"
        >
          {isActive ? (
            <FaPause className="h-8 w-8" />
          ) : (
            <FaPlay className="h-8 w-8" />
          )}
        </button>

        <button
          onClick={nextExercise}
          className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition duration-200"
        >
          <FaStepForward className="h-6 w-6" />
        </button>
      </div>

      {/* Next Button */}
      <div className="mt-12 flex justify-center">
        <button className="bg-yellow-400 text-black py-3 px-24 rounded-md font-medium text-lg hover:bg-yellow-300 transition-all duration-200">
          Next
        </button>
      </div>
    </div>
  );
}
