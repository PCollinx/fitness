"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaCheck, FaArrowRight, FaDumbbell } from "react-icons/fa";

interface FitnessGoal {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const goals: FitnessGoal[] = [
  { 
    id: "weight-loss", 
    label: "Weight Loss", 
    description: "Burn calories and reduce body fat",
    icon: "🔥"
  },
  { 
    id: "weight-gain", 
    label: "Weight Gain", 
    description: "Build mass and increase body weight",
    icon: "⬆️"
  },
  { 
    id: "muscle-building", 
    label: "Muscle Building", 
    description: "Increase muscle mass and definition",
    icon: "💪"
  },
  { 
    id: "strength-training", 
    label: "Strength Training", 
    description: "Build functional strength and power",
    icon: "🏋️"
  },
  { 
    id: "endurance", 
    label: "Endurance", 
    description: "Improve cardiovascular fitness",
    icon: "🏃"
  },
  { 
    id: "mobility", 
    label: "Mobility & Flexibility", 
    description: "Enhance range of motion and flexibility",
    icon: "🤸"
  },
];

interface FitnessGoalsOnboardingProps {
  onComplete?: () => void;
  redirectPath?: string;
}

export default function FitnessGoalsOnboarding({ 
  onComplete,
  redirectPath = "/dashboard"
}: FitnessGoalsOnboardingProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if we're certain the user is unauthenticated
  // Don't redirect during loading state
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Redirecting to signin - no valid session");
      router.push("/auth/signin");
    }
  }, [status, router]);
    
    // If user is authenticated and has already completed onboarding, redirect to dashboard
    if (status === "authenticated" && session?.user?.hasCompletedOnboarding) {
      console.log("✅ User already completed onboarding, redirecting to dashboard");
      router.push(redirectPath);
    }
  }, [status, router, session, redirectPath]);

  const toggleGoalSelection = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one fitness goal");
      return;
    }

    setIsLoading(true);
    setError("");

    console.log("Starting onboarding submission...", { 
      selectedGoals, 
      userEmail: session?.user?.email 
    });

    try {
      const response = await fetch("/api/user/fitness-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals: selectedGoals,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save fitness goals:", errorData);
        throw new Error(errorData.error || errorData.message || "Failed to save fitness goals");
      }

      console.log("Fitness goals saved successfully");

      // Mark onboarding as completed
      try {
        const onboardingResponse = await fetch("/api/user/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: true,
          }),
        });

        if (!onboardingResponse.ok) {
          const errorData = await onboardingResponse.json();
          console.error("Failed to mark onboarding as completed:", errorData);
          throw new Error(errorData.error || "Failed to mark onboarding as completed");
        }

        console.log("Onboarding marked as completed");

        // Force session update to reflect new onboarding status
        console.log("Updating session...");
        await update();
        
        console.log("Session updated, redirecting...");
        
        // Small delay to ensure session is updated
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            router.push(redirectPath);
          }
        }, 1000); // Increased delay to ensure session refresh
      } catch (err) {
        console.error("Could not mark onboarding as completed:", err);
        setError("Failed to complete onboarding. Please try again.");
        return;
      }
    } catch (err) {
      console.error("Error saving fitness goals:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <FaDumbbell className="text-5xl text-yellow-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold mb-2">What brings you here?</h1>
          <p className="text-gray-400 text-lg">
            Select your fitness goals to get personalized workout recommendations
          </p>
          <p className="text-gray-500 text-sm mt-2">
            You can choose multiple goals
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Debug: Skip onboarding for testing */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg">
          <p className="text-yellow-400 text-sm mb-2">Debug: Having issues? Skip onboarding for now</p>
          <button
            onClick={async () => {
              console.log("Force completing onboarding...");
              setIsLoading(true);
              try {
                const response = await fetch("/api/user/onboarding", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ completed: true }),
                });
                if (response.ok) {
                  await update();
                  setTimeout(() => router.push("/dashboard"), 1000);
                } else {
                  const errorData = await response.json();
                  console.error("Skip onboarding failed:", errorData);
                }
              } catch (err) {
                console.error("Force completion failed:", err);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm"
          >
            Skip Onboarding (Debug)
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoalSelection(goal.id)}
                className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{goal.label}</h3>
                      <p className="text-gray-400 text-sm">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "bg-yellow-400 border-yellow-400"
                      : "border-gray-500"
                  }`}>
                    {isSelected && (
                      <FaCheck className="w-3 h-3 text-black" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={selectedGoals.length === 0 || isLoading}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedGoals.length > 0 && !isLoading
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          
          {selectedGoals.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-2">
              Select at least one goal to continue
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}