"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface UseSmartBackOptions {
  fallbackRoute?: string;
  preventCycles?: boolean;
}

export function useSmartBack(options: UseSmartBackOptions = {}) {
  const router = useRouter();
  const { fallbackRoute = "/dashboard", preventCycles = true } = options;

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's meaningful browser history
    const hasHistory = window.history.length > 1;

    // Check referrer to see if we came from within our app
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    const isInternalNavigation = Boolean(
      referrer &&
        referrer.includes(currentOrigin) &&
        !referrer.includes("/auth/") && // Exclude auth redirects
        referrer !== window.location.href // Not a refresh
    );

    setCanGoBack(hasHistory && isInternalNavigation);
  }, []);

  const handleBack = useCallback(() => {
    try {
      if (canGoBack && preventCycles) {
        // Store current path and set up fallback timer for cycle detection
        const currentPath = window.location.pathname;

        // Set a timer to check if navigation actually happened
        const fallbackTimer = setTimeout(() => {
          // If we're still on the same page after attempting to go back,
          // it means the back navigation failed or we hit a cycle
          if (window.location.pathname === currentPath) {
            router.push(fallbackRoute);
          }
        }, 200); // Increased timeout for more reliable detection

        // Attempt browser back navigation
        window.history.back();

        // Clear timer on successful navigation change
        const handleNavigation = () => {
          clearTimeout(fallbackTimer);
          window.removeEventListener("popstate", handleNavigation);
          // Also remove the timeout cleanup
          clearTimeout(cleanupTimer);
        };

        window.addEventListener("popstate", handleNavigation);

        // Cleanup timeout and event listener after reasonable delay
        const cleanupTimer = setTimeout(() => {
          clearTimeout(fallbackTimer);
          window.removeEventListener("popstate", handleNavigation);
        }, 1500);
      } else {
        // No safe back history available, use fallback route
        router.push(fallbackRoute);
      }
    } catch (error) {
      console.warn("Smart back navigation failed, using fallback:", error);
      router.push(fallbackRoute);
    }
  }, [canGoBack, fallbackRoute, preventCycles, router]);

  // Return the interface with helpful information
  return {
    handleBack,
    canGoBack,
    fallbackRoute,
    // Helper to get appropriate back text
    getBackText: useCallback(() => {
      return canGoBack
        ? "Back"
        : `Back to ${fallbackRoute === "/dashboard" ? "Dashboard" : "Home"}`;
    }, [canGoBack, fallbackRoute]),
  };
}
