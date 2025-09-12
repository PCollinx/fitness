"use client";

import { useState } from "react";
import { FaChevronDown, FaEllipsisH } from "react-icons/fa";

interface MealItemProps {
  id: string;
  title: string;
  image: string;
  description: string;
  isCustom?: boolean;
}

export default function MealPlans() {
  const [activeTab, setActiveTab] = useState("breakfast");

  const mealItems: Record<string, MealItemProps[]> = {
    breakfast: [
      {
        id: "eggs-avocado",
        title: "Eggs and avocado toast",
        image: "/path/to/eggs-avocado.jpg",
        description: "350 kcal • protein: 20g • carbs: 30g",
      },
    ],
    lunch: [],
    dinner: [],
    dessert: [],
    snack: [],
  };

  const tabs = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "dessert", label: "Dessert" },
    { id: "snack", label: "Snack" },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meal plans</h1>
          <p className="text-gray-400 text-sm">
            Plan for meals curated for you
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-4 mb-6 pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-black bg-yellow-400 font-medium"
                : "text-white bg-transparent"
            } rounded-full`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex mb-6">
        <button className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-lg">
          <span className="text-gray-400">Body building mode</span>
          <FaChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Today's Breakfast Plan */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Today's breakfast prep</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
            Image Placeholder
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg">Eggs and avocado toast</h3>
            <p className="text-sm text-gray-400">
              350 kcal • protein: 20g • carbs: 30g
            </p>
            <div className="mt-2 flex justify-between items-center">
              <button className="text-red-500 text-sm">
                Not in plan? Change meal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smoothies Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">Smoothies</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
              Image Placeholder
            </div>
            <div className="p-4">
              <h3 className="font-medium">Berry protein smoothie</h3>
              <p className="text-sm text-gray-400">
                250 kcal • protein: 15g • carbs: 25g
              </p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
              Image Placeholder
            </div>
            <div className="p-4">
              <h3 className="font-medium">Green energy smoothie</h3>
              <p className="text-sm text-gray-400">
                180 kcal • protein: 5g • carbs: 30g
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles to remove scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
