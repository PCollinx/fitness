"use client";

import { FaChartPie, FaWeight, FaRunning } from 'react-icons/fa';

interface NutritionInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export default function NutritionInfo({ 
  calories, 
  protein, 
  carbs, 
  fats,
  fiber
}: NutritionInfoProps) {
  // Calculate percentages for the macro pie chart
  const total = protein + carbs + fats;
  const proteinPercent = Math.round((protein / total) * 100);
  const carbsPercent = Math.round((carbs / total) * 100);
  const fatsPercent = Math.round((fats / total) * 100);
  
  // Calculate calories from each macro
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatsCals = fats * 9;
  
  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <FaChartPie className="mr-2 text-yellow-500" />
        Nutrition Information
      </h2>
      
      {/* Calories and Macros Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <span className="text-gray-400 text-sm">Calories</span>
          <p className="text-xl font-bold text-white">{calories}</p>
          <span className="text-gray-400 text-xs">kcal</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <span className="text-gray-400 text-sm">Protein</span>
          <p className="text-xl font-bold text-red-500">{protein}g</p>
          <span className="text-gray-400 text-xs">{proteinCals} kcal</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <span className="text-gray-400 text-sm">Carbs</span>
          <p className="text-xl font-bold text-blue-500">{carbs}g</p>
          <span className="text-gray-400 text-xs">{carbsCals} kcal</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <span className="text-gray-400 text-sm">Fats</span>
          <p className="text-xl font-bold text-yellow-500">{fats}g</p>
          <span className="text-gray-400 text-xs">{fatsCals} kcal</span>
        </div>
      </div>
      
      {/* Macro Distribution Visualization */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3">Macro Distribution</h3>
        <div className="flex h-6 w-full rounded-lg overflow-hidden">
          <div 
            className="bg-red-500 flex items-center justify-center text-xs font-medium text-white"
            style={{ width: `${proteinPercent}%` }}
          >
            {proteinPercent > 10 ? `${proteinPercent}%` : ''}
          </div>
          <div 
            className="bg-blue-500 flex items-center justify-center text-xs font-medium text-white"
            style={{ width: `${carbsPercent}%` }}
          >
            {carbsPercent > 10 ? `${carbsPercent}%` : ''}
          </div>
          <div 
            className="bg-yellow-500 flex items-center justify-center text-xs font-medium text-black"
            style={{ width: `${fatsPercent}%` }}
          >
            {fatsPercent > 10 ? `${fatsPercent}%` : ''}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-1.5"></span>
            <span className="text-white">Protein</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-1.5"></span>
            <span className="text-white">Carbs</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block mr-1.5"></span>
            <span className="text-white">Fats</span>
          </div>
        </div>
      </div>
      
      {/* Additional Nutritional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-gray-600 rounded-full p-2 mr-3">
            <FaWeight className="text-green-400 h-5 w-5" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Dietary Fiber</p>
            <p className="text-white font-medium">{fiber}g</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 flex items-center">
          <div className="bg-gray-600 rounded-full p-2 mr-3">
            <FaRunning className="text-blue-400 h-5 w-5" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Burn Time</p>
            <p className="text-white font-medium">~{Math.round(calories / 10)} mins</p>
            <p className="text-gray-400 text-xs">Running at moderate pace</p>
          </div>
        </div>
      </div>
    </div>
  );
}