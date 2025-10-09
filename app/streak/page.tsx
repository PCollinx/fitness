"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import WorkoutStreak from "@/app/components/WorkoutStreak";

export default function StreakPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/workouts");
  };

  const handleEnd = () => {
    router.push("/dashboard");
  };
  return (
    <div className="min-h-screen pt-16 md:pt-0 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation Header */}
      <div className="absolute top-4 pt-16 left-4 z-10">
        <BackButton
          fallbackRoute="/dashboard"
          className="flex items-center text-white hover:text-yellow-400 transition-colors"
          text="Dashboard"
        />
      </div>

      {/* Streak Component */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        }
      >
        <WorkoutStreak
          onContinue={handleContinue}
          onEnd={handleEnd}
          showActions={true}
        />
      </Suspense>
    </div>
  );
}
