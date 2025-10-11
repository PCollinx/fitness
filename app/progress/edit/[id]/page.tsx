"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaSave, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import BackButton from "@/app/components/BackButton";

// Progress entry from database
type ProgressEntry = {
  id: string;
  date: string;
  weight?: number | null;
  bodyFat?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  arms?: number | null;
  thighs?: number | null;
  notes?: string | null;
};

// Schema validation for form
const progressSchema = z.object({
  date: z.string(),
  weight: z.string().optional(),
  bodyFat: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  arms: z.string().optional(),
  thighs: z.string().optional(),
  notes: z.string().optional(),
});

type ProgressFormData = z.infer<typeof progressSchema>;

export default function EditProgressPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const progressId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProgressEntry();
    }
  }, [status, router, progressId]);

  const fetchProgressEntry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/progress/${progressId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Progress entry not found");
        } else {
          throw new Error("Failed to fetch progress entry");
        }
        return;
      }

      const progressEntry: ProgressEntry = await response.json();

      // Set form values
      reset({
        date: format(new Date(progressEntry.date), "yyyy-MM-dd"),
        weight: progressEntry.weight?.toString() || "",
        bodyFat: progressEntry.bodyFat?.toString() || "",
        chest: progressEntry.chest?.toString() || "",
        waist: progressEntry.waist?.toString() || "",
        hips: progressEntry.hips?.toString() || "",
        arms: progressEntry.arms?.toString() || "",
        thighs: progressEntry.thighs?.toString() || "",
        notes: progressEntry.notes || "",
      });
    } catch (error) {
      console.error("Error fetching progress entry:", error);
      setError("Failed to load progress entry");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Transform the data for API submission
      const apiData = {
        date: data.date,
        weight: data.weight || null,
        bodyFat: data.bodyFat || null,
        chest: data.chest || null,
        waist: data.waist || null,
        hips: data.hips || null,
        arms: data.arms || null,
        thighs: data.thighs || null,
        notes: data.notes || null,
      };

      const response = await fetch(`/api/progress/${progressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update progress entry");
      }

      // Navigate back to progress details page
      router.push(`/progress/${progressId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update progress entry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricFields = [
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
      id: "hips",
      label: "Hip Circumference",
      unit: "cm",
      placeholder: "95.0",
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
      id: "thighs",
      label: "Thigh Circumference",
      unit: "cm",
      placeholder: "60.0",
      step: "0.1",
      min: "30",
      max: "120",
    },
  ] as const;

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Error Loading Progress Entry
            </h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchProgressEntry}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <BackButton
            fallbackRoute="/progress"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            text="Back to Progress Details"
          />
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
                        className="block w-full pr-12 px-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-yellow-400 text-sm font-medium">
                          {field.unit}
                        </span>
                      </div>
                    </div>
                    {errors[field.id as keyof ProgressFormData] && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors[field.id as keyof ProgressFormData]?.message}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

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
