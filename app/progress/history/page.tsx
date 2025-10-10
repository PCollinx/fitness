"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSearch, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

type ProgressHistoryResponse = {
  entries: ProgressEntry[];
  totalCount: number;
  hasMore: boolean;
};

export default function ProgressHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProgressData();
    }
  }, [status, router, searchQuery, startDate, endDate]);

  const fetchProgressData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("limit", "100"); // Fetch up to 100 entries

      const response = await fetch(`/api/progress?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch progress data");
      }

      const data: ProgressHistoryResponse = await response.json();
      setProgressData(data.entries);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setError("Failed to load progress history");
    } finally {
      setIsLoading(false);
    }
  };

  const metricLabels = {
    weight: "Weight (kg)",
    bodyFat: "Body Fat (%)",
    chest: "Chest (cm)",
    waist: "Waist (cm)",
    hips: "Hips (cm)",
    arms: "Arms (cm)",
    thighs: "Thighs (cm)",
  } as const;

  // Sort the data (data is already filtered by API)
  const sortedData = [...progressData].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);

    return sortDirection === "desc"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/progress?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete progress entry");
      }

      // Update the UI immediately for better UX
      setProgressData(progressData.filter((entry) => entry.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting progress entry:", error);
      setError("Failed to delete progress entry");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link
            href="/progress"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Progress Tracking</span>
          </Link>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">
              Progress History
            </h1>
            <p className="text-gray-400">
              View and manage your progress entries
            </p>
          </div>

          {/* Filters Section */}
          <div className="p-6 border-b border-gray-700 bg-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-400" />
                  <input
                    type="date"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    placeholder="Start date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium">to</span>
                  <input
                    type="date"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    placeholder="End date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={resetFilters}
                  className="px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-gray-800">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Error Loading Progress History
                </h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={fetchProgressData}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="text-center py-16 bg-gray-800">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-3">
                  No entries found
                </h3>
                <p className="text-gray-400 mb-6">
                  {startDate || endDate || searchQuery
                    ? "Try adjusting your search filters or date range"
                    : "You haven't recorded any progress entries yet. Start tracking your fitness journey!"}
                </p>
                {!(startDate || endDate || searchQuery) && (
                  <Link
                    href="/progress/new?from=progress"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
                  >
                    <span>Record Your First Entry</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider cursor-pointer hover:text-yellow-300 transition-colors"
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "desc" ? "asc" : "desc"
                        )
                      }
                    >
                      <div className="flex items-center">
                        <span>Date</span>
                        <span className="ml-1 text-yellow-400">
                          {sortDirection === "desc" ? "↓" : "↑"}
                        </span>
                      </div>
                    </th>
                    {Object.entries(metricLabels).map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider"
                      >
                        {label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-semibold text-yellow-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {sortedData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        {format(parseISO(entry.date), "MMM d, yyyy")}
                      </td>
                      {Object.keys(metricLabels).map((key) => {
                        const value = entry[key as keyof typeof metricLabels];
                        return (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium"
                          >
                            {value ? value.toFixed(1) : "-"}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {entry.notes || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-4">
                          <Link
                            href={`/progress/${entry.id}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-6 border-t border-gray-700 bg-gray-800 flex justify-between items-center">
            <div className="text-sm text-gray-400 font-medium">
              {sortedData.length}{" "}
              {sortedData.length === 1 ? "entry" : "entries"} found
              {totalCount > sortedData.length && ` (${totalCount} total)`}
            </div>
            <Link
              href="/progress/new?from=progress"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all"
            >
              Add New Entry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
