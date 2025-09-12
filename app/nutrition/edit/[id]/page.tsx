"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type NutritionEntry = {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function EditMealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [date, setDate] = useState<string>("");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  
  useEffect(() => {
    // In a real app, you would fetch the meal entry data from your API
    // For this demo, we'll just simulate a network request
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock data
      const mockEntry: NutritionEntry = {
        id,
        date: "2025-09-11",
        mealType: id.startsWith("breakfast") 
          ? "Breakfast" 
          : id.startsWith("lunch") 
            ? "Lunch" 
            : id.startsWith("dinner") 
              ? "Dinner" 
              : "Snack",
        name: id.startsWith("breakfast") 
          ? "Oatmeal with Berries" 
          : id.startsWith("lunch") 
            ? "Chicken Salad" 
            : id.startsWith("dinner") 
              ? "Salmon with Vegetables" 
              : "Protein Bar",
        calories: id.startsWith("breakfast") 
          ? 350 
          : id.startsWith("lunch") 
            ? 450 
            : id.startsWith("dinner") 
              ? 550 
              : 200,
        protein: id.startsWith("breakfast") 
          ? 12 
          : id.startsWith("lunch") 
            ? 35 
            : id.startsWith("dinner") 
              ? 40 
              : 15,
        carbs: id.startsWith("breakfast") 
          ? 60 
          : id.startsWith("lunch") 
            ? 15 
            : id.startsWith("dinner") 
              ? 25 
              : 20,
        fat: id.startsWith("breakfast") 
          ? 6 
          : id.startsWith("lunch") 
            ? 22 
            : id.startsWith("dinner") 
              ? 25 
              : 8,
      };
      
      // Populate form fields
      setMealType(mockEntry.mealType);
      setDate(mockEntry.date);
      setName(mockEntry.name);
      setCalories(mockEntry.calories);
      setProtein(mockEntry.protein);
      setCarbs(mockEntry.carbs);
      setFat(mockEntry.fat);
      
      setIsLoading(false);
    }, 800);
  }, [id]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // In a real app, you would send this data to your API
    // For this demo, we'll just simulate a network request
    setTimeout(() => {
      setIsSaving(false);
      // Navigate back to nutrition page
      router.push("/nutrition");
    }, 1000);
  };
  
  // Handle deletion
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this meal entry?")) {
      setIsDeleting(true);
      
      // In a real app, you would delete this entry via your API
      // For this demo, we'll just simulate a network request
      setTimeout(() => {
        setIsDeleting(false);
        // Navigate back to nutrition page
        router.push("/nutrition");
      }, 1000);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-dark">Edit Meal</h1>
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
            disabled={isSaving}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
          >
            <FaSave className="mr-2" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
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
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Oatmeal with Berries"
              />
            </div>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-primary mb-4">Nutritional Information</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                id="calories"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  id="protein"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  id="carbs"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  id="fat"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="pt-4 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <FaTrash className="mr-2" />
                <span>{isDeleting ? "Deleting..." : "Delete this meal"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
