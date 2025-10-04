"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaDumbbell,
  FaArrowRight,
  FaFire,
  FaClock,
  FaLayerGroup,
  FaArrowLeft,
} from "react-icons/fa";

const workoutPlanSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  intensity: z.enum(["Low", "Medium", "High"]).default("Medium"),
  category: z
    .enum(["Strength", "Cardio", "Flexibility", "HIIT", "Recovery"])
    .default("Strength"),
});

type WorkoutPlanValues = z.infer<typeof workoutPlanSchema>;

export default function WorkoutPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WorkoutPlanValues>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      name: "",
      intensity: "Medium",
      category: "Strength",
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: WorkoutPlanValues) => {
    setIsLoading(true);

    // Navigate to muscle targeting with workout data
    const params = new URLSearchParams({
      name: data.name,
      intensity: data.intensity,
      category: data.category,
    });

    router.push(`/workouts/muscle-targeting?${params.toString()}`);
  };

  const intensityInfo = {
    Low: {
      color: "text-green-400",
      description: "Light effort, suitable for recovery or beginners",
    },
    Medium: {
      color: "text-yellow-400",
      description: "Moderate effort, balanced workout",
    },
    High: {
      color: "text-red-400",
      description: "High effort, challenging and intense",
    },
  };

  const categoryInfo = {
    Strength: { icon: "💪", description: "Build muscle and increase strength" },
    Cardio: { icon: "❤️", description: "Improve cardiovascular fitness" },
    Flexibility: {
      icon: "🤸",
      description: "Enhance mobility and flexibility",
    },
    HIIT: { icon: "⚡", description: "High-intensity interval training" },
    Recovery: { icon: "🧘", description: "Active recovery and relaxation" },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/workouts")}
            className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div className="h-2 w-8 rounded-full bg-yellow-400"></div>
            <div className="h-2 w-8 rounded-full bg-gray-700"></div>
            <div className="h-2 w-8 rounded-full bg-gray-700"></div>
          </div>

          <div className="w-10"></div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaDumbbell className="text-4xl text-yellow-500 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Plan Your Workout</h1>
          <p className="text-gray-400 text-lg">
            Let's start by setting up the basics for your workout
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Workout Name */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-yellow-500 mb-2"
            >
              Workout Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg"
              placeholder="e.g., Upper Body Power, Leg Day Blast, Full Body HIIT"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-400">
              Give your workout a descriptive name
            </p>
          </div>

          {/* Intensity */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <label className="block text-lg font-semibold text-yellow-500 mb-4">
              <FaFire className="inline mr-2" />
              Intensity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["Low", "Medium", "High"] as const).map((level) => (
                <label
                  key={level}
                  className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    watchedValues.intensity === level
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-gray-600 bg-gray-700 hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    value={level}
                    {...register("intensity")}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${intensityInfo[level].color}`}
                    >
                      {level}
                    </div>
                    <div className="text-xs text-gray-400">
                      {level === "Low" && "🟢"}
                      {level === "Medium" && "🟡"}
                      {level === "High" && "🔴"}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-400">
              {intensityInfo[watchedValues.intensity]?.description}
            </p>
          </div>

          {/* Category */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <label className="block text-lg font-semibold text-yellow-500 mb-4">
              <FaLayerGroup className="inline mr-2" />
              Workout Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  "Strength",
                  "Cardio",
                  "Flexibility",
                  "HIIT",
                  "Recovery",
                ] as const
              ).map((cat) => (
                <label
                  key={cat}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    watchedValues.category === cat
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-gray-600 bg-gray-700 hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    value={cat}
                    {...register("category")}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{categoryInfo[cat].icon}</span>
                    <div>
                      <div className="font-medium text-white">{cat}</div>
                      <div className="text-xs text-gray-400">
                        {categoryInfo[cat].description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Workout Preview */}
          {watchedValues.name && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-yellow-400 font-semibold mb-3 flex items-center">
                <FaClock className="mr-2" />
                Workout Preview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <div className="font-medium text-white">
                    {watchedValues.name}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Intensity:</span>
                  <div
                    className={`font-medium ${
                      intensityInfo[watchedValues.intensity]?.color
                    }`}
                  >
                    {watchedValues.intensity}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <div className="font-medium text-white flex items-center">
                    <span className="mr-1">
                      {categoryInfo[watchedValues.category]?.icon}
                    </span>
                    {watchedValues.category}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={!watchedValues.name || isLoading}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                watchedValues.name && !isLoading
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
              ) : (
                <>
                  <span>Choose Muscle Groups</span>
                  <FaArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {!watchedValues.name && (
              <p className="text-center text-gray-500 text-sm mt-2">
                Enter a workout name to continue
              </p>
            )}
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">💡 Quick Tip</h3>
          <p className="text-blue-200 text-sm">
            Choose a descriptive name that reflects your workout goals. You'll
            be able to select specific muscle groups on the next step!
          </p>
        </div>
      </div>
    </div>
  );
}
