"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string;
  weight: string;
  height: string;
  fitnessLevel: string;
  fitnessGoals: string[];
  dateJoined: string;
  workoutsCompleted: number;
  streakDays: number;
  lastUpdated: string;
  onboardingCompleted: boolean;
};

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  updateUserProfile: (
    updates: Partial<
      Omit<UserProfile, "id" | "email" | "dateJoined" | "lastUpdated">
    >
  ) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  uploadProfileImage: (imageData: string) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType>({
  userProfile: null,
  isLoading: true,
  updateUserProfile: async () => {},
  refreshUserProfile: async () => {},
  uploadProfileImage: async () => false,
});

export const useUserProfile = () => useContext(UserProfileContext);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    if (status === "loading") return;

    setIsLoading(true);
    try {
      if (status === "authenticated" && session?.user?.email) {
        const userId = session.user.email;

        // Fetch profile from API
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        } else if (response.status === 404) {
          // User not found, create default profile on first load
          const defaultProfile: Partial<UserProfile> = {
            name: session.user.name || "Fitness Enthusiast",
            bio: "Fitness enthusiast passionate about strength training and nutrition.",
            weight: "70 kg",
            height: "175 cm",
            fitnessLevel: "Beginner",
            fitnessGoals: ["Overall Health"],
          };

          await updateUserProfile(defaultProfile);
        } else {
          console.error("Failed to fetch user profile");
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile on initial render and when session changes
  useEffect(() => {
    loadProfile();
  }, [session, status]);

  // Update profile function that can be called from any component
  const updateUserProfile = async (
    updates: Partial<
      Omit<UserProfile, "id" | "email" | "dateJoined" | "lastUpdated">
    >
  ) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      if (result.success && result.user) {
        setUserProfile(result.user);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Upload profile image function
  const uploadProfileImage = async (imageData: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/profile/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      if (result.success) {
        // Update the profile with new image
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            image: result.image,
            lastUpdated: result.lastUpdated,
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return false;
    }
  };

  // Function to manually refresh the profile data
  const refreshUserProfile = async () => {
    await loadProfile();
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        updateUserProfile,
        refreshUserProfile,
        uploadProfileImage,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
