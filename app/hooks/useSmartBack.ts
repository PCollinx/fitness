"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface UseSmartBackOptions {
  fallbackRoute?: string;
  preventCycles?: boolean;
}

// App navigation hierarchy and preferred routes
const APP_NAVIGATION_HIERARCHY = {
  // Core dashboard
  "/dashboard": { level: 0, parent: null },

  // Workouts section
  "/workouts": { level: 1, parent: "/dashboard" },
  "/workouts/new": { level: 2, parent: "/workouts" },
  "/workouts/plan": { level: 2, parent: "/workouts" },
  "/workouts/history": { level: 2, parent: "/workouts" },
  "/workouts/recent": { level: 2, parent: "/workouts" },
  "/workouts/muscle-targeting": { level: 2, parent: "/workouts" },
  "/workouts/muscle-targeting-plan": { level: 3, parent: "/workouts/plan" },

  // Progress section
  "/progress": { level: 1, parent: "/dashboard" },
  "/progress/new": { level: 2, parent: "/progress" },
  "/progress/history": { level: 2, parent: "/progress" },

  // Profile section
  "/profile": { level: 1, parent: "/dashboard" },

  // Schedule section
  "/schedule": { level: 1, parent: "/dashboard" },

  // Streak section
  "/streak": { level: 1, parent: "/dashboard" },

  // Music section
  "/music": { level: 1, parent: "/dashboard" },

  // Onboarding section
  "/onboarding": { level: 1, parent: "/dashboard" },

  // Auth section
  "/auth/signin": { level: 1, parent: "/dashboard" },
  "/auth/signup": { level: 1, parent: "/auth/signin" },
  "/auth/forgot-password": { level: 2, parent: "/auth/signin" },
  "/auth/reset-password": { level: 2, parent: "/auth/signin" },
  "/auth/error": { level: 2, parent: "/auth/signin" },
} as const;

// Dynamic route patterns
const DYNAMIC_ROUTE_PATTERNS = [
  // Workouts dynamic routes
  { pattern: /^\/workouts\/[^\/]+$/, level: 2, parent: "/workouts" }, // /workouts/[id]
  { pattern: /^\/workouts\/edit\/[^\/]+$/, level: 3, parent: "/workouts" }, // /workouts/edit/[id]
  { pattern: /^\/workouts\/start\/[^\/]+$/, level: 3, parent: "/workouts" }, // /workouts/start/[id]
  {
    pattern: /^\/workouts\/create-with-muscles\/[^\/]+$/,
    level: 3,
    parent: "/workouts/muscle-targeting",
  }, // /workouts/create-with-muscles/[muscle]

  // Progress dynamic routes
  { pattern: /^\/progress\/[^\/]+$/, level: 2, parent: "/progress" }, // /progress/[id]
  { pattern: /^\/progress\/edit\/[^\/]+$/, level: 3, parent: "/progress" }, // /progress/edit/[id]
];

