"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaSearch,
  FaUtensils,
  FaCalendarAlt,
  FaChartBar,
  FaFilter,
  FaArrowRight,
  FaRegClock,
  FaRegStar,
} from "react-icons/fa";

type Recipe = {
  id: string;
  name: string;
  category: string;
  prepTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  ingredients: string[];
  favorite?: boolean;
};

type MealPlan = {
  id: string;
  name: string;
  type: string;
  recipes: Recipe[];
};

export default function NutritionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    // Simulate loading data from API
    setIsLoading(true);

    setTimeout(() => {
      // Sample recipes
      const sampleRecipes: Recipe[] = [
        {
          id: "1",
          name: "Eggs and avocado toast",
          category: "Breakfast",
          prepTime: 15,
          calories: 420,
          protein: 22,
          carbs: 30,
          fat: 28,
          image:
            "https://source.unsplash.com/random/400x300/?avocado,toast,eggs",
          ingredients: [
            "2 eggs",
            "1 avocado",
            "2 slices whole grain bread",
            "Salt",
            "Pepper",
            "Red pepper flakes",
          ],
          favorite: true,
        },
        {
          id: "2",
          name: "Protein smoothie",
          category: "Snack",
          prepTime: 5,
          calories: 320,
          protein: 30,
          carbs: 25,
          fat: 10,
          image: "https://source.unsplash.com/random/400x300/?smoothie,protein",
          ingredients: [
            "1 banana",
            "1 scoop protein powder",
            "1 cup almond milk",
            "1 tbsp peanut butter",
            "Ice cubes",
          ],
        },
        {
          id: "3",
          name: "Grilled chicken salad",
          category: "Lunch",
          prepTime: 20,
          calories: 380,
          protein: 35,
          carbs: 15,
          fat: 18,
          image: "https://source.unsplash.com/random/400x300/?chicken,salad",
          ingredients: [
            "6 oz chicken breast",
            "Mixed greens",
            "Cherry tomatoes",
            "Cucumber",
            "Olive oil",
            "Balsamic vinegar",
          ],
        },
        {
          id: "4",
          name: "Salmon with roasted vegetables",
          category: "Dinner",
          prepTime: 25,
          calories: 450,
          protein: 40,
          carbs: 20,
          fat: 22,
          image:
            "https://source.unsplash.com/random/400x300/?salmon,vegetables",
          ingredients: [
            "6 oz salmon fillet",
            "Broccoli",
            "Bell peppers",
            "Zucchini",
            "Olive oil",
            "Lemon",
            "Garlic",
          ],
        },
        {
          id: "5",
          name: "Greek yogurt with berries",
          category: "Snack",
          prepTime: 5,
          calories: 180,
          protein: 18,
          carbs: 15,
          fat: 6,
          image: "https://source.unsplash.com/random/400x300/?yogurt,berries",
          ingredients: [
            "1 cup Greek yogurt",
            "Mixed berries",
            "1 tsp honey",
            "Granola",
          ],
        },
        {
          id: "6",
          name: "Sweet potato and black bean bowl",
          category: "Lunch",
          prepTime: 30,
          calories: 410,
          protein: 15,
          carbs: 65,
          fat: 12,
          image:
            "https://source.unsplash.com/random/400x300/?sweet,potato,bowl",
          ingredients: [
            "1 sweet potato",
            "1/2 cup black beans",
            "1/4 avocado",
            "Quinoa",
            "Cilantro",
            "Lime",
          ],
        },
      ];

      // Sample meal plans
      const sampleMealPlans: MealPlan[] = [
        {
          id: "1",
          name: "Weekly meal plan",
          type: "Balanced",
          recipes: [
            sampleRecipes[0],
            sampleRecipes[2],
            sampleRecipes[3],
            sampleRecipes[4],
          ],
        },
        {
          id: "2",
          name: "High protein plan",
          type: "Bulking",
          recipes: [
            sampleRecipes[0],
            sampleRecipes[1],
            sampleRecipes[2],
            sampleRecipes[3],
          ],
        },
        {
          id: "3",
          name: "Low carb options",
          type: "Cutting",
          recipes: [sampleRecipes[2], sampleRecipes[3], sampleRecipes[4]],
        },
      ];

      setRecipes(sampleRecipes);
      setMealPlans(sampleMealPlans);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      recipe.category.toLowerCase() === activeCategory.toLowerCase() ||
      (activeCategory === "Favorites" && recipe.favorite);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meal Plans</h1>
          <p className="text-gray-400">Healthy meals curated for you</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
            <FaFilter className="mr-2" /> Filter
          </button>
          <Link
            href="/nutrition/create"
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg flex items-center font-medium"
          >
            <FaPlus className="mr-2" /> Create
          </Link>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Meal categories */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {["All", "Breakfast", "Lunch", "Dinner", "Snack", "Favorites"].map(
          (category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                category === activeCategory
                  ? "bg-yellow-400 text-black font-medium"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <>
          {/* Today's meal plan */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Today's breakfast prep
              </h2>
              <Link
                href="/nutrition/meal-plans"
                className="text-yellow-400 hover:underline flex items-center text-sm"
              >
                View all plans <FaArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recipes
                .filter((recipe) => recipe.category === "Breakfast")
                .slice(0, 3)
                .map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 relative">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white">
                          {recipe.name}
                        </h3>
                        <span className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded">
                          {recipe.category}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 mt-2 mb-3">
                        <FaRegClock className="mr-1" /> {recipe.prepTime} min •{" "}
                        {recipe.calories} calories
                      </div>
                      <div className="flex justify-between text-sm text-gray-300 mt-2">
                        <span>P: {recipe.protein}g</span>
                        <span>C: {recipe.carbs}g</span>
                        <span>F: {recipe.fat}g</span>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/nutrition/recipe/${recipe.id}`}
                          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Smoothies Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Smoothies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recipes
                .filter((recipe) =>
                  recipe.name.toLowerCase().includes("smoothie")
                )
                .map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="h-40 relative">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-md font-semibold text-white">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <div className="text-gray-400">
                          {recipe.calories} cal
                        </div>
                        <div className="flex items-center">
                          <FaRegStar className="text-yellow-400 mr-1" />
                          <span className="text-gray-300">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* All Recipes */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">All Recipes</h2>
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 relative">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                      {recipe.favorite && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black p-1 rounded-full">
                          <FaRegStar className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white">
                          {recipe.name}
                        </h3>
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {recipe.category}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 mt-2 mb-3">
                        <FaRegClock className="mr-1" /> {recipe.prepTime} min •{" "}
                        {recipe.calories} calories
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-gray-700 p-2 rounded text-center">
                          <div className="text-gray-400">Protein</div>
                          <div className="text-white font-medium">
                            {recipe.protein}g
                          </div>
                        </div>
                        <div className="bg-gray-700 p-2 rounded text-center">
                          <div className="text-gray-400">Carbs</div>
                          <div className="text-white font-medium">
                            {recipe.carbs}g
                          </div>
                        </div>
                        <div className="bg-gray-700 p-2 rounded text-center">
                          <div className="text-gray-400">Fat</div>
                          <div className="text-white font-medium">
                            {recipe.fat}g
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Link
                          href={`/nutrition/recipe/${recipe.id}`}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition"
                        >
                          Details
                        </Link>
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-black py-2 px-3 rounded-lg font-medium transition">
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-800 rounded-lg">
                <FaUtensils className="text-yellow-400 h-16 w-16 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">
                  No recipes found
                </h3>
                <p className="text-gray-300 mb-8 text-center max-w-md">
                  {searchQuery
                    ? `No recipes match "${searchQuery}" in the "${activeCategory}" category`
                    : "No recipes available in this category yet"}
                </p>
                <Link
                  href="/nutrition/create-recipe"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-3 rounded-lg flex items-center font-medium transition"
                >
                  <FaPlus className="mr-2" />
                  <span>Create New Recipe</span>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
