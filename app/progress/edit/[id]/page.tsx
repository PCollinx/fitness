"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSave, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { format } from "date-fns";

// Progress metric types
type MetricType =
  | "weight"
  | "bodyFat"
  | "muscleMass"
  | "chest"
  | "waist"
  | "arms"
  | "legs"
  | "restingHeartRate";

// Progress entry
type ProgressEntry = {
  id: string;
  date: string;
  metrics: {
    [key in MetricType]?: number;
  };
  notes?: string;
};

// Schema validation for form
const progressSchema = z.object({
  date: z.string(),
  weight: z.string().optional(),
  bodyFat: z.string().optional(),
  muscleMass: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  arms: z.string().optional(),
  legs: z.string().optional(),
  restingHeartRate: z.string().optional(),
  notes: z.string().optional(),
});

type ProgressFormData = z.infer<typeof progressSchema>;

export default function EditProgressPage() {
  const params = useParams();
  const router = useRouter();
  const progressId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
  });

  useEffect(() => {
    // In a real app, fetch progress entry from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      // This would be an API call in a real app
      // Generate a mock progress entry
      const baseWeight = 80;
      const baseBodyFat = 20;
      const baseMuscleMass = 35;
      const baseChest = 100;
      const baseWaist = 85;
      const baseArms = 35;
      const baseLegs = 60;
      const baseHeartRate = 65;

      // Extract the day number from the ID if it matches the pattern
      const dayMatch = progressId.match(/progress-(\d+)/);
      const day = dayMatch ? parseInt(dayMatch[1]) : 0;

      // Random fluctuation
      const randomFactor = (Math.random() - 0.3) * 2;

      // Trend factor (decreases over time for weight, body fat, waist, heart rate)
      // Increases for muscle mass, chest, arms, legs
      const trendFactor = day / 90;

      const today = new Date();
      const date = new Date();
      date.setDate(today.getDate() - day);

      const mockProgressEntry: ProgressEntry = {
        id: progressId,
        date: format(date, "yyyy-MM-dd"),
        metrics: {
          weight: +(baseWeight - trendFactor * 5 + randomFactor).toFixed(1),
          bodyFat: +(baseBodyFat - trendFactor * 3 + randomFactor).toFixed(1),
          muscleMass: +(
            baseMuscleMass +
            trendFactor * 2 +
            randomFactor
          ).toFixed(1),
          chest: +(baseChest + trendFactor * 3 + randomFactor).toFixed(1),
          waist: +(baseWaist - trendFactor * 4 + randomFactor).toFixed(1),
          arms: +(baseArms + trendFactor * 1 + randomFactor).toFixed(1),
          legs: +(baseLegs + trendFactor * 2 + randomFactor).toFixed(1),
          restingHeartRate: +(
            baseHeartRate -
            trendFactor * 5 +
            randomFactor
          ).toFixed(0),
        },
        notes:
          day % 15 === 0
            ? "Monthly measurement"
            : day % 7 === 0
            ? "Weekly check-in"
            : undefined,
      };

      // Set form values
      reset({
        date: mockProgressEntry.date,
        weight: mockProgressEntry.metrics.weight?.toString() || "",
        bodyFat: mockProgressEntry.metrics.bodyFat?.toString() || "",
        muscleMass: mockProgressEntry.metrics.muscleMass?.toString() || "",
        chest: mockProgressEntry.metrics.chest?.toString() || "",
        waist: mockProgressEntry.metrics.waist?.toString() || "",
        arms: mockProgressEntry.metrics.arms?.toString() || "",
        legs: mockProgressEntry.metrics.legs?.toString() || "",
        restingHeartRate:
          mockProgressEntry.metrics.restingHeartRate?.toString() || "",
        notes: mockProgressEntry.notes || "",
      });

      setIsLoading(false);
    }, 500);
  }, [progressId, reset]);

  const onSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log("Updated progress data:", data);

      // Transform the data for API submission
      const metrics: Record<string, number | undefined> = {
        weight: data.weight ? parseFloat(data.weight) : undefined,
        bodyFat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
        muscleMass: data.muscleMass ? parseFloat(data.muscleMass) : undefined,
        chest: data.chest ? parseFloat(data.chest) : undefined,
        waist: data.waist ? parseFloat(data.waist) : undefined,
        arms: data.arms ? parseFloat(data.arms) : undefined,
        legs: data.legs ? parseFloat(data.legs) : undefined,
        restingHeartRate: data.restingHeartRate
          ? parseFloat(data.restingHeartRate)
          : undefined,
      };

      const apiData = {
        id: progressId,
        date: data.date,
        metrics,
        notes: data.notes,
      };

      console.log("API data:", apiData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to progress details page
      router.push(`/progress/${progressId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricFields: Array<{
    id: MetricType;
    label: string;
    unit: string;
    placeholder: string;
    step?: string;
    min?: string;
    max?: string;
  }> = [
    {
      id: "weight",
      label: "Weight",
      unit: "kg",
      placeholder: "75.5",
      step: "0.1",
      min: "30",
      max: "300",
    },
    {
      id: "bodyFat",
      label: "Body Fat",
      unit: "%",
      placeholder: "15.5",
      step: "0.1",
      min: "3",
      max: "60",
    },
    {
      id: "muscleMass",
      label: "Muscle Mass",
      unit: "kg",
      placeholder: "35.0",
      step: "0.1",
      min: "10",
      max: "100",
    },
    {
      id: "chest",
      label: "Chest",
      unit: "cm",
      placeholder: "100.0",
      step: "0.1",
      min: "50",
      max: "200",
    },
    {
      id: "waist",
      label: "Waist",
      unit: "cm",
      placeholder: "85.0",
      step: "0.1",
      min: "50",
      max: "200",
    },
    {
      id: "arms",
      label: "Arms",
      unit: "cm",
      placeholder: "35.0",
      step: "0.1",
      min: "20",
      max: "80",
    },
    {
      id: "legs",
      label: "Legs",
      unit: "cm",
      placeholder: "60.0",
      step: "0.1",
      min: "30",
      max: "120",
    },
    {
      id: "restingHeartRate",
      label: "Resting Heart Rate",
      unit: "bpm",
      placeholder: "65",
      step: "1",
      min: "30",
      max: "120",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link
            href={`/progress/${progressId}`}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Progress Details</span>
          </Link>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 sm:p-8 bg-gray-900 border-b border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Edit Progress Entry
            </h1>
            <p className="text-gray-400">
              Update your recorded progress metrics and notes
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 space-y-8"
          >
            {/* Date Selector */}
            <div className="relative">
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-white mb-2"
              >
                Date*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-yellow-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                />
              </div>
              {errors.date && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Metrics Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Body Measurements
              </h2>
              <p className="text-gray-400 mb-6">
                Update the measurements you want to track. Leave fields blank if
                you don&apos;t want to record them.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {metricFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-semibold text-white mb-2"
                    >
                      {field.label} ({field.unit})
                    </label>
                    <div className="relative">
                      <input
                        id={field.id}
                        type="number"
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        {...register(field.id)}
                        className="block w-full pr-12 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-yellow-400 text-sm font-medium">
                          {field.unit}
                        </span>
                      </div>
                    </div>
                    {errors[field.id] && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors[field.id]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-semibold text-white mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Add any additional notes or context for this progress entry..."
                {...register("notes")}
                className="block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
              <Link
                href={`/progress/${progressId}`}
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-600 rounded-lg text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
