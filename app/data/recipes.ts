export interface Ingredient {
  name: string;
  amount: string;
  calories: number;
  image?: string;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface CookingStep {
  title: string;
  description: string;
  image?: string;
  duration?: string;
  tip?: string;
}

export interface RecipeProps {
  id: string;
  title: string;
  images: string[];
  prepTime: string;
  cookTime: string;
  calories: number;
  servings: number;
  rating: number;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  tags: string[];
  dietaryInfo: string[];
  isCustom?: boolean;
}

export interface RecipeCollection {
  breakfast: RecipeProps[];
  lunch: RecipeProps[];
  dinner: RecipeProps[];
  dessert: RecipeProps[];
  snack: RecipeProps[];
}

export const recipeData: RecipeCollection = {
  breakfast: [
    {
      id: "eggs-avocado-toast",
      title: "Eggs & Avocado Toast",
      images: [
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1603046891795-05f892a0f1a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "5 mins",
      cookTime: "10 mins",
      calories: 350,
      servings: 1,
      rating: 4.8,
      mealType: ["breakfast", "brunch"],
      difficulty: "Easy",
      description:
        "A nutrient-dense breakfast featuring protein-rich eggs and heart-healthy avocado on whole grain toast. Perfect for fueling your morning workout or keeping you satisfied until lunch.",
      ingredients: [
        {
          name: "Large eggs",
          amount: "2",
          calories: 156,
          image:
            "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 12,
            carbs: 0,
            fats: 10,
          },
        },
        {
          name: "Avocado",
          amount: "1/2",
          calories: 114,
          image:
            "https://images.unsplash.com/photo-1551460875-ba81264aace3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 1,
            carbs: 6,
            fats: 10,
          },
        },
        {
          name: "Whole grain bread",
          amount: "1 slice",
          calories: 80,
          image:
            "https://images.unsplash.com/photo-1565181917578-a87843139105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 3,
            carbs: 15,
            fats: 1,
          },
        },
        {
          name: "Cherry tomatoes",
          amount: "5",
          calories: 18,
          image:
            "https://images.unsplash.com/photo-1558818498-28c1e002b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 1,
            carbs: 4,
            fats: 0,
          },
        },
        {
          name: "Extra virgin olive oil",
          amount: "1 tsp",
          calories: 40,
          image:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 4.5,
          },
        },
        {
          name: "Sea salt",
          amount: "pinch",
          calories: 0,
          image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 0,
          },
        },
        {
          name: "Black pepper",
          amount: "pinch",
          calories: 0,
          image:
            "https://images.unsplash.com/photo-1599940778173-e4a36c8ca270?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 0,
          },
        },
        {
          name: "Red pepper flakes",
          amount: "pinch (optional)",
          calories: 0,
          image:
            "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 0,
          },
        },
      ],
      steps: [
        {
          title: "Toast the bread",
          description:
            "Toast your whole grain bread slice until golden brown and crispy.",
          duration: "2 mins",
          image:
            "https://images.unsplash.com/photo-1600326145552-327c4df2d8fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Prepare the avocado",
          description:
            "Cut the avocado in half, remove the pit, and scoop out the flesh into a bowl. Mash with a fork and season with a pinch of salt and pepper.",
          duration: "2 mins",
          tip: "Choose an avocado that yields slightly to gentle pressure for perfect ripeness.",
        },
        {
          title: "Cook the eggs",
          description:
            "Heat a non-stick pan over medium heat. Add a teaspoon of olive oil. Crack the eggs into the pan and cook to your preference (sunny side up, over easy, or scrambled).",
          duration: "3-5 mins",
          image:
            "https://images.unsplash.com/photo-1607103058027-e96e5ea7b6ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Assemble the toast",
          description:
            "Spread the mashed avocado evenly on the toast. Top with the cooked eggs, sliced cherry tomatoes, and a sprinkle of red pepper flakes if desired.",
          duration: "1 min",
          image:
            "https://images.unsplash.com/photo-1603046891795-05f892a0f1a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Finish and serve",
          description:
            "Drizzle with a touch more olive oil if desired. Season with a final pinch of salt and black pepper to taste. Serve immediately while warm.",
          duration: "1 min",
          tip: "For an extra nutritional boost, add a sprinkle of hemp seeds or microgreens on top.",
        },
      ],
      macros: {
        protein: 17,
        carbs: 25,
        fats: 25.5,
        fiber: 7,
      },
      tags: ["high-protein", "vegetarian", "quick", "heart-healthy"],
      dietaryInfo: ["Vegetarian", "Dairy-free"],
    },
    {
      id: "greek-yogurt-protein-bowl",
      title: "Greek Yogurt Protein Bowl",
      images: [
        "https://images.unsplash.com/photo-1611868068855-5c77996bdf75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1488477181946-6428a0bfbf36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "10 mins",
      cookTime: "0 mins",
      calories: 320,
      servings: 1,
      rating: 4.7,
      mealType: ["breakfast", "snack"],
      difficulty: "Easy",
      description:
        "A protein-packed breakfast bowl featuring creamy Greek yogurt topped with fresh berries, honey, and crunchy nuts. Perfect for muscle recovery and lasting energy.",
      ingredients: [
        {
          name: "Greek yogurt (2% fat)",
          amount: "1 cup (240g)",
          calories: 170,
          image:
            "https://images.unsplash.com/photo-1571211468362-33f20cb1982e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 24,
            carbs: 9,
            fats: 5,
          },
        },
        {
          name: "Mixed berries",
          amount: "1/2 cup",
          calories: 40,
          image:
            "https://images.unsplash.com/photo-1563746924237-f4471479790f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0.5,
            carbs: 10,
            fats: 0,
          },
        },
        {
          name: "Honey",
          amount: "1 tbsp",
          calories: 60,
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 17,
            fats: 0,
          },
        },
        {
          name: "Walnuts",
          amount: "1 tbsp, chopped",
          calories: 50,
          image:
            "https://images.unsplash.com/photo-1604045840725-f030a6ee6395?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 1,
            carbs: 1,
            fats: 5,
          },
        },
      ],
      steps: [
        {
          title: "Prepare the base",
          description:
            "Add Greek yogurt to a serving bowl and stir until smooth.",
          duration: "1 min",
        },
        {
          title: "Add toppings",
          description: "Top with mixed berries and chopped walnuts.",
          duration: "1 min",
          image:
            "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Finish with honey",
          description: "Drizzle honey over the top for natural sweetness.",
          duration: "30 secs",
          tip: "For a lower-sugar option, use a small amount of honey or substitute with stevia.",
        },
        {
          title: "Serve immediately",
          description:
            "Enjoy right away or refrigerate for up to 2 hours (without honey).",
          duration: "0 mins",
        },
      ],
      macros: {
        protein: 25.5,
        carbs: 37,
        fats: 10,
        fiber: 3,
      },
      tags: ["high-protein", "quick", "no-cook", "recovery"],
      dietaryInfo: ["Gluten-free", "Vegetarian"],
    },
  ],
  lunch: [
    {
      id: "chicken-quinoa-bowl",
      title: "Chicken & Quinoa Power Bowl",
      images: [
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "15 mins",
      cookTime: "25 mins",
      calories: 450,
      servings: 1,
      rating: 4.9,
      mealType: ["lunch", "dinner"],
      difficulty: "Medium",
      description:
        "A nutrient-dense bowl combining lean protein from grilled chicken with complex carbs from quinoa and plenty of vegetables. Perfect for muscle recovery and sustained energy.",
      ingredients: [
        {
          name: "Chicken breast",
          amount: "4 oz (120g)",
          calories: 130,
          image:
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 26,
            carbs: 0,
            fats: 3,
          },
        },
        {
          name: "Quinoa, uncooked",
          amount: "1/3 cup",
          calories: 120,
          image:
            "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 4,
            carbs: 22,
            fats: 2,
          },
        },
        {
          name: "Mixed vegetables (bell peppers, zucchini, red onion)",
          amount: "1 cup",
          calories: 50,
          image:
            "https://images.unsplash.com/photo-1542223189-67a03fa0f0bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 2,
            carbs: 10,
            fats: 0,
          },
        },
        {
          name: "Avocado",
          amount: "1/4",
          calories: 80,
          image:
            "https://images.unsplash.com/photo-1551460875-ba81264aace3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 1,
            carbs: 4,
            fats: 7,
          },
        },
        {
          name: "Olive oil",
          amount: "1 tbsp",
          calories: 120,
          image:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 14,
          },
        },
        {
          name: "Lemon",
          amount: "1/2",
          calories: 10,
          image:
            "https://images.unsplash.com/photo-1582476595590-8f8c5a2e651d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 3,
            fats: 0,
          },
        },
      ],
      steps: [
        {
          title: "Prepare the quinoa",
          description:
            "Rinse quinoa thoroughly. Add to a pot with 2/3 cup water and a pinch of salt. Bring to a boil, then reduce heat, cover, and simmer for 15 minutes until water is absorbed.",
          duration: "20 mins",
          tip: "Always rinse quinoa to remove its natural coating called saponin, which can make it taste bitter.",
        },
        {
          title: "Season the chicken",
          description:
            "Season chicken breast with salt, pepper, and your choice of herbs (like oregano or thyme).",
          duration: "2 mins",
        },
        {
          title: "Cook the chicken",
          description:
            "Heat 1/2 tbsp olive oil in a pan over medium-high heat. Cook chicken for 6-7 minutes per side until internal temperature reaches 165°F (74°C).",
          duration: "15 mins",
          image:
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Sauté the vegetables",
          description:
            "In the same pan, add remaining olive oil and sauté mixed vegetables until tender-crisp, about 5-6 minutes.",
          duration: "6 mins",
        },
        {
          title: "Assemble the bowl",
          description:
            "Place cooked quinoa at the base of your bowl. Top with sliced chicken breast, sautéed vegetables, and sliced avocado.",
          duration: "3 mins",
          image:
            "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Add final touches",
          description:
            "Squeeze fresh lemon juice over the top. Add a drizzle of olive oil and season with salt and pepper to taste.",
          duration: "1 min",
          tip: "For added flavor, sprinkle with fresh herbs like parsley or cilantro.",
        },
      ],
      macros: {
        protein: 33,
        carbs: 39,
        fats: 26,
        fiber: 9,
      },
      tags: ["high-protein", "meal-prep", "balanced"],
      dietaryInfo: ["Gluten-free", "Dairy-free"],
    },
  ],
  dinner: [
    {
      id: "salmon-sweet-potato",
      title: "Baked Salmon & Sweet Potato",
      images: [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "10 mins",
      cookTime: "30 mins",
      calories: 420,
      servings: 1,
      rating: 4.9,
      mealType: ["dinner"],
      difficulty: "Medium",
      description:
        "A complete muscle-building meal featuring omega-3 rich salmon paired with nutrient-dense sweet potatoes and steamed greens. Excellent for recovery and overall health.",
      ingredients: [
        {
          name: "Salmon fillet",
          amount: "5 oz (150g)",
          calories: 220,
          image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 30,
            carbs: 0,
            fats: 12,
          },
        },
        {
          name: "Sweet potato",
          amount: "1 medium (130g)",
          calories: 110,
          image:
            "https://images.unsplash.com/photo-1596097635166-eeaf8c2699a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 2,
            carbs: 24,
            fats: 0,
          },
        },
        {
          name: "Broccoli",
          amount: "1 cup",
          calories: 55,
          image:
            "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 3.7,
            carbs: 11,
            fats: 0.4,
          },
        },
        {
          name: "Olive oil",
          amount: "1 tbsp",
          calories: 120,
          image:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 14,
          },
        },
        {
          name: "Lemon",
          amount: "1/2",
          calories: 10,
          image:
            "https://images.unsplash.com/photo-1582476595590-8f8c5a2e651d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 3,
            fats: 0,
          },
        },
        {
          name: "Fresh dill",
          amount: "1 tbsp, chopped",
          calories: 1,
          image:
            "https://images.unsplash.com/photo-1627735483792-c3a2cb8970cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0.1,
            carbs: 0.2,
            fats: 0,
          },
        },
      ],
      steps: [
        {
          title: "Preheat oven",
          description: "Preheat your oven to 400°F (200°C).",
          duration: "5 mins",
        },
        {
          title: "Prepare sweet potato",
          description:
            "Wash and prick sweet potato with a fork several times. Rub with a little olive oil and sprinkle with salt.",
          duration: "2 mins",
        },
        {
          title: "Bake sweet potato",
          description:
            "Place sweet potato on a baking sheet and bake for 15 minutes before adding the salmon.",
          duration: "15 mins",
          tip: "For extra flavor, add a sprinkle of cinnamon to the sweet potato.",
        },
        {
          title: "Prepare the salmon",
          description:
            "Pat salmon dry with paper towels. Drizzle with olive oil and season with salt, pepper, and fresh dill.",
          duration: "3 mins",
          image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Bake salmon",
          description:
            "Add salmon to the baking sheet with the partially cooked sweet potato. Continue baking for 12-15 minutes until salmon is cooked through and flakes easily.",
          duration: "15 mins",
        },
        {
          title: "Steam broccoli",
          description:
            "While salmon is baking, steam broccoli until bright green and tender-crisp, about 5 minutes.",
          duration: "5 mins",
        },
        {
          title: "Serve",
          description:
            "Plate the baked salmon with sweet potato and steamed broccoli. Squeeze fresh lemon juice over the salmon and vegetables.",
          duration: "2 mins",
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
      ],
      macros: {
        protein: 35.8,
        carbs: 38.2,
        fats: 26.4,
        fiber: 7.5,
      },
      tags: ["high-protein", "omega-3", "balanced"],
      dietaryInfo: ["Gluten-free", "Dairy-free"],
    },
  ],
  dessert: [
    {
      id: "protein-brownie",
      title: "Protein Brownies",
      images: [
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "15 mins",
      cookTime: "20 mins",
      calories: 180,
      servings: 8,
      rating: 4.6,
      mealType: ["dessert", "snack"],
      difficulty: "Medium",
      description:
        "Indulgent yet nutritious brownies made with protein powder, almond flour, and natural sweeteners. Satisfies chocolate cravings without derailing fitness goals.",
      ingredients: [
        {
          name: "Chocolate protein powder",
          amount: "2 scoops (60g)",
          calories: 240,
          image:
            "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 48,
            carbs: 6,
            fats: 2,
          },
        },
        {
          name: "Almond flour",
          amount: "1 cup",
          calories: 640,
          image:
            "https://images.unsplash.com/photo-1536153584642-afb59cd0e489?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 24,
            carbs: 24,
            fats: 56,
          },
        },
        {
          name: "Cocoa powder",
          amount: "1/4 cup",
          calories: 50,
          image:
            "https://images.unsplash.com/photo-1589732319619-638fcdc3e7c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 4,
            carbs: 8,
            fats: 3,
          },
        },
        {
          name: "Coconut oil",
          amount: "1/4 cup",
          calories: 480,
          image:
            "https://images.unsplash.com/photo-1611071914696-8089198d8e16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 0,
            fats: 56,
          },
        },
        {
          name: "Honey",
          amount: "1/4 cup",
          calories: 240,
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 64,
            fats: 0,
          },
        },
        {
          name: "Eggs",
          amount: "2 large",
          calories: 140,
          image:
            "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 12,
            carbs: 0,
            fats: 10,
          },
        },
        {
          name: "Dark chocolate chips",
          amount: "1/4 cup",
          calories: 200,
          image:
            "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 2,
            carbs: 24,
            fats: 14,
          },
        },
      ],
      steps: [
        {
          title: "Prepare oven and pan",
          description:
            "Preheat oven to 350°F (175°C). Line an 8x8-inch baking pan with parchment paper.",
          duration: "5 mins",
        },
        {
          title: "Melt coconut oil and chocolate",
          description:
            "In a microwave-safe bowl, melt coconut oil and half of the chocolate chips in 30-second intervals, stirring between each, until smooth.",
          duration: "2 mins",
          tip: "Be careful not to overheat the chocolate or it will seize up.",
        },
        {
          title: "Mix dry ingredients",
          description:
            "In a large bowl, whisk together protein powder, almond flour, and cocoa powder.",
          duration: "2 mins",
        },
        {
          title: "Combine wet ingredients",
          description:
            "In a separate bowl, beat eggs with honey until well combined. Add the melted chocolate mixture and stir.",
          duration: "3 mins",
        },
        {
          title: "Mix batter",
          description:
            "Pour wet ingredients into dry ingredients and stir until just combined. Fold in remaining chocolate chips.",
          duration: "3 mins",
          image:
            "https://images.unsplash.com/photo-1612208176815-e8e6e4bd4c6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Bake",
          description:
            "Spread batter evenly in prepared pan. Bake for 18-20 minutes until a toothpick inserted comes out with a few moist crumbs.",
          duration: "20 mins",
          tip: "Don't overbake - protein brownies can become dry quickly. They should still be slightly fudgy in the center.",
        },
        {
          title: "Cool and cut",
          description:
            "Allow to cool completely in the pan before cutting into 8 squares.",
          duration: "30 mins",
          image:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
      ],
      macros: {
        protein: 11.3,
        carbs: 15.8,
        fats: 17.6,
        fiber: 3.2,
      },
      tags: ["protein-rich", "low-sugar", "gluten-free"],
      dietaryInfo: ["Gluten-free", "Dairy-free option"],
    },
  ],
  snack: [
    {
      id: "protein-energy-balls",
      title: "Protein Energy Balls",
      images: [
        "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      prepTime: "15 mins",
      cookTime: "0 mins",
      calories: 100,
      servings: 12,
      rating: 4.8,
      mealType: ["snack"],
      difficulty: "Easy",
      description:
        "No-bake energy balls packed with protein, healthy fats, and complex carbs. Perfect pre-workout snack or quick energy boost between meals.",
      ingredients: [
        {
          name: "Rolled oats",
          amount: "1 cup",
          calories: 300,
          image:
            "https://images.unsplash.com/photo-1622542086073-110fdb619620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 10,
            carbs: 54,
            fats: 5,
          },
        },
        {
          name: "Natural peanut butter",
          amount: "1/2 cup",
          calories: 760,
          image:
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 32,
            carbs: 22,
            fats: 64,
          },
        },
        {
          name: "Honey",
          amount: "1/4 cup",
          calories: 240,
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 0,
            carbs: 64,
            fats: 0,
          },
        },
        {
          name: "Vanilla protein powder",
          amount: "1/4 cup",
          calories: 120,
          image:
            "https://images.unsplash.com/photo-1612016317643-1499260ddd11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 24,
            carbs: 3,
            fats: 1,
          },
        },
        {
          name: "Chia seeds",
          amount: "2 tbsp",
          calories: 120,
          image:
            "https://images.unsplash.com/photo-1551978129-b73f45d132eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 4,
            carbs: 10,
            fats: 8,
          },
        },
        {
          name: "Mini chocolate chips",
          amount: "1/4 cup",
          calories: 200,
          image:
            "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
          macros: {
            protein: 2,
            carbs: 24,
            fats: 14,
          },
        },
      ],
      steps: [
        {
          title: "Mix dry ingredients",
          description:
            "In a large bowl, combine rolled oats, protein powder, and chia seeds. Mix well.",
          duration: "2 mins",
        },
        {
          title: "Add wet ingredients",
          description:
            "Add peanut butter and honey to the dry ingredients. Stir until well combined.",
          duration: "3 mins",
          image:
            "https://images.unsplash.com/photo-1505253668822-42074d58a7c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Add chocolate chips",
          description:
            "Fold in mini chocolate chips until evenly distributed throughout the mixture.",
          duration: "1 min",
          tip: "If the mixture is too sticky, refrigerate for 15-20 minutes before rolling.",
        },
        {
          title: "Form into balls",
          description:
            "Using a tablespoon or small cookie scoop, portion out the mixture and roll into 1-inch balls with your hands.",
          duration: "10 mins",
          image:
            "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        },
        {
          title: "Chill",
          description:
            "Place the energy balls on a baking sheet lined with parchment paper and refrigerate for at least 30 minutes to firm up.",
          duration: "30 mins",
        },
        {
          title: "Store",
          description:
            "Transfer to an airtight container and store in the refrigerator for up to 1 week or freezer for up to 3 months.",
          duration: "2 mins",
          tip: "These are perfect for meal prep - make a double batch and freeze half for later!",
        },
      ],
      macros: {
        protein: 6,
        carbs: 14.8,
        fats: 7.7,
        fiber: 2.1,
      },
      tags: ["no-bake", "meal-prep", "pre-workout"],
      dietaryInfo: ["Vegetarian", "Gluten-free option"],
    },
  ],
};
