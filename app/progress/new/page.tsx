"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewProgressPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      weight: "",
      bodyFat: "",
      muscleMass: "",
      chest: "",
      waist: "",
      arms: "",
      legs: "",
      restingHeartRate: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log("Progress data:", data);

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
        date: data.date,
        metrics,
        notes: data.notes,
      };

      console.log("API data:", apiData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to progress page
      router.push("/progress");
      router.refresh();
    } catch (error) {
      console.error("Error saving progress:", error);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/progress"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Progress Tracking</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Record New Progress</h1>
          <p className="mt-1 text-blue-100">
            Track your fitness metrics to monitor your progress over time
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Date Selector */}
          <div className="relative">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Metrics Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Body Measurements
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter the measurements you want to track. Leave fields blank if
              you don&apos;t want to record them today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metricFields.map((field) => (
                <div key={field.id} className="relative">
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label} ({field.unit})
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id={field.id}
                      type="number"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      placeholder={field.placeholder}
                      {...register(field.id)}
                      className="block w-full pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                  {errors[field.id] && (
                    <p className="mt-1 text-sm text-red-600">
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Add any additional notes or context for this progress entry..."
              {...register("notes")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Link
              href="/progress"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  <span>Save Progress</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