export function useSmartBack(options: UseSmartBackOptions = {}) {
  const router = useRouter();
  const { fallbackRoute = "/dashboard", preventCycles = true } = options;
  
  // Detect if a custom fallback route was explicitly provided
  const hasCustomFallback = options.fallbackRoute !== undefined;

  const [canGoBack, setCanGoBack] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Get route hierarchy info
  const getRouteInfo = useCallback((path: string) => {
    // Check static routes first
    if (
      APP_NAVIGATION_HIERARCHY[path as keyof typeof APP_NAVIGATION_HIERARCHY]
    ) {
      return APP_NAVIGATION_HIERARCHY[
        path as keyof typeof APP_NAVIGATION_HIERARCHY
      ];
    }

    // Check dynamic patterns
    for (const { pattern, level, parent } of DYNAMIC_ROUTE_PATTERNS) {
      if (pattern.test(path)) {
        return { level, parent };
      }
    }

    // Default for unknown routes
    return { level: 1, parent: "/dashboard" };
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Track navigation history in sessionStorage to persist across page loads
    const updateNavigationHistory = () => {
      try {
        const currentPath = window.location.pathname;
        const existingHistory = JSON.parse(
          sessionStorage.getItem("navigationHistory") || "[]"
        );

        // Don't add duplicate consecutive entries
        if (existingHistory[existingHistory.length - 1] !== currentPath) {
          const newHistory = [...existingHistory, currentPath].slice(-10); // Keep last 10 entries
          sessionStorage.setItem(
            "navigationHistory",
            JSON.stringify(newHistory)
          );
          setNavigationHistory(newHistory);
        }
      } catch (error) {
        console.warn("Failed to update navigation history:", error);
      }
    };

    // Initialize history
    updateNavigationHistory();

    // Check if we can go back safely
    const hasHistory = window.history.length > 1;
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    const isInternalNavigation = Boolean(
      referrer &&
        referrer.includes(currentOrigin) &&
        !referrer.includes("/auth/") &&
        referrer !== window.location.href
    );

    setCanGoBack(hasHistory && isInternalNavigation);
  }, []);

  const handleBack = useCallback(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      router.push(fallbackRoute);
      return;
    }

    try {
      const currentPath = window.location.pathname;
      const currentRouteInfo = getRouteInfo(currentPath);

      if (canGoBack && preventCycles) {
        // Get navigation history
        const history = JSON.parse(
          sessionStorage.getItem("navigationHistory") || "[]"
        );
        const currentIndex = history.lastIndexOf(currentPath);

        if (currentIndex > 0) {
          const previousPath = history[currentIndex - 1];
          const previousRouteInfo = getRouteInfo(previousPath);

          // Prevent cycles: if previous route is at same or higher level, go to parent instead
          if (
            previousRouteInfo.level >= currentRouteInfo.level ||
            previousPath === currentPath ||
            // Special case: prevent edit -> detail -> edit cycles
            (currentPath.includes("/edit/") &&
              previousPath.includes("/workouts/") &&
              !previousPath.includes("/edit/"))
          ) {
            // Go to explicit fallback or logical parent
            const targetRoute = hasCustomFallback ? fallbackRoute : (currentRouteInfo.parent || fallbackRoute);
            router.push(targetRoute);
            return;
          }
        }

        // If we have safe history, try browser back
        const navigationTimer = setTimeout(() => {
          // If navigation didn't happen, use smart fallback
          if (window.location.pathname === currentPath) {
            const targetRoute = hasCustomFallback ? fallbackRoute : (currentRouteInfo.parent || fallbackRoute);
            router.push(targetRoute);
          }
        }, 300);

        // Listen for successful navigation
        const handleNavigation = () => {
          clearTimeout(navigationTimer);
          window.removeEventListener("popstate", handleNavigation);
        };

        window.addEventListener("popstate", handleNavigation, { once: true });

        // Attempt browser back

        window.history.back();
      } else {
        // No safe back history, go to explicit fallback or logical parent
        const targetRoute = hasCustomFallback ? fallbackRoute : (currentRouteInfo.parent || fallbackRoute);

        router.push(targetRoute);
      }
    } catch (error) {
      console.warn("Smart back navigation failed, using fallback:", error);
      router.push(fallbackRoute);
    }
  }, [canGoBack, fallbackRoute, preventCycles, router, getRouteInfo, hasCustomFallback]);

  // Get smart back text based on where we would go
  const getBackText = useCallback(() => {
    // Return default text during SSR
    if (typeof window === 'undefined') {
      return `Back to ${fallbackRoute === "/dashboard" ? "Dashboard" : "Home"}`;
    }

    const currentPath = window.location.pathname;
    const routeInfo = getRouteInfo(currentPath);

    if (routeInfo.parent) {
      const parentName =
        routeInfo.parent === "/dashboard"
          ? "Dashboard"
          : routeInfo.parent === "/workouts"
          ? "Workouts"
          : routeInfo.parent === "/progress"
          ? "Progress"
          : routeInfo.parent === "/workouts/plan"
          ? "Workout Plans"
          : routeInfo.parent === "/workouts/muscle-targeting"
          ? "Muscle Targeting"
          : routeInfo.parent === "/auth/signin"
          ? "Sign In"
          : "Back";
      return `Back to ${parentName}`;
    }

    return canGoBack
      ? "Back"
      : `Back to ${fallbackRoute === "/dashboard" ? "Dashboard" : "Home"}`;
  }, [canGoBack, fallbackRoute, getRouteInfo]);

  return {
    handleBack,
    canGoBack,
    fallbackRoute,
    getBackText,
    navigationHistory, // Expose for debugging
  };
}
