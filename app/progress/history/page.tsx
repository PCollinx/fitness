"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaSearch, FaTrash, FaCalendarAlt } from "react-icons/fa";
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

export default function ProgressHistoryPage() {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // In a real app, fetch progress data from the API
    // For now, we'll use mock data
    setIsLoading(true);

    setTimeout(() => {
      // Generate mock progress data for the past 90 days
      const mockData: ProgressEntry[] = [];
      const today = new Date();

      // Generate random progress over time with a slight upward or downward trend
      // based on the metric
      for (let i = 90; i >= 0; i -= 3) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = format(date, "yyyy-MM-dd");

        // Base values for each metric
        const baseWeight = 80;
        const baseBodyFat = 20;
        const baseMuscleMass = 35;
        const baseChest = 100;
        const baseWaist = 85;
        const baseArms = 35;
        const baseLegs = 60;
        const baseHeartRate = 65;

        // Random fluctuation
        const randomFactor = (Math.random() - 0.3) * 2;

        // Trend factor (decreases over time for weight, body fat, waist, heart rate)
        // Increases for muscle mass, chest, arms, legs
        const trendFactor = i / 90;

        mockData.push({
          id: `progress-${i}`,
          date: formattedDate,
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
          notes: i % 15 === 0 ? "Monthly measurement" : undefined,
        });
      }

      setProgressData(mockData);
      setIsLoading(false);
    }, 500);
  }, []);

  const metricLabels: Record<MetricType, string> = {
    weight: "Weight (kg)",
    bodyFat: "Body Fat (%)",
    muscleMass: "Muscle Mass (kg)",
    chest: "Chest (cm)",
    waist: "Waist (cm)",
    arms: "Arms (cm)",
    legs: "Legs (cm)",
    restingHeartRate: "Resting Heart Rate (bpm)",
  };

  // Filter data based on search query and date range
  const filteredData = progressData.filter((entry) => {
    // Filter by date range
    const entryDate = parseISO(entry.date);
    const isAfterStartDate = !startDate || entryDate >= parseISO(startDate);
    const isBeforeEndDate = !endDate || entryDate <= parseISO(endDate);

    // Filter by search query (check notes)
    const matchesSearch =
      !searchQuery ||
      (entry.notes &&
        entry.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return isAfterStartDate && isBeforeEndDate && matchesSearch;
  });

  // Sort the data
  const sortedData = [...filteredData].sort((a, b) => {
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

  const handleDelete = (id: string) => {
    // In a real app, you would call your API to delete the entry
    console.log("Deleting progress entry:", id);

    // Update the UI immediately for better UX
    setProgressData(progressData.filter((entry) => entry.id !== id));
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
                      {Object.keys(metricLabels).map((key) => (
                        <td
                          key={key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium"
                        >
                          {entry.metrics[key as MetricType]?.toFixed(1) || "-"}
                        </td>
                      ))}
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
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "entry" : "entries"} found
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
