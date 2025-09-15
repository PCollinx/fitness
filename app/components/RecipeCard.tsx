"use client";

import { useState } from "react";
import Image from "next/image";
import { FaFireAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { RecipeProps } from "../data/recipes";

interface RecipeCardProps {
  recipe: RecipeProps;
  onToggleFavorite: (recipeId: string) => void;
  isFavorite: boolean;
  view?: "simple" | "compact";
}

export default function RecipeCard({
  recipe,
  onToggleFavorite,
  isFavorite,
  view = "simple",
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  if (view === "compact") {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-750">
        <div className="flex items-center p-3">
          <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3">
            {!imageError && recipe.images[0] ? (
              <Image
                src={recipe.images[0]}
                alt={recipe.title}
                fill
                style={{ objectFit: "cover" }}
                onError={handleImageError}
                sizes="48px"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-xs">
                  {recipe.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-white text-sm">{recipe.title}</h3>
            <div className="flex items-center text-xs text-gray-400">
              <FaFireAlt className="h-3 w-3 mr-1 text-orange-500" />
              <span>{recipe.calories} cal</span>
            </div>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="ml-2 p-1.5"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="h-4 w-4 text-red-500" />
            ) : (
              <FaRegHeart className="h-4 w-4 text-gray-400 hover:text-red-400" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Default 'simple' view
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-750">
      <div className="relative h-40 w-full">
        {!imageError && recipe.images[0] ? (
          <Image
            src={recipe.images[0]}
            alt={recipe.title}
            fill
            style={{ objectFit: "cover" }}
            onError={handleImageError}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">{recipe.title}</span>
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="h-4 w-4 text-red-500" />
          ) : (
            <FaRegHeart className="h-4 w-4 text-white hover:text-red-400" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-white">{recipe.title}</h3>
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="flex items-center text-gray-400">
            <FaFireAlt className="h-4 w-4 mr-1 text-orange-500" />
            <span>{recipe.calories} cal</span>
          </div>
          <span className="text-gray-400 text-xs">{recipe.mealType[0]}</span>
        </div>
      </div>
    </div>
  );
}
