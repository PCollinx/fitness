"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaPlus, 
  FaSearch, 
  FaUtensils, 
  FaCalendarAlt, 
  FaChartBar 
} from "react-icons/fa";

type NutritionEntry = {
  id: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DailySummary = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  entries: NutritionEntry[];
};

export default function NutritionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [nutritionData, setNutritionData] = useState<Record<string, DailySummary>>({});

  useEffect(() => {
    // In a real app, you would fetch actual data from your API
    // This is just mock data for demonstration
    setIsLoading(true);

    setTimeout(() => {
      // Generate some sample data for the last 7 days
      const mockData: Record<string, DailySummary> = {};
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        
        // Create entries for each meal type
        const entries: NutritionEntry[] = [];
        
        // Breakfast
        if (Math.random() > 0.2) { // 80% chance to have breakfast
          entries.push({
            id: `breakfast-${dateString}`,
            date: dateString,
            mealType: "Breakfast",
            name: "Oatmeal with Berries",
            calories: 350,
            protein: 12,
            carbs: 60,
            fat: 6
          });
        }
        
        // Lunch
        if (Math.random() > 0.1) { // 90% chance to have lunch
          entries.push({
            id: `lunch-${dateString}`,
            date: dateString,
            mealType: "Lunch",
            name: "Chicken Salad",
            calories: 450,
            protein: 35,
            carbs: 15,
            fat: 22
          });
        }
        
        // Dinner
        if (Math.random() > 0.1) { // 90% chance to have dinner
          entries.push({
            id: `dinner-${dateString}`,
            date: dateString,
            mealType: "Dinner",
            name: "Salmon with Vegetables",
            calories: 550,
            protein: 40,
            carbs: 25,
            fat: 25
          });
        }
        
        // Snacks (0-2 snacks)
        const snackCount = Math.floor(Math.random() * 3);
        for (let j = 0; j < snackCount; j++) {
          entries.push({
            id: `snack-${j}-${dateString}`,
            date: dateString,
            mealType: "Snack",
            name: j === 0 ? "Protein Bar" : "Greek Yogurt",
            calories: j === 0 ? 200 : 150,
            protein: j === 0 ? 15 : 20,
            carbs: j === 0 ? 20 : 8,
            fat: j === 0 ? 8 : 5
          });
        }
        
        // Calculate daily totals
        const totals = entries.reduce(
          (acc, entry) => {
            return {
              calories: acc.calories + entry.calories,
              protein: acc.protein + entry.protein,
              carbs: acc.carbs + entry.carbs,
              fat: acc.fat + entry.fat
            };
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        
        mockData[dateString] = {
          date: dateString,
          ...totals,
          entries
        };
      }
      
      setNutritionData(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get selected day's nutrition data
  const selectedDayData = nutritionData[selectedDate];

  // Calculate daily goal percentages
  const calculatePercentage = (value: number, goal: number) => {
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  // Daily goals (these would be user-specific in a real app)
  const goals = {
    calories: 2200,
    protein: 140,
    carbs: 220,
    fat: 70
  };

  // Filter entries based on search query
  const filteredEntries = selectedDayData?.entries.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.mealType.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Nutrition Tracker</h1>
        <Link
          href="/nutrition/log"
          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          <span>Log Meal</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Calendar and Daily Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Selector */}
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-700">Select Date</h2>
                <FaCalendarAlt className="text-sky-500" />
              </div>
              <div className="space-y-2">
                {Object.keys(nutritionData)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedDate === date
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">Daily Summary</h2>
              
              {selectedDayData ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Calories</span>
                      <span className="text-gray-800 font-medium">
                        {selectedDayData.calories} / {goals.calories} kcal
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-700 h-2.5 rounded-full"
                        style={{ width: `${calculatePercentage(selectedDayData.calories, goals.calories)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 text-sm">Protein</span>
                        <span className="text-gray-800 text-sm font-medium">{selectedDayData.protein}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${calculatePercentage(selectedDayData.protein, goals.protein)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 text-sm">Carbs</span>
                        <span className="text-gray-800 text-sm font-medium">{selectedDayData.carbs}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-sky-500 h-2.5 rounded-full"
                          style={{ width: `${calculatePercentage(selectedDayData.carbs, goals.carbs)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 text-sm">Fat</span>
                        <span className="text-gray-800 text-sm font-medium">{selectedDayData.fat}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: `${calculatePercentage(selectedDayData.fat, goals.fat)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Remaining</span>
                      <span className="text-blue-700 font-medium">
                        {Math.max(0, goals.calories - selectedDayData.calories)} kcal
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No data available for this date.</p>
              )}
            </div>
          </div>

          {/* Right column - Meal Entries */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-blue-700" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-700 focus:border-blue-700 focus:ring-2 transition-colors duration-200 sm:text-sm"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Meal Entries */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <h2 className="text-lg font-semibold p-5 text-blue-700">
                  {formatDate(selectedDate)} - Meals
                </h2>
              </div>

              {filteredEntries.length > 0 ? (
                <div>
                  {/* Group by meal type */}
                  {(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map(mealType => {
                    const mealEntries = filteredEntries.filter(entry => entry.mealType === mealType);
                    if (mealEntries.length === 0) return null;
                    
                    return (
                      <div key={mealType} className="border-b border-gray-100 last:border-b-0">
                        <div className="px-5 py-3 bg-gray-50">
                          <h3 className="font-medium text-gray-800">{mealType}</h3>
                        </div>
                        
                        {mealEntries.map(entry => (
                          <div key={entry.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">{entry.name}</h4>
                                <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-gray-600">
                                  <span>{entry.calories} kcal</span>
                                  <span>P: {entry.protein}g</span>
                                  <span>C: {entry.carbs}g</span>
                                  <span>F: {entry.fat}g</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Link
                                  href={`/nutrition/edit/${entry.id}`}
                                  className="text-blue-700 hover:text-blue-800 transition-colors"
                                >
                                  Edit
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FaUtensils className="mx-auto h-12 w-12 text-sky-500 opacity-40 mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    No meals logged
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? "No meals match your search criteria" 
                      : "You haven't logged any meals for this day yet"}
                  </p>
                  <Link
                    href="/nutrition/log"
                    className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md inline-flex items-center transition-colors duration-200"
                  >
                    <FaPlus className="mr-2" />
                    <span>Log a Meal</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Weekly Analysis */}
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-700">Weekly Analysis</h2>
                <FaChartBar className="text-sky-500" />
              </div>
              
              <div className="h-64 mt-4">
                <div className="h-56 flex items-end justify-between space-x-2">
                  {Object.values(nutritionData)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(-7)
                    .map(day => (
                      <div key={day.date} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className={`w-full bg-blue-500 rounded-t-sm ${day.date === selectedDate ? 'bg-blue-700' : ''}`}
                            style={{ height: `${Math.min((day.calories / goals.calories) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">Calories vs Goal</span>
                  <span className="text-xs text-gray-600">{goals.calories} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
