"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";

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

export default function ProgressDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const progressId = params.id as string;

  const [progressEntry, setProgressEntry] = useState<ProgressEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const data: ProgressEntry = await response.json();
      setProgressEntry(data);
    } catch (error) {
      console.error("Error fetching progress entry:", error);
      setError("Failed to load progress entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/progress/${progressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete progress entry");
      }

      router.push("/progress/history");
      router.refresh();
    } catch (error) {
      console.error("Error deleting progress entry:", error);
      setError("Failed to delete progress entry");
    }
  };

  const metricLabels = {
    weight: "Weight",
    bodyFat: "Body Fat",
    chest: "Chest",
    waist: "Waist",
    hips: "Hips",
    arms: "Arms",
    thighs: "Thighs",
  } as const;

  const metricUnits = {
    weight: "kg",
    bodyFat: "%",
    chest: "cm",
    waist: "cm",
    hips: "cm",
    arms: "cm",
    thighs: "cm",
  } as const;

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error || !progressEntry) {
    return (
      <div className="min-h-screen bg-gray-900 pt-8 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <Link
              href="/progress/history"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Progress History</span>
            </Link>
          </div>
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              {error
                ? "Error Loading Progress Entry"
                : "Progress entry not found"}
            </h3>
            <p className="text-gray-400 mb-6">
              {error ||
                "The progress entry you're looking for doesn't exist or has been deleted."}
            </p>
            {error ? (
              <button
                onClick={fetchProgressEntry}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
              >
                Try Again
              </button>
            ) : (
              <Link
                href="/progress/history"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                <FaArrowLeft className="mr-2" />
                Return to Progress History
              </Link>
            )}
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
                const value = progressEntry[key as keyof typeof metricLabels];

                return value !== null && value !== undefined ? (
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
                        {metricUnits[key as keyof typeof metricUnits]}
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
                View Progress
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
