/**
 * Unsplash Image Service
 * Dynamically fetches fitness-specific images using Unsplash API with advanced uniqueness tracking
 */

import { MuscleGroup } from './workoutImageStorage';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  description?: string;
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

/**
 * Fetch images from Unsplash API with specific fitness keywords
 */
export class UnsplashImageService {
  private apiKey: string;
  private baseUrl = 'https://api.unsplash.com';
  private imageCache = new Map<string, string[]>();
  private usedImages = new Set<string>();
  private workoutImageHistory: string[] = [];
  private maxHistorySize = 50; // Track last 50 workout images to avoid repeats

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get specific search terms for each muscle group to ensure fitness-related content
   */
  private getSearchTermsForMuscleGroup(muscleGroup: MuscleGroup): string[] {
    const searchTermsMap: Record<MuscleGroup, string[]> = {
      chest: [
        'gym chest workout bench press',
        'fitness chest training dumbbell',
        'bodybuilding chest exercise gym',
        'strength training chest workout'
      ],
      back: [
        'gym back workout pull ups',
        'fitness back training rowing',
        'strength training back exercise',
        'gym deadlift back workout'
      ],
      shoulders: [
        'gym shoulder workout press',
        'fitness shoulder training deltoid',
        'strength training shoulder exercise',
        'gym overhead press workout'
      ],
      arms: [
        'gym arm workout bicep curl',
        'fitness arm training tricep',
        'strength training arm exercise',
        'gym bicep tricep workout'
      ],
      legs: [
        'gym leg workout squat',
        'fitness leg training quadriceps',
        'strength training leg exercise',
        'gym squat lunge workout'
      ],
      glutes: [
        'gym glute workout hip thrust',
        'fitness glute training squat',
        'strength training glute exercise',
        'gym deadlift glute workout'
      ],
      core: [
        'gym core workout abs plank',
        'fitness core training abdominal',
        'strength training core exercise',
        'gym abs core workout'
      ],
      cardio: [
        'gym cardio workout treadmill',
        'fitness cardio training running',
        'gym cycling cardio exercise',
        'fitness HIIT cardio workout'
      ],
      full_body: [
        'gym full body workout compound',
        'fitness functional training crossfit',
        'strength training compound exercise',
        'gym deadlift full body workout'
      ]
    };

    return searchTermsMap[muscleGroup] || searchTermsMap.full_body;
  }

  /**
   * Fetch images from Unsplash for a specific muscle group
   */
  async fetchImagesForMuscleGroup(
    muscleGroup: MuscleGroup, 
    count: number = 8
  ): Promise<string[]> {
    const cacheKey = `${muscleGroup}-${count}`;
    
    // Return cached images if available
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const searchTerms = this.getSearchTermsForMuscleGroup(muscleGroup);
    const allImages: string[] = [];

    try {
      // Try each search term to get diverse images
      for (const searchTerm of searchTerms) {
        if (allImages.length >= count) break;

        const response = await fetch(
          `${this.baseUrl}/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${Math.ceil(count / searchTerms.length)}&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${this.apiKey}`,
            },
          }
        );

        if (response.ok) {
          const data: UnsplashSearchResponse = await response.json();
          const imageUrls = data.results.map(img => 
            `${img.urls.regular}&auto=format&fit=crop&w=800&h=600`
          );
          allImages.push(...imageUrls);
        } else {
          console.warn(`Failed to fetch images for term: ${searchTerm}`);
        }
      }

      // Remove duplicates and limit to requested count
      const uniqueImages = [...new Set(allImages)].slice(0, count);
      
      // Cache the results
      this.imageCache.set(cacheKey, uniqueImages);
      
