"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaWeightHanging,
  FaRulerVertical,
  FaDumbbell,
  FaRunning,
  FaChartLine,
  FaTrophy,
  FaLock,
  FaBullseye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUpload,
} from "react-icons/fa";

import {
  UserProfile,
  loadUserProfile,
  saveUserProfile,
  createUserProfile,
} from "../utils/userStorage/profileUtils";

import {
  validateAndProcessImage,
  compressImage,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from "../utils/userStorage/imageUtils";

import ProfileImageUpload from "../components/ProfileImageUpload";
import { useUserProfile } from "../context/UserProfileContext";
import { useWorkoutStreak } from "../hooks/useWorkoutStreak";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const {
    userProfile,
    isLoading: isProfileLoading,
    updateUserProfile,
  } = useUserProfile();
  const { streakData, isLoading: isStreakLoading } = useWorkoutStreak();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [workoutStats, setWorkoutStats] = useState<{
    totalWorkouts: number;
    recentWorkouts: any[];
  }>({
    totalWorkouts: 0,
    recentWorkouts: [],
  });
  const [uploadStatus, setUploadStatus] = useState<{
    isUploading: boolean;
    isError: boolean;
    message: string;
  }>({
    isUploading: false,
    isError: false,
    message: "",
  });

  const fitnessLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
  ];
  const fitnessGoalsOptions = [
    "Strength",
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "Overall Health",
  ];

  useEffect(() => {
    // Use the userProfile from context
    if (userProfile && !isProfileLoading) {
      setUserData(userProfile);
      setIsLoading(false);
    }
  }, [userProfile, isProfileLoading]);

  // Fetch actual workout data
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (status !== "authenticated") return;

      try {
        // Fetch recent workouts
        const workoutsResponse = await fetch("/api/workouts/recent");
        if (workoutsResponse.ok) {
          const workoutsData = await workoutsResponse.json();
          setRecentWorkouts(workoutsData || []);
        }

        // Fetch comprehensive progress to get total workout count
        const progressResponse = await fetch("/api/progress/comprehensive");
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setWorkoutStats({
            totalWorkouts: progressData?.workoutMetrics?.totalSessions || 0,
            recentWorkouts: recentWorkouts,
          });
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
        setWorkoutStats({ totalWorkouts: 0, recentWorkouts: [] });
      }
    };

    fetchWorkoutData();
  }, [status]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset any temporary changes
      setTempImage(null);
    }
    setIsEditing(!isEditing);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus({
        isUploading: true,
        isError: false,
        message: "Processing image...",
      });

      // Validate and process the image
      const validationResult = await validateAndProcessImage(file);

      if (!validationResult.isValid) {
        // Show error message
        setUploadStatus({
          isUploading: false,
          isError: true,
          message: validationResult.message || "Invalid image file",
        });
        return;
      }

      // Set the processed image data
      setTempImage(validationResult.imageData || "");

      setUploadStatus({
        isUploading: false,
        isError: false,
        message: "Image ready to save",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus({
          isUploading: false,
          isError: false,
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadStatus({
        isUploading: false,
        isError: true,
        message: "Failed to process image. Please try again.",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      setUploadStatus({
        isUploading: true,
        isError: false,
        message: "Saving profile...",
      });

      // Create updated profile with the temp image if available
      const updatedProfile: UserProfile = {
        ...userData,
        image: tempImage || userData.image,
        lastUpdated: new Date().toISOString(),
      };

      // Save the updated profile using context
      await updateUserProfile(updatedProfile);
      setUserData(updatedProfile);

      setUploadStatus({
        isUploading: false,
        isError: false,
        message: "Profile updated successfully!",
      });

      // Reset state
      setIsEditing(false);
      setTempImage(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus({
          isUploading: false,
          isError: false,
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setUploadStatus({
        isUploading: false,
        isError: true,
        message: "Failed to save profile. Please try again.",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!userData) return;

    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleGoalChange = (goal: string) => {
    if (!userData) return;

    const updatedGoals = userData.fitnessGoals.includes(goal)
      ? userData.fitnessGoals.filter((g) => g !== goal)
      : [...userData.fitnessGoals, goal];

    setUserData({
      ...userData,
      fitnessGoals: updatedGoals,
      lastUpdated: new Date().toISOString(),
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <FaLock className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-300 mb-6">
            Please sign in to view and manage your profile.
          </p>
          <Link
            href="/auth/signin"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8 pt-12 fade-in">
      <div className="mb-6">
        <BackButton fallbackRoute="/dashboard" text="Back to Dashboard" />
      </div>

      {/* Display success/error messages */}
      {uploadStatus.message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            uploadStatus.isError
              ? "bg-red-500/20 text-red-300"
              : "bg-green-500/20 text-green-300"
          }`}
        >
          {uploadStatus.isError ? (
            <FaExclamationTriangle className="inline mr-2" />
          ) : (
            <FaCheckCircle className="inline mr-2" />
          )}
          {uploadStatus.message}
        </div>
      )}

      {userData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture & Stats */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg slide-in-left">
              {/* Profile Picture Section */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-yellow-500/20 to-gray-700/40 flex items-center justify-center">
                  <ProfileImageUpload
                    image={userData.image}
                    tempImage={tempImage}
                    isEditing={isEditing}
                    onUpload={handleImageUpload}
                    userName={userData.name}
                  />
                </div>

                <div className="p-6 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 w-full text-center focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {userData.name}
                    </h1>
                  )}
                  <p className="text-gray-400 flex items-center justify-center">
                    <FaEnvelope className="mr-2" />
                    {userData.email}
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="mx-auto mb-6 flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Stats Section */}
              <div className="border-t border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Stats & Activity
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-yellow-500 flex justify-center mb-2">
                      <FaDumbbell className="h-6 w-6" />
                    </div>
                    <p className="text-gray-300 text-sm">Workouts</p>
                    <p className="text-white font-bold text-xl">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-600 h-6 w-8 mx-auto rounded"></div>
                      ) : (
                        workoutStats.totalWorkouts
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-yellow-500 flex justify-center mb-2">
                      <FaTrophy className="h-6 w-6" />
                    </div>
                    <p className="text-gray-300 text-sm">Current Streak</p>
                    <p className="text-white font-bold text-xl">
                      {isStreakLoading ? (
                        <div className="animate-pulse bg-gray-600 h-6 w-16 mx-auto rounded"></div>
                      ) : (
                        `${streakData?.currentStreak || 0}`
                      )}
                    </p>
                    {!isStreakLoading && (
                      <p className="text-gray-400 text-xs mt-1">
                        day {streakData?.currentStreak === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3 text-center col-span-2">
                    <div className="text-yellow-500 flex justify-center mb-2">
                      <FaCalendarAlt className="h-6 w-6" />
                    </div>
                    <p className="text-gray-300 text-sm">Member Since</p>
                    <p className="text-white font-bold">
                      {userData.dateJoined}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/progress"
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-colors"
                  >
                    <FaChartLine className="mr-2" />
                    View Progress
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden slide-in-right">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Profile Information
                </h2>

                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={uploadStatus.isUploading}
                      className={`bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center transition-colors ${
                        uploadStatus.isUploading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {uploadStatus.isUploading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-black rounded-full mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={uploadStatus.isUploading}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Bio Section */}
                <div className="mb-6">
                  <label className="text-gray-400 mb-2">About Me</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    ></textarea>
                  ) : (
                    <p className="text-white bg-gray-700 rounded-lg px-4 py-3">
                      {userData.bio}
                    </p>
                  )}
                </div>

                {/* Physical Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-gray-400 mb-2 flex items-center">
                      <FaWeightHanging className="mr-2 text-yellow-500" />
                      Weight
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="weight"
                        value={userData.weight}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 rounded-lg px-4 py-3">
                        {userData.weight}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-400 mb-2 flex items-center">
                      <FaRulerVertical className="mr-2 text-yellow-500" />
                      Height
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="height"
                        value={userData.height}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 rounded-lg px-4 py-3">
                        {userData.height}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fitness Level */}
                <div className="mb-6">
                  <label className="text-gray-400 mb-2 flex items-center">
                    <FaRunning className="mr-2 text-yellow-500" />
                    Fitness Level
                  </label>
                  {isEditing ? (
                    <select
                      name="fitnessLevel"
                      value={userData.fitnessLevel}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      {fitnessLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700 rounded-lg px-4 py-3">
                      {userData.fitnessLevel}
                    </p>
                  )}
                </div>

                {/* Fitness Goals */}
                <div>
                  <label className="text-gray-400 mb-2 flex items-center">
                    <FaBullseye className="mr-2 text-yellow-500" />
                    Fitness Goals
                  </label>

                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {fitnessGoalsOptions.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleGoalChange(goal)}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            userData.fitnessGoals.includes(goal)
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userData.fitnessGoals.map((goal) => (
                        <span
                          key={goal}
                          className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Workout History Preview */}
            <div className="mt-6 bg-gray-800 rounded-xl shadow-lg overflow-hidden slide-up">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  Recent Workouts
                </h2>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {recentWorkouts.length > 0 ? (
                    recentWorkouts.slice(0, 3).map((workout, index) => (
                      <div
                        key={workout.id || index}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white">
                            {workout.name}
                          </h3>
                          <span className="text-gray-400 text-sm">
                            {new Date(workout.date).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-gray-300 text-sm">
                          <FaDumbbell className="mr-2 text-yellow-500" />
                          <span>Completed {workout.exercises} exercises</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-yellow-500 mb-4">
                        <FaDumbbell className="w-12 h-12 mx-auto" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">
                        No workouts yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Start your fitness journey by completing your first
                        workout!
                      </p>
                      <Link
                        href="/workouts"
                        className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Browse Workouts
                      </Link>
                    </div>
                  )}
                </div>

                {recentWorkouts.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/workouts/history"
                      className="text-yellow-500 hover:text-yellow-400 inline-flex items-center transition-colors"
                    >
                      View All History
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
