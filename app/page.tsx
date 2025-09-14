"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaDumbbell,
  FaChartLine,
  FaUtensils,
  FaClock,
  FaPlayCircle,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect based on authentication status
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  // This content will only briefly show during redirect
  return (
    <div className="font-sans">
      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Welcome to FitTrack
              </h2>
              <span className="text-yellow-400">September 13, 2025</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-900 rounded-lg p-4 flex-1 min-w-[150px]">
                <div className="text-gray-400 mb-1">Redirecting...</div>
                <div className="text-2xl font-bold text-white">Please wait</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
