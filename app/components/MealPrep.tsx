"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { recipeData, RecipeProps } from "../data/recipes";
import RecipeCard from "./RecipeCard";

export default function MealPrep() {
  const [activeTab, setActiveTab] = useState("breakfast");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mealFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mealFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snack", label: "Snack" },
    { id: "favorites", label: "Favorites" },
  ];

  // Get favorite recipes
  const getFavoriteRecipes = (): RecipeProps[] => {
    const allRecipes = Object.values(recipeData).flat();
    return allRecipes.filter(recipe => favorites.includes(recipe.id));
  };

  // Get recipes for the current tab
  const getCurrentTabRecipes = (): RecipeProps[] => {
    if (activeTab === 'favorites') {
      return getFavoriteRecipes();
    }
    return recipeData[activeTab as keyof typeof recipeData] || [];
  };

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black bg-opacity-95 backdrop-blur-sm shadow-md">
        <div className="p-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="text-white p-2">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-medium ml-2">Meal Prep</h1>
          </div>
          <Link href="/" className="p-2 text-white">
            <FaHome className="h-5 w-5" />
          </Link>
        </div>
        
        {/* Tabs for meal types */}
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-2 px-4 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-yellow-500 text-black font-medium"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {activeTab === 'favorites' 
                ? 'Your Favorite Meals' 
                : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Meals`}
            </h2>
            <p className="text-gray-400">
              {activeTab === 'favorites'
                ? 'Your saved favorite meals for quick access'
                : `Simple and healthy ${activeTab} options for your meal plan`}
            </p>
          </div>
          
          {/* Recipe List */}
          <div className="mb-8">
            {getCurrentTabRecipes().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCurrentTabRecipes().map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.includes(recipe.id)}
                    view="simple"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                {activeTab === 'favorites' ? (
                  <div>
                    <p className="text-gray-400 mb-2">You don't have any favorite meals yet.</p>
                    <p className="text-gray-500 text-sm">Browse meals and click the heart icon to add favorites.</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No meals available in this category yet.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Access Compact View */}
          {activeTab !== 'favorites' && favorites.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Your Favorites</h3>
              <div className="grid grid-cols-1 gap-2">
                {getFavoriteRecipes().slice(0, 3).map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                    view="compact"
                  />
                ))}
                {favorites.length > 3 && (
                  <button 
                    className="bg-gray-800 rounded-lg p-3 text-gray-400 hover:bg-gray-700 transition-colors text-sm"
                    onClick={() => setActiveTab('favorites')}
                  >
                    View all {favorites.length} favorites...
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom styles */}
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
