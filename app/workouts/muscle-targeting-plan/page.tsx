"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "@/app/components/BackButton";
import {
  FaDumbbell,
  FaArrowRight,
  FaFire,
  FaClock,
  FaLayerGroup,
} from "react-icons/fa";

// Validation schema for step 1
const workoutPlanSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  description: z.string().optional(),
  intensity: z.enum(["Low", "Medium", "High"]).default("Medium"),
  category: z
    .enum(["Strength", "Cardio", "Flexibility", "HIIT", "Recovery"])
    .default("Strength"),
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanSchema>;

const intensityOptions = [
  {
    value: "Low",
    label: "Low Intensity",
    description: "Light workout, great for recovery days",
    color: "from-green-500 to-green-600",
    icon: "🌱",
  },
  {
    value: "Medium",
    label: "Medium Intensity",
    description: "Balanced workout for steady progress",
    color: "from-yellow-500 to-orange-500",
    icon: "🔥",
  },
  {
    value: "High",
    label: "High Intensity",
    description: "Challenging workout for maximum gains",
    color: "from-red-500 to-red-600",
    icon: "⚡",
  },
];

const categoryOptions = [
  {
    value: "Strength",
    label: "Strength Training",
    description: "Build muscle and increase power",
    icon: "💪",
  },
  {
    value: "Cardio",
    label: "Cardiovascular",
    description: "Improve heart health and endurance",
    icon: "❤️",
  },
  {
    value: "Flexibility",
    label: "Flexibility & Mobility",
    description: "Enhance range of motion and recovery",
    icon: "🧘",
  },
  {
    value: "HIIT",
    label: "High Intensity Interval",
    description: "Short bursts of intense exercise",
    icon: "⚡",
  },
  {
    value: "Recovery",
    label: "Recovery & Wellness",
    description: "Light movements for active recovery",
    icon: "🌿",
  },
];

function WorkoutPlanningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL params for pre-population
  const initialName = searchParams.get("name") || "";
  const initialDescription = searchParams.get("description") || "";
  const initialIntensity =
    (searchParams.get("intensity") as "Low" | "Medium" | "High") || "Medium";
  const initialCategory =
    (searchParams.get("category") as
      | "Strength"
      | "Cardio"
      | "Flexibility"
      | "HIIT"
      | "Recovery") || "Strength";

  const [selectedIntensity, setSelectedIntensity] = useState(initialIntensity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
      intensity: initialIntensity,
      category: initialCategory,
    },
  });

  // Update form values when URL params change
  useEffect(() => {
    setValue("name", initialName);
    setValue("description", initialDescription);
    setValue("intensity", initialIntensity);
    setValue("category", initialCategory);
    setSelectedIntensity(initialIntensity);
    setSelectedCategory(initialCategory);
  }, [
    setValue,
    initialName,
    initialDescription,
    initialIntensity,
    initialCategory,
  ]);

  const onSubmit = (data: WorkoutPlanFormValues) => {
    // Navigate to muscle targeting step with workout planning data
    const params = new URLSearchParams();
    params.append("name", data.name);
    params.append("intensity", data.intensity);
    params.append("category", data.category);
    if (data.description) {
      params.append("description", data.description);
    }

    router.push(`/workouts/muscle-targeting?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-12">
        {/* Navigation */}
        <div className="mb-6">
          <BackButton fallbackRoute="/workouts/plan" />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && <div className="w-8 h-0.5 bg-gray-700 mx-2"></div>}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Step 1 of 3</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaDumbbell className="text-4xl text-yellow-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Plan Your Workout
          </h1>
          <p className="text-gray-400 text-lg">
            Let's start by setting up the basics for your muscle-targeted
            workout
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Workout Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Workout Name *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Upper Body Blast, Push Day, etc."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-2 text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Workout Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Brief description of your workout goals..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Workout Intensity *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {intensityOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    {...register("intensity")}
                    onChange={(e) =>
                      setSelectedIntensity(
                        e.target.value as "Low" | "Medium" | "High"
                      )
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedIntensity === option.value
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <h3 className="font-medium text-white">
                            {option.label}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedIntensity === option.value
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-gray-500"
                        }`}
                      >
                        {selectedIntensity === option.value && (
                          <div className="w-full h-full rounded-full bg-yellow-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Workout Category *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {categoryOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    {...register("category")}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value as
                          | "Strength"
                          | "Cardio"
                          | "Flexibility"
                          | "HIIT"
                          | "Recovery"
                      )
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === option.value
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <h3 className="font-medium text-white">
                            {option.label}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedCategory === option.value
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-gray-500"
                        }`}
                      >
                        {selectedCategory === option.value && (
                          <div className="w-full h-full rounded-full bg-yellow-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue to Muscle Selection</span>
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-500 mb-3 flex items-center">
            <FaLayerGroup className="mr-2" />
            Planning Tips
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Choose a name that motivates you and describes the focus</p>
            <p>• Match intensity to your energy level and fitness goals</p>
            <p>• Category helps select appropriate exercises and structure</p>
            <p>• You can always modify these settings later</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutPlanningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workout planner...</p>
        </div>
      </div>
    }>
      <WorkoutPlanningContent />
    </Suspense>
  );
}
