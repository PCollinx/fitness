"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSave, FaArrowLeft, FaCalendarAlt, FaChartLine, FaWeight, FaRulerCombined } from "react-icons/fa";
import Link from "next/link";
import { format } from "date-fns";

// Progress metric types
type MetricType =
  | "weight"
  | "bodyFat"
  | "chest"
  | "waist"
  | "arms"
  | "legs";

// Schema validation for form
const progressSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.string().optional(),
  bodyFat: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  arms: z.string().optional(),
  legs: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // At least one metric should be provided
  const metrics = [data.weight, data.bodyFat, data.chest, data.waist, data.arms, data.legs];
  return metrics.some(metric => metric && metric.trim() !== "");
}, {
  message: "At least one measurement is required",
  path: ["weight"], // This will show the error on the weight field
});

type ProgressFormData = z.infer<typeof progressSchema>;

function NewProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      weight: "",
      bodyFat: "",
      chest: "",
      waist: "",
      arms: "",
      legs: "",
      notes: "",
    },
  });

  // Watch for date changes
  const watchedDate = watch("date");

  // Dynamic back navigation based on where user came from
  const getBackPath = () => {
    const from = searchParams.get('from');
    switch (from) {
      case 'dashboard':
        return '/dashboard';
      case 'progress':
        return '/progress';
      default:
        return '/progress'; // Default fallback
    }
  };

  const getBackText = () => {
    const from = searchParams.get('from');
    switch (from) {
      case 'dashboard':
        return 'Back to Dashboard';
      case 'progress':
        return 'Back to Progress Tracking';
      default:
        return 'Back to Progress Tracking'; // Default fallback
    }
  };

  const onSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform the data for API submission
      const apiData = {
        date: data.date,
        weight: data.weight || null,
        bodyFat: data.bodyFat || null,
        chest: data.chest || null,
        waist: data.waist || null,
        arms: data.arms || null,
        thighs: data.legs || null, // Map legs to thighs for database compatibility
        notes: data.notes || null,
      };

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save progress');
      }

      // Navigate back to the previous page
      router.push(getBackPath());
      router.refresh();
    } catch (error) {
      console.error("Error saving progress:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to save progress. Please try again.");
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
      label: "Body Fat Percentage",
      unit: "%",
      placeholder: "15.5",
      step: "0.1",
      min: "3",
      max: "60",
    },
    {
      id: "chest",
      label: "Chest Circumference",
      unit: "cm",
      placeholder: "100.0",
      step: "0.1",
      min: "50",
      max: "200",
    },
    {
      id: "waist",
      label: "Waist Circumference",
      unit: "cm",
      placeholder: "85.0",
      step: "0.1",
      min: "50",
      max: "200",
    },
    {
      id: "arms",
      label: "Arm Circumference",
      unit: "cm",
      placeholder: "35.0",
      step: "0.1",
      min: "20",
      max: "80",
    },
    {
      id: "legs",
      label: "Thigh Circumference",
      unit: "cm",
      placeholder: "60.0",
      step: "0.1",
      min: "30",
      max: "120",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href={getBackPath()}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>{getBackText()}</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
            <div className="flex items-center">
              <FaChartLine className="text-3xl mr-4" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Record New Progress</h1>
                <p className="mt-2 text-black/80 text-sm sm:text-base">
                  Track your fitness metrics to monitor your progress over time
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Date Selector */}
            <div className="relative">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-white mb-2"
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
                  {...register("date", {
                    onChange: (e) => {
                      setSelectedDate(e.target.value);
                      setValue("date", e.target.value);
                    }
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors"
                />
              </div>
              {watchedDate && (
                <p className="mt-2 text-sm text-gray-300">
                  Selected: {format(new Date(watchedDate), "EEEE, MMMM d, yyyy")}
                </p>
              )}
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>

            {/* Metrics Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Body Measurements
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Enter the measurements you want to track. Leave fields blank if
                you don&apos;t want to record them today.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {metricFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-white mb-2"
                    >
                      {field.label} ({field.unit})
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        id={field.id}
                        type="number"
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        {...register(field.id)}
                        className="block w-full pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 sm:text-sm font-medium">
                          {field.unit}
                        </span>
                      </div>
                    </div>
                    {errors[field.id] && (
                      <p className="mt-1 text-sm text-red-400">
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
                className="block text-sm font-medium text-white mb-2"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Add any additional notes or context for this progress entry..."
                {...register("notes")}
                className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors resize-none"
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
              <Link
                href="/progress"
                className="px-6 py-3 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
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
    </div>
  );
}

export default function NewProgressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-800 rounded mb-6"></div>
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <NewProgressContent />
    </Suspense>
  );
}