      return uniqueImages;

    } catch (error) {
      console.error(`Error fetching images for ${muscleGroup}:`, error);
      return this.getFallbackImages(muscleGroup, count);
    }
  }

  /**
   * Get contextual image for workout based on exercises and name with uniqueness guarantee
   */
  async fetchImageForWorkout(
    exercises: Array<{ muscleGroup?: string; name?: string }>,
    workoutName?: string,
    category?: string
  ): Promise<string> {
    try {
      // Generate multiple search terms to increase uniqueness options
      const searchTerms = this.generateSearchTerms(exercises, workoutName, category);
      
      // Try each search term until we find a unique image
      for (const searchTerm of searchTerms) {
        const uniqueImage = await this.fetchUniqueImage(searchTerm);
        if (uniqueImage) {
          // Track this image as used
          this.trackUsedImage(uniqueImage);
          return uniqueImage;
        }
      }

      // If all else fails, get a fallback image that's not recently used
      return this.getUniqueFallbackImage();

    } catch (error) {
      console.error('Error fetching workout image:', error);
      return this.getUniqueFallbackImage();
    }
  }

  /**
   * Generate multiple search terms for better image variety
   */
  private generateSearchTerms(
    exercises: Array<{ muscleGroup?: string; name?: string }>,
    workoutName?: string,
    category?: string
  ): string[] {
    const terms: string[] = [];
    
    // Base contextual terms from workout name
    if (workoutName) {
      const nameWords = workoutName.toLowerCase();
      
      if (/hiit|high.intensity|metabolic|blast|circuit/.test(nameWords)) {
        terms.push('gym HIIT high intensity workout', 'fitness circuit training', 'metabolic workout gym');
      } else if (/cardio|running|cycling|aerobic/.test(nameWords)) {
        terms.push('gym cardio fitness workout', 'fitness running treadmill', 'gym cycling cardio');
      } else if (/strength|mass.*builder|powerlifting|heavy/.test(nameWords)) {
        terms.push('gym strength training workout', 'powerlifting gym fitness', 'strength training equipment');
      } else if (/pull.*day|back.*day/.test(nameWords)) {
        terms.push('gym back workout pull ups', 'fitness back training', 'gym rowing back exercise');
      } else if (/push.*day|chest.*day/.test(nameWords)) {
        terms.push('gym chest workout bench press', 'fitness chest training', 'gym push workout');
      } else if (/leg.*day|lower.*body/.test(nameWords)) {
        terms.push('gym leg workout squat', 'fitness leg training', 'gym lower body workout');
      } else if (/stretch|recovery|yoga|mobility/.test(nameWords)) {
        terms.push('gym stretching yoga fitness', 'fitness recovery stretching', 'gym mobility workout');
      }
    }

    // Add muscle group specific terms
    if (exercises.length > 0) {
      const muscleGroupCounts: Record<string, number> = {};
      
      exercises.forEach(ex => {
        if (ex.muscleGroup) {
          const normalized = ex.muscleGroup.toLowerCase().replace(/\s+/g, '_');
          muscleGroupCounts[normalized] = (muscleGroupCounts[normalized] || 0) + 1;
        }
      });

      const topMuscleGroups = Object.entries(muscleGroupCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2); // Top 2 muscle groups

      topMuscleGroups.forEach(([group]) => {
        if (group in this.getSearchTermsForMuscleGroup) {
          const groupTerms = this.getSearchTermsForMuscleGroup(group as MuscleGroup);
          terms.push(...groupTerms.slice(0, 2)); // Add first 2 terms for each group
        }
      });
    }

    // Add category-based terms
    if (category) {
      const categoryLower = category.toLowerCase();
      if (categoryLower.includes('strength')) {
        terms.push('gym strength training', 'fitness weight lifting');
      } else if (categoryLower.includes('cardio')) {
        terms.push('gym cardio workout', 'fitness cardio training');
      } else if (categoryLower.includes('flexibility')) {
        terms.push('gym flexibility yoga', 'fitness stretching');
      }
    }

    // Add generic terms as fallbacks
    terms.push(
      'gym fitness workout',
      'fitness training gym',
      'gym exercise workout',
      'fitness gym training'
    );

    return [...new Set(terms)]; // Remove duplicates
  }

  /**
   * Fetch a unique image that hasn't been used recently
   */
  private async fetchUniqueImage(searchTerm: string): Promise<string | null> {
    const maxAttempts = 10; // Try up to 10 images per search term
    
    const response = await fetch(
      `${this.baseUrl}/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${maxAttempts}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) return null;

    const data: UnsplashSearchResponse = await response.json();
    
    // Find first image that hasn't been used recently
    for (const img of data.results) {
      const imageUrl = `${img.urls.regular}&auto=format&fit=crop&w=800&h=600`;
      if (!this.workoutImageHistory.includes(imageUrl)) {
        return imageUrl;
      }
    }

    return null; // No unique image found
  }

  /**
   * Track used images to prevent repetition
   */
  private trackUsedImage(imageUrl: string): void {
    this.workoutImageHistory.push(imageUrl);
    
    // Keep history size manageable
    if (this.workoutImageHistory.length > this.maxHistorySize) {
      this.workoutImageHistory.shift(); // Remove oldest
    }
  }

  /**
   * Get a fallback image that hasn't been used recently
   */
  private getUniqueFallbackImage(): string {
    const fallbackUrls = [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600", 
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&h=600",
    ];

    // Find first fallback that hasn't been used recently
    for (const url of fallbackUrls) {
      if (!this.workoutImageHistory.includes(url)) {
        this.trackUsedImage(url);
        return url;
      }
    }

    // If all fallbacks used, return the oldest one and reset tracking
    const selectedImage = fallbackUrls[0];
    this.workoutImageHistory = [selectedImage]; // Reset with just this one
    return selectedImage;
  }

  /**
   * Fallback images when API calls fail
   */
  private getFallbackImages(muscleGroup: MuscleGroup, count: number): string[] {
    const fallbackUrls = [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&h=600",
    ];

    return Array.from({ length: count }, (_, i) => fallbackUrls[i % fallbackUrls.length]);
  }

  /**
   * Pre-warm the cache with images for all muscle groups
   */
  async preWarmCache(): Promise<void> {
    const muscleGroups: MuscleGroup[] = [
      'chest', 'back', 'shoulders', 'arms', 'legs', 
      'glutes', 'core', 'cardio', 'full_body'
    ];

    const promises = muscleGroups.map(group => 
      this.fetchImagesForMuscleGroup(group, 8).catch(error => {
        console.warn(`Failed to pre-warm cache for ${group}:`, error);
        return [];
      })
    );

    await Promise.allSettled(promises);
    console.log('✅ Unsplash image cache pre-warmed for all muscle groups');
  }

  /**
   * Clear image usage history (useful for seeding operations)
   */
  public clearImageHistory(): void {
    this.workoutImageHistory = [];
    this.usedImages.clear();
    console.log('🔄 Image usage history cleared');
  }

  /**
   * Get current image usage stats
   */
  public getImageStats(): { 
    historySize: number; 
    maxHistorySize: number; 
    cacheSize: number;
  } {
    return {
      historySize: this.workoutImageHistory.length,
      maxHistorySize: this.maxHistorySize,
      cacheSize: this.imageCache.size
    };
  }
}

// Create singleton instance
let unsplashService: UnsplashImageService | null = null;

export const getUnsplashService = (): UnsplashImageService => {
  if (!unsplashService) {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) {
      throw new Error('UNSPLASH_ACCESS_KEY environment variable is not set');
    }
    unsplashService = new UnsplashImageService(apiKey);
  }
  return unsplashService;
};

export default UnsplashImageService;