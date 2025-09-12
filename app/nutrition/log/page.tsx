"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaUtensils } from "react-icons/fa";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
};

export default function LogMealPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [servings, setServings] = useState<Record<string, number>>({});

  // Mock food database for demonstration
  const foodDatabase: FoodItem[] = [
    {
      id: "1",
      name: "Oatmeal",
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      servingSize: "1 cup (240g)",
    },
    {
      id: "2",
      name: "Banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      servingSize: "1 medium (118g)",
    },
    {
      id: "3",
      name: "Egg, whole, cooked",
      calories: 70,
      protein: 6,
      carbs: 0.6,
      fat: 5,
      servingSize: "1 large (50g)",
    },
    {
      id: "4",
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      servingSize: "100g",
    },
    {
      id: "5",
      name: "Salmon",
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 13,
      servingSize: "100g",
    },
    {
      id: "6",
      name: "Brown Rice",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      servingSize: "1 cup (195g)",
    },
    {
      id: "7",
      name: "Broccoli",
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
      servingSize: "1 cup (91g)",
    },
    {
      id: "8",
      name: "Avocado",
      calories: 240,
      protein: 3,
      carbs: 12,
      fat: 22,
      servingSize: "1 whole (150g)",
    },
    {
      id: "9",
      name: "Greek Yogurt",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4,
      servingSize: "6 oz (170g)",
    },
    {
      id: "10",
      name: "Almonds",
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      servingSize: "1 oz (28g)",
    },
  ];

  // Filter food based on search
  const filteredFoods = searchQuery
    ? foodDatabase.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Add food to meal
  const addFood = (food: FoodItem) => {
    if (!selectedFoods.some((f) => f.id === food.id)) {
      setSelectedFoods([...selectedFoods, food]);
      setServings({ ...servings, [food.id]: 1 });
    }
  };

  // Remove food from meal
  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((food) => food.id !== foodId));
    const newServings = { ...servings };
    delete newServings[foodId];
    setServings(newServings);
  };

  // Update serving size
  const updateServing = (foodId: string, value: number) => {
    setServings({ ...servings, [foodId]: value });
  };

  // Calculate totals
  const calculateTotals = () => {
    return selectedFoods.reduce(
      (acc, food) => {
        const servingMultiplier = servings[food.id] || 1;
        return {
          calories: acc.calories + food.calories * servingMultiplier,
          protein: acc.protein + food.protein * servingMultiplier,
          carbs: acc.carbs + food.carbs * servingMultiplier,
          fat: acc.fat + food.fat * servingMultiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, you would send this data to your API
    // For this demo, we'll just simulate a network request
    setTimeout(() => {
      setIsLoading(false);
      // Navigate back to nutrition page
      router.push("/nutrition");
    }, 1000);
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-dark">Log a Meal</h1>
        <div className="flex space-x-2">
          <Link
            href="/nutrition"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center transition-colors duration-200"
          >
            <FaTimes className="mr-2" />
            <span>Cancel</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={selectedFoods.length === 0 || isLoading}
            className={`bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200 ${
              selectedFoods.length === 0 || isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <FaSave className="mr-2" />
            <span>{isLoading ? "Saving..." : "Save Meal"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Meal Information */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-primary mb-4">Meal Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </form>
          </div>

          {/* Nutritional Summary */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-primary mb-4">Meal Summary</h2>
            
            {selectedFoods.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-gray-700 font-medium mb-1">Total Calories</span>
                  <span className="text-2xl font-bold text-primary">
                    {Math.round(totals.calories)} kcal
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="block text-gray-700 text-sm mb-1">Protein</span>
                    <span className="text-xl font-semibold text-blue-500">
                      {Math.round(totals.protein)}g
                    </span>
                  </div>
                  
                  <div>
                    <span className="block text-gray-700 text-sm mb-1">Carbs</span>
                    <span className="text-xl font-semibold text-secondary">
                      {Math.round(totals.carbs)}g
                    </span>
                  </div>
                  
                  <div>
                    <span className="block text-gray-700 text-sm mb-1">Fat</span>
                    <span className="text-xl font-semibold text-yellow-500">
                      {Math.round(totals.fat)}g
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Protein</span>
                    <span className="text-gray-800 font-medium">
                      {Math.round((totals.protein * 4) / totals.calories * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Carbs</span>
                    <span className="text-gray-800 font-medium">
                      {Math.round((totals.carbs * 4) / totals.calories * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Fat</span>
                    <span className="text-gray-800 font-medium">
                      {Math.round((totals.fat * 9) / totals.calories * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Add foods to see nutritional summary
              </p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {/* Food Search */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-primary mb-4">Search Foods</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {searchQuery && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                {filteredFoods.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredFoods.map((food) => (
                      <li key={food.id} className="py-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-800">{food.name}</h3>
                            <p className="text-sm text-gray-600">
                              {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                            <p className="text-xs text-gray-500">{food.servingSize}</p>
                          </div>
                          <button
                            onClick={() => addFood(food)}
                            disabled={selectedFoods.some((f) => f.id === food.id)}
                            className={`text-primary hover:text-primary-dark ${
                              selectedFoods.some((f) => f.id === food.id)
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {selectedFoods.some((f) => f.id === food.id) ? "Added" : "Add"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 py-2">No foods found matching &quot;{searchQuery}&quot;</p>
                )}
              </div>
            )}
          </div>

          {/* Selected Foods */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-semibold p-5 text-primary">
                {mealType} - {new Date(date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </h2>
            </div>

            {selectedFoods.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {selectedFoods.map((food) => (
                  <li key={food.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{food.name}</h3>
                      <button
                        onClick={() => removeFood(food.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="inline-block mr-3">
                          {Math.round(food.calories * (servings[food.id] || 1))} kcal
                        </span>
                        <span className="inline-block mr-3">
                          P: {Math.round(food.protein * (servings[food.id] || 1))}g
                        </span>
                        <span className="inline-block mr-3">
                          C: {Math.round(food.carbs * (servings[food.id] || 1))}g
                        </span>
                        <span className="inline-block">
                          F: {Math.round(food.fat * (servings[food.id] || 1))}g
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <label htmlFor={`servings-${food.id}`} className="text-sm text-gray-600">
                          Servings:
                        </label>
                        <input
                          id={`servings-${food.id}`}
                          type="number"
                          min="0.25"
                          step="0.25"
                          value={servings[food.id] || 1}
                          onChange={(e) => updateServing(food.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <FaUtensils className="mx-auto h-12 w-12 text-secondary opacity-40 mb-4" />
                <h3 className="text-lg font-medium text-primary-dark mb-2">
                  No foods added yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Search for foods above and add them to your meal
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
