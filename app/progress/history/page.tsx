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
    <div className="container mx-auto px-4 py-8">
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
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Progress History</h1>
          <p className="text-gray-500 mt-1">
            View and manage your progress entries
          </p>
        </div>

        {/* Filters Section */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No entries found
            </h3>
            <p className="text-gray-500 mb-4">
              {startDate || endDate || searchQuery
                ? "Try adjusting your search filters"
                : "You haven't recorded any progress yet"}
            </p>
            {!(startDate || endDate || searchQuery) && (
              <Link
                href="/progress/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>Record Your First Entry</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      setSortDirection(
                        sortDirection === "desc" ? "asc" : "desc"
                      )
                    }
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      <span className="ml-1">
                        {sortDirection === "desc" ? "↓" : "↑"}
                      </span>
                    </div>
                  </th>
                  {Object.entries(metricLabels).map(([key, label]) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {label}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Notes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(parseISO(entry.date), "MMM d, yyyy")}
                    </td>
                    {Object.keys(metricLabels).map((key) => (
                      <td
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {entry.metrics[key as MetricType]?.toFixed(1) || "-"}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {entry.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <Link
                          href={`/progress/${entry.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
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

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredData.length} entries
          </div>
          <Link
            href="/progress/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Entry
          </Link>
        </div>
      </div>
    </div>
  );
}
