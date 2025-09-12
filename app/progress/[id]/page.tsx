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
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!progressEntry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Progress entry not found
          </h3>
          <Link
            href="/progress/history"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Progress History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/progress/history"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Progress History</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Progress Details</h1>
            <p className="text-blue-100 mt-1">
              {format(parseISO(progressEntry.date), "MMMM d, yyyy")}
            </p>
          </div>

          <div className="flex space-x-2">
            <Link
              href={`/progress/edit/${progressEntry.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-md text-sm"
            >
              <FaEdit className="mr-1" />
              <span>Edit</span>
            </Link>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm"
            >
              <FaTrash className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(metricLabels).map(([key, label]) => {
              const metricKey = key as MetricType;
              const value = progressEntry.metrics[metricKey];

              return value !== undefined ? (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-1">{label}</h3>
                  <p className="text-2xl font-semibold">
                    {value.toFixed(1)}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {metricUnits[metricKey]}
                    </span>
                  </p>
                </div>
              ) : null;
            })}
          </div>

          {/* Notes */}
          {progressEntry.notes && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Notes</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{progressEntry.notes}</p>
              </div>
            </div>
          )}

          {/* Previous & Next Entries Navigation - In a real app, you'd have links to navigate */}
          <div className="flex justify-between mt-8">
            <Link
              href="/progress"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Progress Chart
            </Link>

            <Link
              href="/progress/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <FaTrash className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">
              Delete Progress Entry
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this progress entry from{" "}
              {format(parseISO(progressEntry.date), "MMMM d, yyyy")}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
