"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import {
  FaDumbbell,
  FaClock,
  FaFire,
  FaUsers,
  FaBullseye,
  FaCalendarAlt,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";

interface WorkoutPlan {
  type: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: JSX.Element;
  color: string;
  route: string;
}

export default function PlanWorkoutPage() {
  const router = useRouter();

  const workoutPlans: WorkoutPlan[] = [
    {
      type: "quick",
      title: "Quick Workout",
      description: "Create a workout in minutes with our guided builder",
      duration: "5-10 min setup",
      difficulty: "Any Level",
      icon: <FaClock className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      route: "/workouts/new?type=quick",
    },
    {
      type: "targeted",
      title: "Muscle-Targeted Plan",
      description: "Focus on specific muscle groups with targeted exercises",
      duration: "10-15 min setup",
      difficulty: "Advanced",
      icon: <FaBullseye className="text-2xl" />,
      color: "from-green-500 to-green-600",
      route: "/workouts/muscle-targeting-plan",
    },
    {
      type: "comprehensive",
      title: "Custom Workout",
      description: "Design a detailed workout with full customization",
      duration: "15-20 min setup",
      difficulty: "Intermediate",
      icon: <FaLayerGroup className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      route: "/workouts/new?type=custom",
    },
    {
      type: "schedule",
      title: "Weekly Plan",
      description: "Plan your entire week with scheduled workouts",
      duration: "20-30 min setup",
      difficulty: "All Levels",
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "from-yellow-500 to-orange-500",
      route: "/schedule?from=plan",
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: WorkoutPlan) => {
    setSelectedPlan(plan.type);
    // Small delay for visual feedback then navigate
    setTimeout(() => {
      router.push(plan.route);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-12">
        {/* Navigation */}
        <div className="mb-6">
          <BackButton fallbackRoute="/dashboard" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaBullseye className="text-5xl text-yellow-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Plan Your Workout
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose how you'd like to design your workout. Each option is
            tailored for different goals and experience levels.
          </p>
        </div>

        {/* Workout Plan Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {workoutPlans.map((plan) => (
            <div
              key={plan.type}
              className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedPlan === plan.type
                  ? "ring-2 ring-yellow-500 shadow-2xl"
                  : "hover:shadow-xl"
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div
                className={`bg-gradient-to-br ${plan.color} p-6 text-white relative`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">{plan.icon}</div>
                  <FaArrowRight className="text-white/60" />
                </div>

                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-white/80" />
                    <span className="text-white/90">{plan.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-1 text-white/80" />
                    <span className="text-white/90">{plan.difficulty}</span>
                  </div>
                </div>

                {selectedPlan === plan.type && (
                  <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center">
            <FaDumbbell className="mr-2" />
            Planning Tips
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaClock className="text-blue-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Quick Start
                  </h4>
                  <p className="text-gray-400 text-xs">
                    New to fitness? Start with Quick Workout for guided
                    creation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaBullseye className="text-green-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Targeted Training
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Focus on specific muscles for balanced strength development.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaLayerGroup className="text-purple-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Custom Control
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Advanced users can create detailed, personalized routines.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg mt-1 flex-shrink-0">
                  <FaCalendarAlt className="text-yellow-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Weekly Structure
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Plan consistent routines with scheduled workout times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Existing */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Or browse from our curated workout library
          </p>
          <Link
            href="/workouts"
            className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <FaDumbbell className="mr-2" />
            Browse Existing Workouts
          </Link>
        </div>
      </div>
    </div>
  );
}
