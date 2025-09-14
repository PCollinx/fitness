"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaWeight,
  FaRuler,
  FaHeartbeat,
  FaCalendarAlt,
} from "react-icons/fa";
import { format, subDays, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("weight");
  const [timeRange, setTimeRange] = useState<
    "7d" | "30d" | "90d" | "1y" | "all"
  >("30d");

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

  const metricIcons: Record<MetricType, React.ReactNode> = {
    weight: <FaWeight className="text-yellow-500" />,
    bodyFat: <FaWeight className="text-yellow-400" />,
    muscleMass: <FaWeight className="text-yellow-500" />,
    chest: <FaRuler className="text-yellow-400" />,
    waist: <FaRuler className="text-yellow-500" />,
    arms: <FaRuler className="text-yellow-400" />,
    legs: <FaRuler className="text-yellow-500" />,
    restingHeartRate: <FaHeartbeat className="text-yellow-400" />,
  };

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
        const date = subDays(today, i);
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

  const getTimeRangeData = () => {
    const today = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case "7d":
        cutoffDate = subDays(today, 7);
        break;
      case "30d":
        cutoffDate = subDays(today, 30);
        break;
      case "90d":
        cutoffDate = subDays(today, 90);
        break;
      case "1y":
        cutoffDate = subDays(today, 365);
        break;
      case "all":
      default:
        return progressData;
    }

    return progressData.filter((entry) => {
      const entryDate = parseISO(entry.date);
      return entryDate >= cutoffDate;
    });
  };

  const filteredData = getTimeRangeData();

  // Get the earliest and latest entries for the selected metric
  const latestEntry =
    progressData.length > 0 ? progressData[progressData.length - 1] : null;
  const earliestFilteredEntry =
    filteredData.length > 0 ? filteredData[0] : null;

  // Calculate the change in the selected metric
  const calculateChange = () => {
    if (
      !latestEntry ||
      !earliestFilteredEntry ||
      latestEntry.metrics[selectedMetric] === undefined ||
      earliestFilteredEntry.metrics[selectedMetric] === undefined
    ) {
      return null;
    }

    const latest = latestEntry.metrics[selectedMetric]!;
    const earliest = earliestFilteredEntry.metrics[selectedMetric]!;
    const change = latest - earliest;

    // For metrics where decrease is good: weight, body fat, waist, resting heart rate
    const isDecreasePositive = [
      "weight",
      "bodyFat",
      "waist",
      "restingHeartRate",
    ].includes(selectedMetric);

    const isPositiveChange = isDecreasePositive ? change < 0 : change > 0;

    return {
      value: Math.abs(change).toFixed(1),
      percentage: ((Math.abs(change) / earliest) * 100).toFixed(1),
      isPositive: isPositiveChange,
    };
  };

  const change = calculateChange();

  const chartData = filteredData.map((entry) => ({
    date: format(parseISO(entry.date), "MMM d"),
    [selectedMetric]: entry.metrics[selectedMetric],
  }));

  const getMetricColor = (metric: MetricType) => {
    switch (metric) {
      case "weight":
        return "#EAB308"; // yellow-500
      case "bodyFat":
        return "#FACC15"; // yellow-400
      case "muscleMass":
        return "#CA8A04"; // yellow-600
      case "chest":
        return "#FDE68A"; // yellow-200
      case "waist":
        return "#FEF3C7"; // yellow-100
      case "arms":
        return "#F59E0B"; // amber-500
      case "legs":
        return "#D97706"; // amber-600
      case "restingHeartRate":
        return "#FBBF24"; // amber-400
      default:
        return "#EAB308"; // yellow-500
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8 sm:mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 fade-in">
          Progress Tracking
        </h1>
        <Link
          href="/progress/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md flex items-center transition-colors font-medium fade-in w-full sm:w-auto justify-center sm:justify-start"
        >
          <FaPlus className="mr-2" />
          <span>Add Progress</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 fade-in">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : progressData.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg fade-in">
          <FaWeight className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-yellow-500 mb-2">
            No progress entries yet
          </h3>
          <p className="text-gray-300 mb-6 font-medium">
            Start tracking your fitness progress to see your improvements over
            time
          </p>
          <Link
            href="/progress/new"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-2 px-4 rounded-md inline-flex items-center transition-colors font-medium"
          >
            <FaPlus className="mr-2" />
            <span>Record Your First Entry</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Metric Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6 slide-up">
            {Object.entries(metricLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key as MetricType)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                  selectedMetric === key
                    ? "bg-gray-700 border-2 border-yellow-500 text-yellow-500 shadow-md"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:shadow"
                }`}
              >
                <div className="mb-2">{metricIcons[key as MetricType]}</div>
                <span className="text-xs font-medium text-center">{label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex flex-col sm:flex-row flex-wrap sm:justify-end gap-2 mb-4 slide-in-right">
            <div className="text-gray-300 mr-2 flex items-center font-medium mb-2 sm:mb-0">
              <FaCalendarAlt className="mr-1 text-yellow-500" />
              <span>Time Range:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "7d", label: "7 Days" },
                { value: "30d", label: "30 Days" },
                { value: "90d", label: "90 Days" },
                { value: "1y", label: "1 Year" },
                { value: "all", label: "All Time" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() =>
                    setTimeRange(
                      range.value as "7d" | "30d" | "90d" | "1y" | "all"
                    )
                  }
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    timeRange === range.value
                      ? "bg-yellow-500 text-gray-900 shadow font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:shadow"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          {latestEntry && earliestFilteredEntry && change && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 slide-up">
              <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-400 mb-1 font-medium">
                  Latest Measurement
                </div>
                <div className="text-2xl font-bold text-white">
                  {latestEntry.metrics[selectedMetric]?.toFixed(1)}
                  <span className="text-sm font-normal text-yellow-500 ml-1">
                    {selectedMetric === "weight" ||
                    selectedMetric === "muscleMass"
                      ? "kg"
                      : selectedMetric === "bodyFat"
                      ? "%"
                      : selectedMetric === "restingHeartRate"
                      ? "bpm"
                      : "cm"}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  {format(parseISO(latestEntry.date), "MMMM d, yyyy")}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-400 mb-1 font-medium">
                  Change Over Time
                </div>
                <div className="flex items-center">
                  <div
                    className={`text-2xl font-bold ${
                      change.isPositive ? "text-yellow-500" : "text-red-500"
                    }`}
                  >
                    {change.isPositive ? "+" : "-"}
                    {change.value}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {selectedMetric === "weight" ||
                      selectedMetric === "muscleMass"
                        ? "kg"
                        : selectedMetric === "bodyFat"
                        ? "%"
                        : selectedMetric === "restingHeartRate"
                        ? "bpm"
                        : "cm"}
                    </span>
                  </div>
                  <div
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      change.isPositive
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {change.percentage}%
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  Since{" "}
                  {format(parseISO(earliestFilteredEntry.date), "MMMM d, yyyy")}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-400 mb-1 font-medium">
                  Tracking Period
                </div>
                <div className="text-2xl font-bold text-yellow-500">
                  {progressData.length} entries
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  {format(parseISO(progressData[0].date), "MMMM d, yyyy")} -
                  {format(
                    parseISO(progressData[progressData.length - 1].date),
                    "MMMM d, yyyy"
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progress Chart */}
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-6 fade-in">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">
              {metricLabels[selectedMetric]} Progress
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    tickMargin={10}
                    stroke="#4B5563"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    tickMargin={10}
                    domain={["auto", "auto"]}
                    stroke="#4B5563"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.375rem",
                      color: "#F9FAFB",
                    }}
                    itemStyle={{ color: "#EAB308" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Legend wrapperStyle={{ color: "#F9FAFB" }} />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    name={metricLabels[selectedMetric]}
                    stroke="#EAB308"
                    activeDot={{ r: 8, fill: "#EAB308" }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden slide-up">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-yellow-500">
                Recent Entries
              </h2>
              <p className="text-gray-400 text-sm mt-1 hidden sm:block">
                Scroll horizontally to view all metrics
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-yellow-500 uppercase tracking-wider sticky left-0 bg-gray-900"
                    >
                      Date
                    </th>
                    {Object.entries(metricLabels).map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-yellow-500 uppercase tracking-wider"
                      >
                        {label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-semibold text-yellow-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {progressData
                    .slice(-5)
                    .reverse()
                    .map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white sticky left-0 bg-gray-800">
                          {format(parseISO(entry.date), "MMM d, yyyy")}
                        </td>
                        {Object.keys(metricLabels).map((key) => (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium"
                          >
                            {entry.metrics[key as MetricType]?.toFixed(1) ||
                              "-"}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/progress/${entry.id}`}
                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-700">
              <Link
                href="/progress/history"
                className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
              >
                View All Entries
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
