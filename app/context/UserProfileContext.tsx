"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  UserProfile,
  loadUserProfile,
  saveUserProfile,
  createUserProfile,
} from "../utils/userStorage/profileUtils";

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType>({
  userProfile: null,
  isLoading: true,
  updateUserProfile: async () => {},
  refreshUserProfile: async () => {},
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
        // Try to load existing profile
        const profile = await loadUserProfile(userId);

        if (profile) {
          setUserProfile(profile);
        } else {
          // Create new profile if none exists
          const newProfile = await createUserProfile(
            userId,
            session.user.email || "",
            {
              name: session.user.name || "Fitness Enthusiast",
              image: session.user.image || null,
            }
          );
          setUserProfile(newProfile);
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
  const updateUserProfile = async (profile: UserProfile) => {
    try {
      await saveUserProfile(profile);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Function to manually refresh the profile data
  const refreshUserProfile = async () => {
    await loadProfile();
  };

  return (
    <UserProfileContext.Provider
      value={{ userProfile, isLoading, updateUserProfile, refreshUserProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
