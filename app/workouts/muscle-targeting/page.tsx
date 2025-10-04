"use client";

import { Suspense } from "react";
import MuscleTargetingWorkout from "../../components/MuscleTargetingWorkout";

// Loading fallback component
function MuscleTargetingLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-800 rounded-lg p-6 h-96"></div>
        </div>
      </div>
    </div>
  );
}

export default function MuscleTargetingPage() {
  return (
    <Suspense fallback={<MuscleTargetingLoading />}>
      <MuscleTargetingWorkout
        redirectPath="/workouts/create-with-muscles"
        step={2}
        totalSteps={3}
      />
    </Suspense>
  );
}