"use client";

import { useState } from "react";
import { FaArrowLeft, FaStar, FaClock, FaFireAlt } from "react-icons/fa";
import Image from "next/image";

interface RecipeProps {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  calories: number;
  rating: number;
  ingredients: {
    name: string;
    amount: string;
    calories: number;
  }[];
}

export default function MealPrep() {
  const [activeTab, setActiveTab] = useState("breakfast");

  const recipe: RecipeProps = {
    id: "eggs-avocado-toast",
    title: "Eggs and avocado toast",
    image: "/path/to/eggs-avocado-toast.jpg", // This would need to be updated with a real image
    prepTime: "15 mins",
    calories: 350,
    rating: 4.8,
    ingredients: [
      { name: "Large eggs", amount: "2", calories: 156 },
      { name: "Avocado", amount: "1/2", calories: 114 },
      { name: "Whole grain bread", amount: "1 slice", calories: 80 },
    ],
  };

  const tabs = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "dessert", label: "Dessert" },
    { id: "snack", label: "Snack" },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button className="text-white p-2">
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-xl font-medium">Meal prep</h1>
        <div className="w-10"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Meal Image */}
      <div className="relative h-72 w-full">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          {/* This would be replaced with an actual image */}
          <div className="text-center">
            <p className="text-xl">Image Placeholder</p>
            <p className="text-sm text-gray-400">Eggs and avocado toast</p>
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          <div className="flex items-center text-yellow-400">
            <FaStar className="h-4 w-4" />
            <span className="ml-1 text-sm">{recipe.rating}</span>
          </div>
        </div>

        <div className="flex space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <FaClock className="h-4 w-4 mr-1" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center">
            <FaFireAlt className="h-4 w-4 mr-1" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Ingredients</h3>
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-800"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-800 rounded-md mr-3"></div>
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-400">{ingredient.amount}</p>
                  </div>
                </div>
                <p className="text-gray-400">{ingredient.calories} kcal</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs for meal types */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="grid grid-cols-5 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 rounded-md text-sm ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-black font-medium"
                  : "bg-transparent text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
