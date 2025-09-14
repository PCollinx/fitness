// User data storage utilities

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
};

// Default user data for new users or when no data exists
const defaultUserProfile: Omit<UserProfile, 'id' | 'email'> = {
  name: "Fitness Enthusiast",
  image: null,
  bio: "Fitness enthusiast passionate about strength training and nutrition.",
  weight: "70 kg",
  height: "175 cm",
  fitnessLevel: "Beginner",
  fitnessGoals: ["Overall Health"],
  dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  workoutsCompleted: 0,
  streakDays: 0,
  lastUpdated: new Date().toISOString(),
};

/**
 * Save user profile data to localStorage
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    // Update the lastUpdated timestamp
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(`user_profile_${profile.id}`, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Load user profile data from localStorage
 */
export const loadUserProfile = async (userId: string, email: string = ""): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') {
    return {
      id: userId,
      email,
      ...defaultUserProfile,
    };
  }
  
  try {
    const storedProfile = localStorage.getItem(`user_profile_${userId}`);
    
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    
    // If no profile exists, return null so caller can create a new one if needed
    return null;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
};

/**
 * Save profile image to localStorage
 * @param userId User ID
 * @param imageData Base64 encoded image data
 * @returns Boolean indicating success
 */
export const saveProfileImage = async (userId: string, imageData: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Load the current profile
    const profile = await loadUserProfile(userId);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Validate image data (basic check that it's a data URL)
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid image data format');
    }
    
    // Check file size (roughly estimate the size from base64 string)
    // Base64 encoding increases size by roughly 4/3, so 4MB base64 ~= 3MB file
    const sizeInBytes = Math.ceil((imageData.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      throw new Error('Image file size exceeds 5MB limit');
    }
    
    // Update the profile with the new image
    profile.image = imageData;
    
    // Save the updated profile
    await saveUserProfile(profile);
    
    return true;
  } catch (error) {
    console.error("Error saving profile image:", error);
    return false;
  }
};

/**
 * Get profile image from localStorage
 * @param userId User ID
 * @returns Base64 encoded image data or null
 */
export const getProfileImage = async (userId: string): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profile = await loadUserProfile(userId);
    return profile?.image || null;
  } catch (error) {
    console.error("Error getting profile image:", error);
    return null;
  }
};

/**
 * Update user profile data
 * @param userId User ID
 * @param updates Partial user profile data to update
 * @returns Updated UserProfile object or null if error
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const currentProfile = await loadUserProfile(userId);
    
    if (!currentProfile) {
      throw new Error('Profile not found');
    }
    
    // Create updated profile with new values
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    // Save updated profile
    await saveUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

/**
 * Create a new user profile
 * @param userId User ID 
 * @param email User email
 * @param customData Optional custom data to override defaults
 * @returns The created profile or null if error
 */
export const createUserProfile = async (
  userId: string,
  email: string = "",
  customData: Partial<Omit<UserProfile, 'id' | 'email'>> = {}
): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check if profile already exists
    const existingProfile = await loadUserProfile(userId);
    
    if (existingProfile) {
      return existingProfile; // Don't overwrite existing profile
    }
    
    // Create new profile
    const newProfile: UserProfile = {
      id: userId,
      email,
      ...defaultUserProfile,
      ...customData,
      dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toISOString()
    };
    
    // Save new profile
    await saveUserProfile(newProfile);
    
    return newProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
};

/**
 * Save user profile data to localStorage
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    // Update the lastUpdated timestamp
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(`user_profile_${profile.id}`, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Save profile image to localStorage
 * @param userId User ID
 * @param imageData Base64 encoded image data
 * @returns Boolean indicating success
 */
export const saveProfileImage = async (userId: string, imageData: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Load the current profile
    const profile = await loadUserProfile(userId);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Validate image data (basic check that it's a data URL)
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid image data format');
    }
    
    // Check file size (roughly estimate the size from base64 string)
    // Base64 encoding increases size by roughly 4/3, so 4MB base64 ~= 3MB file
    const sizeInBytes = Math.ceil((imageData.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      throw new Error('Image file size exceeds 5MB limit');
    }
    
    // Update the profile with the new image
    profile.image = imageData;
    
    // Save the updated profile
    await saveUserProfile(profile);
    
    return true;
  } catch (error) {
    console.error("Error saving profile image:", error);
    return false;
  }
};

/**
 * Get profile image from localStorage
 * @param userId User ID
 * @returns Base64 encoded image data or null
 */
export const getProfileImage = async (userId: string): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profile = await loadUserProfile(userId);
    return profile?.image || null;
  } catch (error) {
    console.error("Error getting profile image:", error);
    return null;
  }
};

/**
 * Update user profile data
 * @param userId User ID
 * @param updates Partial user profile data to update
 * @returns Updated UserProfile object or null if error
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const currentProfile = await loadUserProfile(userId);
    
    if (!currentProfile) {
      throw new Error('Profile not found');
    }
    
    // Create updated profile with new values
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    // Save updated profile
    await saveUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

/**
 * Load user profile data from localStorage
 */
export const loadUserProfile = async (userId: string, email: string = ""): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') {
    return {
      id: userId,
      email,
      ...defaultUserProfile,
    };
  }
  
  try {
    const storedProfile = localStorage.getItem(`user_profile_${userId}`);
    
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    
    // If no profile exists, return null so caller can create a new one if needed
    return null;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
};

/**
 * Save profile image to localStorage
 * @param userId User ID
 * @param imageData Base64 encoded image data
 * @returns Boolean indicating success
 */
export const saveProfileImage = (userId: string, imageData: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Load the current profile
    const profile = loadUserProfile(userId);
    
    // Validate image data (basic check that it's a data URL)
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid image data format');
    }
    
    // Check file size (roughly estimate the size from base64 string)
    // Base64 encoding increases size by roughly 4/3, so 4MB base64 ~= 3MB file
    const sizeInBytes = Math.ceil((imageData.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      throw new Error('Image file size exceeds 5MB limit');
    }
    
    // Update the profile with the new image
    profile.image = imageData;
    
    // Save the updated profile
    saveUserProfile(profile);
    
    return true;
  } catch (error) {
    console.error("Error saving profile image:", error);
    return false;
  }
};

/**
 * Get profile image from localStorage
 * @param userId User ID
 * @returns Base64 encoded image data or null
 */
export const getProfileImage = (userId: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profile = loadUserProfile(userId);
    return profile.image;
  } catch (error) {
    console.error("Error getting profile image:", error);
    return null;
  }
};

/**
 * Update user profile data
 * @param userId User ID
 * @param updates Partial user profile data to update
 * @returns Updated UserProfile object or null if error
 */
export const updateUserProfile = (
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id'>>
): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const currentProfile = loadUserProfile(userId);
    
    // Create updated profile with new values
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    // Save updated profile
    saveUserProfile(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};