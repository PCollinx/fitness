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
    weight: <FaWeight className="text-primary" />,
    bodyFat: <FaWeight className="text-secondary" />,
    muscleMass: <FaWeight className="text-primary-dark" />,
    chest: <FaRuler className="text-secondary-dark" />,
    waist: <FaRuler className="text-primary-light" />,
    arms: <FaRuler className="text-secondary-light" />,
    legs: <FaRuler className="text-primary" />,
    restingHeartRate: <FaHeartbeat className="text-secondary" />,
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
        return "#BB6653"; // primary
      case "bodyFat":
        return "#F08B51"; // secondary
      case "muscleMass":
        return "#A45546"; // primary-dark
      case "chest":
        return "#D87941"; // secondary-dark
      case "waist":
        return "#CF7866"; // primary-light
      case "arms":
        return "#F79F6C"; // secondary-light
      case "legs":
        return "#BB6653"; // primary
      case "restingHeartRate":
        return "#F08B51"; // secondary
      default:
        return "#BB6653"; // primary
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Progress Tracking
        </h1>
        <Link
          href="/progress/new"
          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          <span>Add Progress</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : progressData.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaWeight className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No progress entries yet
          </h3>
          <p className="text-gray-700 mb-6 font-medium">
            Start tracking your fitness progress to see your improvements over
            time
          </p>
          <Link
            href="/progress/new"
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md inline-flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            <span>Record Your First Entry</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Metric Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6">
            {Object.entries(metricLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key as MetricType)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                  selectedMetric === key
                    ? "bg-primary/10 border-2 border-primary text-primary shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 hover:shadow"
                }`}
              >
                <div className="mb-2">{metricIcons[key as MetricType]}</div>
                <span className="text-xs font-medium text-center">{label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex flex-wrap justify-end gap-2 mb-4">
            <div className="text-gray-600 mr-2 flex items-center font-medium">
              <FaCalendarAlt className="mr-1 text-secondary" />
              <span>Time Range:</span>
            </div>
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
                    ? "bg-secondary text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Summary Stats */}
          {latestEntry && earliestFilteredEntry && change && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  Latest Measurement
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {latestEntry.metrics[selectedMetric]?.toFixed(1)}
                  <span className="text-sm font-normal text-secondary ml-1">
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
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {format(parseISO(latestEntry.date), "MMMM d, yyyy")}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  Change Over Time
                </div>
                <div className="flex items-center">
                  <div
                    className={`text-2xl font-bold ${
                      change.isPositive ? "text-secondary" : "text-red-500"
                    }`}
                  >
                    {change.isPositive ? "+" : "-"}
                    {change.value}
                    <span className="text-sm font-normal text-gray-600 ml-1">
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
                        ? "bg-secondary/20 text-secondary"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {change.percentage}%
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  Since{" "}
                  {format(parseISO(earliestFilteredEntry.date), "MMMM d, yyyy")}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  Tracking Period
                </div>
                <div className="text-2xl font-bold text-primary">
                  {progressData.length} entries
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
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
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              {metricLabels[selectedMetric]} Progress
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    name={metricLabels[selectedMetric]}
                    stroke={getMetricColor(selectedMetric)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-primary">
                Recent Entries
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider"
                    >
                      Date
                    </th>
                    {Object.entries(metricLabels).map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider"
                      >
                        {label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-semibold text-primary uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {progressData
                    .slice(-5)
                    .reverse()
                    .map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {format(parseISO(entry.date), "MMM d, yyyy")}
                        </td>
                        {Object.keys(metricLabels).map((key) => (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
                          >
                            {entry.metrics[key as MetricType]?.toFixed(1) ||
                              "-"}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/progress/${entry.id}`}
                            className="text-secondary hover:text-primary transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/progress/history"
                className="text-secondary hover:text-primary font-medium transition-colors"
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
