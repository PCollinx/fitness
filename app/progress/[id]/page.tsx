"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { format, parseISO } from "date-fns";

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

export default function ProgressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const progressId = params.id as string;

  const [progressEntry, setProgressEntry] = useState<ProgressEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      setProgressEntry(mockProgressEntry);
      setIsLoading(false);
    }, 500);
  }, [progressId]);

  const handleDelete = () => {
    // In a real app, you would call your API to delete the progress entry
    console.log("Deleting progress entry:", progressId);

    // Simulate API call
    setTimeout(() => {
      router.push("/progress/history");
      router.refresh();
    }, 500);
  };

  const metricLabels: Record<MetricType, string> = {
    weight: "Weight",
    bodyFat: "Body Fat",
    muscleMass: "Muscle Mass",
    chest: "Chest",
    waist: "Waist",
    arms: "Arms",
    legs: "Legs",
    restingHeartRate: "Resting Heart Rate",
  };

  const metricUnits: Record<MetricType, string> = {
    weight: "kg",
    bodyFat: "%",
    muscleMass: "kg",
    chest: "cm",
    waist: "cm",
    arms: "cm",
    legs: "cm",
    restingHeartRate: "bpm",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (!progressEntry) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Progress entry not found
            </h3>
            <p className="text-gray-400 mb-6">
              The progress entry you're looking for doesn't exist or has been
              deleted.
            </p>
            <Link
              href="/progress/history"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Return to Progress History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/progress/history"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Progress History</span>
          </Link>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 sm:p-8 bg-gray-900 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Progress Details
              </h1>
              <p className="text-yellow-400 text-lg font-medium">
                {format(parseISO(progressEntry.date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href={`/progress/edit/${progressEntry.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg text-sm font-semibold transition-all"
              >
                <FaEdit className="mr-2" />
                <span>Edit Entry</span>
              </Link>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {Object.entries(metricLabels).map(([key, label]) => {
                const metricKey = key as MetricType;
                const value = progressEntry.metrics[metricKey];

                return value !== undefined ? (
                  <div
                    key={key}
                    className="bg-gray-700 border border-gray-600 p-4 sm:p-5 rounded-xl hover:bg-gray-650 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-300 mb-2 text-sm uppercase tracking-wider">
                      {label}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {value.toFixed(1)}
                      <span className="text-sm sm:text-base font-normal text-yellow-400 ml-1">
                        {metricUnits[metricKey]}
                      </span>
                    </p>
                  </div>
                ) : null;
              })}
            </div>

            {/* Notes */}
            {progressEntry.notes && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Notes</h2>
                <div className="bg-gray-700 border border-gray-600 p-4 sm:p-6 rounded-xl">
                  <p className="text-gray-300 leading-relaxed">
                    {progressEntry.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-700">
              <Link
                href="/progress"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 rounded-lg text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
              >
                View Progress Charts
              </Link>

              <Link
                href="/progress/new?from=progress"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
              >
                Add New Entry
              </Link>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center mb-6 text-red-400">
                <FaTrash className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-white">
                Delete Progress Entry
              </h3>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                Are you sure you want to delete this progress entry from{" "}
                {format(parseISO(progressEntry.date), "MMMM d, yyyy")}? This
                action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  Delete Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
