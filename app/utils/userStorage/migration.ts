/**
 * Migration utility to transfer user data from localStorage to database
 * This should be called once during the transition period
 */

import { UserProfile } from "../../context/UserProfileContext";

export interface LocalStorageUserProfile {
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
}

/**
 * Check if user has localStorage data that needs migration
 */
export const hasLocalStorageData = (userId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const localData = localStorage.getItem(`user_profile_${userId}`);
    return localData !== null;
  } catch (error) {
    console.error("Error checking localStorage data:", error);
    return false;
  }
};

/**
 * Load user profile data from localStorage
 */
export const loadLocalStorageProfile = (
  userId: string
): LocalStorageUserProfile | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedProfile = localStorage.getItem(`user_profile_${userId}`);
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    return null;
  } catch (error) {
    console.error("Error loading localStorage profile:", error);
    return null;
  }
};

/**
 * Migrate localStorage data to database via API
 */
export const migrateLocalStorageToDatabase = async (
  userId: string
): Promise<boolean> => {
  try {
    // Check if there's localStorage data to migrate
    const localProfile = loadLocalStorageProfile(userId);
    if (!localProfile) {
      console.log("No localStorage data found for migration");
      return false;
    }

    console.log("Migrating localStorage data to database:", localProfile);

    // Transform localStorage data to API format
    const migrationData = {
      name: localProfile.name,
      bio: localProfile.bio,
      weight: localProfile.weight,
      height: localProfile.height,
      fitnessLevel: localProfile.fitnessLevel,
      fitnessGoals: localProfile.fitnessGoals,
    };

    // Send data to API
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(migrationData),
    });

    if (!response.ok) {
      let errorDetails = `Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += `, Details: ${JSON.stringify(errorData)}`;
      } catch (e) {
        errorDetails += `, Response: ${await response.text()}`;
      }
      throw new Error(`Migration failed: ${errorDetails}`);
    }

    const result = await response.json();

    if (result.success) {
      // Migrate profile image if it exists
      if (localProfile.image) {
        await migrateProfileImage(localProfile.image);
      }

      // Mark migration as complete
      localStorage.setItem(`migration_complete_${userId}`, "true");
      console.log("Migration completed successfully");

      return true;
    } else {
      throw new Error("Migration API call was not successful");
    }
  } catch (error) {
    console.error("Error during migration:", error);
    return false;
  }
};

/**
 * Migrate profile image from localStorage to database
 */
const migrateProfileImage = async (imageData: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/profile/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error migrating profile image:", error);
    return false;
  }
};

/**
 * Check if migration has been completed for this user
 */
export const isMigrationComplete = (userId: string): boolean => {
  if (typeof window === "undefined") return true;

  try {
    return localStorage.getItem(`migration_complete_${userId}`) === "true";
  } catch (error) {
    console.error("Error checking migration status:", error);
    return false;
  }
};

/**
 * Clean up localStorage after successful migration
 * This should be called after confirming the data is safely in the database
 */
export const cleanupLocalStorageData = (userId: string): void => {
  if (typeof window === "undefined") return;

  try {
    // Remove the old profile data
    localStorage.removeItem(`user_profile_${userId}`);

    // Keep the migration flag for a while in case we need to reference it
    console.log("localStorage cleanup completed");
  } catch (error) {
    console.error("Error cleaning up localStorage:", error);
  }
};

/**
 * Main migration function that handles the entire process
 * Returns true if migration was successful or not needed
 */
export const performUserDataMigration = async (
  userId: string
): Promise<boolean> => {
  try {
    // Check if migration is already complete
    if (isMigrationComplete(userId)) {
      console.log("Migration already completed for user:", userId);
      return true;
    }

    // Check if there's data to migrate
    if (!hasLocalStorageData(userId)) {
      console.log("No localStorage data found for user:", userId);
      // Mark as complete since there's nothing to migrate
      localStorage.setItem(`migration_complete_${userId}`, "true");
      return true;
    }

    // Perform the migration
    const success = await migrateLocalStorageToDatabase(userId);

    if (success) {
      // Clean up localStorage after successful migration
      // We might want to delay this or make it optional
      console.log(
        "Migration successful, localStorage data retained for backup"
      );
      return true;
    } else {
      console.error("Migration failed for user:", userId);
      return false;
    }
  } catch (error) {
    console.error("Error in performUserDataMigration:", error);
    return false;
  }
};
