"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FaExpand, FaCompress, FaPlus, FaMinus } from "react-icons/fa";

// Load all components dynamically to avoid SSR issues with client components
const WorkoutTimer = dynamic(() => import("./WorkoutTimer"), { ssr: false });
const FitnessGoals = dynamic(() => import("./FitnessGoals"), { ssr: false });
const MealPrep = dynamic(() => import("./MealPrep"), { ssr: false });
const MuscleTargeting = dynamic(() => import("./MuscleTargeting"), {
  ssr: false,
});
const WorkoutStreak = dynamic(() => import("./WorkoutStreak"), { ssr: false });
const TimeSelection = dynamic(() => import("./TimeSelection"), { ssr: false });
const WorkoutMusic = dynamic(() => import("./WorkoutMusic"), { ssr: false });
const MealPlans = dynamic(() => import("./MealPlans"), { ssr: false });

export default function MobileUICollage() {
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="collage-container relative">
      {/* Toolbar */}
      <div className="fixed top-20 right-4 bg-black/80 p-2 rounded-lg shadow-lg z-50 flex flex-col gap-3">
        <button
          onClick={handleZoomIn}
          className="text-white hover:text-yellow-300 transition-colors"
          title="Zoom In"
        >
          <FaPlus size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="text-white hover:text-yellow-300 transition-colors"
          title="Zoom Out"
        >
          <FaMinus size={20} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="text-white hover:text-yellow-300 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
        </button>
      </div>

      {/* Figma-like artboard */}
      <div
        className="min-w-full overflow-x-auto overflow-y-auto bg-gray-800 min-h-screen"
        style={{
          padding: "40px",
        }}
      >
        <div
          className="figma-artboard flex flex-nowrap gap-6 p-8 bg-gray-900 rounded-lg"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-out",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Component frames */}
          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Workout Timer</div>
            </div>
            <div className="component-container">
              <WorkoutTimer />
            </div>
            <div className="frame-label">workout-timer.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Fitness Goals</div>
            </div>
            <div className="component-container">
              <FitnessGoals />
            </div>
            <div className="frame-label">fitness-goals.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Meal Prep</div>
            </div>
            <div className="component-container">
              <MealPrep />
            </div>
            <div className="frame-label">meal-prep.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Muscle Targeting</div>
            </div>
            <div className="component-container">
              <MuscleTargeting />
            </div>
            <div className="frame-label">muscle-targeting.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Workout Streak</div>
            </div>
            <div className="component-container">
              <WorkoutStreak />
            </div>
            <div className="frame-label">workout-streak.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Time Selection</div>
            </div>
            <div className="component-container">
              <TimeSelection />
            </div>
            <div className="frame-label">time-selection.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Workout Music</div>
            </div>
            <div className="component-container">
              <WorkoutMusic />
            </div>
            <div className="frame-label">workout-music.tsx</div>
          </div>

          <div className="component-frame">
            <div className="frame-header">
              <div className="frame-title">Meal Plans</div>
            </div>
            <div className="component-container">
              <MealPlans />
            </div>
            <div className="frame-label">meal-plans.tsx</div>
          </div>
        </div>
      </div>

      {/* Figma-like styling */}
      <style jsx>{`
        .component-frame {
          width: 320px;
          display: flex;
          flex-direction: column;
          background: #2c2c2c;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
          position: relative;
          flex-shrink: 0;
        }

        .frame-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e1e1e;
          padding: 8px 12px;
          border-bottom: 1px solid #3a3a3a;
        }

        .frame-title {
          font-size: 14px;
          font-weight: 600;
          color: #e4ff1a;
        }

        .component-container {
          width: 100%;
          height: 640px;
          overflow: hidden;
          background: #121212;
          position: relative;
        }

        .frame-label {
          font-size: 12px;
          color: #999;
          background: #1e1e1e;
          padding: 4px 12px;
          border-top: 1px solid #3a3a3a;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
