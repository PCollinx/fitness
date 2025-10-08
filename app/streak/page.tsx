"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
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
        <Link
          href="/dashboard"
          className="flex items-center text-white hover:text-yellow-400 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Dashboard
        </Link>
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
