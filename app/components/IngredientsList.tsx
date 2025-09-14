"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaShoppingBasket, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { Ingredient } from '../data/recipes';

interface IngredientsListProps {
  ingredients: Ingredient[];
  servings: number;
}

export default function IngredientsList({ ingredients, servings }: IngredientsListProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [currentServings, setCurrentServings] = useState(servings);
  
  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };
  
  const adjustServings = (newServings: number) => {
    if (newServings >= 1 && newServings <= 12) {
      setCurrentServings(newServings);
    }
  };
  
  // Calculate adjusted amount based on servings
  const getAdjustedAmount = (amount: string, originalServings: number, currentServings: number) => {
    // Extract numeric part and unit part
    const match = amount.match(/^([\d./]+)\s*(.*)$/);
    
    if (!match) return amount;
    
    const numericPart = match[1];
    const unitPart = match[2];
    
    // Handle fractions
    const calculateValue = (fractionStr: string): number => {
      if (fractionStr.includes('/')) {
        const [numerator, denominator] = fractionStr.split('/').map(Number);
        return numerator / denominator;
      }
      return parseFloat(fractionStr);
    };
    
    // Calculate new amount
    const originalValue = calculateValue(numericPart);
    const ratio = currentServings / originalServings;
    const newValue = originalValue * ratio;
    
    // Format the result
    const formatValue = (value: number): string => {
      // For small fractions
      if (value < 1 && value > 0) {
        if (Math.abs(value - 1/4) < 0.05) return '1/4';
        if (Math.abs(value - 1/3) < 0.05) return '1/3';
        if (Math.abs(value - 1/2) < 0.05) return '1/2';
        if (Math.abs(value - 2/3) < 0.05) return '2/3';
        if (Math.abs(value - 3/4) < 0.05) return '3/4';
      }
      
      // For whole numbers
      if (Math.abs(value - Math.round(value)) < 0.05) {
        return Math.round(value).toString();
      }
      
      // For other values
      return value.toFixed(1).replace(/\.0$/, '');
    };
    
    return `${formatValue(newValue)} ${unitPart}`;
  };
  
  const getTotalCalories = () => {
    return ingredients.reduce((total, ingredient) => {
      const adjustmentRatio = currentServings / servings;
      return total + (ingredient.calories * adjustmentRatio);
    }, 0).toFixed(0);
  };
  
  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FaShoppingBasket className="mr-2 text-yellow-500" />
          Ingredients
        </h2>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-400 text-sm">Servings:</span>
          <div className="flex items-center">
            <button 
              onClick={() => adjustServings(currentServings - 1)}
              className="bg-gray-700 hover:bg-gray-600 text-white h-8 w-8 rounded-l-lg flex items-center justify-center transition-colors"
              disabled={currentServings <= 1}
            >
              -
            </button>
            <span className="bg-gray-700 text-white h-8 px-3 flex items-center justify-center">
              {currentServings}
            </span>
            <button 
              onClick={() => adjustServings(currentServings + 1)}
              className="bg-gray-700 hover:bg-gray-600 text-white h-8 w-8 rounded-r-lg flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Total calories:</span>
          <span className="text-white font-medium">{getTotalCalories()} kcal</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shopping list:</span>
          <span className="text-white font-medium">
            {selectedIngredients.length}/{ingredients.length} selected
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedIngredients.includes(ingredient.name)
                ? 'bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20'
                : 'bg-gray-700 hover:bg-gray-650'
            }`}
            onClick={() => toggleIngredient(ingredient.name)}
          >
            <div className="flex items-center">
              {ingredient.image ? (
                <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 bg-gray-600 rounded-md mr-3 flex items-center justify-center">
                  <span className="text-xs text-gray-400">{ingredient.name.charAt(0)}</span>
                </div>
              )}
              
              <div>
                <p className={`font-medium ${selectedIngredients.includes(ingredient.name) ? 'text-green-300' : 'text-white'}`}>
                  {ingredient.name}
                </p>
                <p className="text-sm text-gray-400">
                  {getAdjustedAmount(ingredient.amount, servings, currentServings)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-3">
                {Math.round(ingredient.calories * (currentServings / servings))} kcal
              </span>
              
              {selectedIngredients.includes(ingredient.name) ? (
                <FaCheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <FaRegCircle className="text-gray-500 h-5 w-5" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
          <FaShoppingBasket className="mr-2" />
          Add all to shopping list
        </button>
      </div>
    </div>
  );
}