import { NextRequest, NextResponse } from 'next/server';
import { MuscleGroup } from '@/app/utils/workoutImageStorage';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
  description?: string;
  tags?: Array<{ title: string }>;
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

/**
 * API endpoint to fetch fresh fitness images from Unsplash
 * GET /api/images/unsplash?muscleGroup=chest&count=8
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get('muscleGroup') as MuscleGroup;
    const count = parseInt(searchParams.get('count') || '8');

    if (!muscleGroup) {
      return NextResponse.json(
        { error: 'Missing muscleGroup parameter' },
        { status: 400 }
      );
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: 'Unsplash API key not configured' },
        { status: 500 }
      );
    }

    // Enhanced search terms for each muscle group with strict fitness focus
    const searchConfigs: Record<MuscleGroup, {
      terms: string[];
      excludeTerms: string[];
    }> = {
      chest: {
        terms: ['gym chest workout', 'bench press exercise', 'chest training gym'],
        excludeTerms: ['wedding', 'fashion', 'portrait', 'model', 'beach']
      },
      back: {
        terms: ['gym back workout', 'pull up exercise', 'rowing machine gym'],
        excludeTerms: ['wedding', 'fashion', 'portrait', 'spine', 'medical']
      },
      shoulders: {
        terms: ['shoulder workout gym', 'dumbbell shoulder press', 'shoulder training'],
        excludeTerms: ['wedding', 'fashion', 'portrait', 'injury', 'medical']
      },
      arms: {
        terms: ['arm workout gym', 'bicep curl exercise', 'tricep workout'],
        excludeTerms: ['wedding', 'fashion', 'tattoo', 'portrait', 'medical']
      },
      legs: {
        terms: ['leg workout gym', 'squat exercise', 'leg press machine'],
        excludeTerms: ['wedding', 'fashion', 'running', 'marathon', 'injury']
      },
      glutes: {
        terms: ['glute workout gym', 'hip thrust exercise', 'squat training'],
        excludeTerms: ['wedding', 'fashion', 'yoga', 'medical', 'beach']
      },
      core: {
        terms: ['core workout gym', 'plank exercise', 'abs training'],
        excludeTerms: ['wedding', 'fashion', 'yoga', 'beach', 'medical']
      },
      cardio: {
        terms: ['gym cardio workout', 'treadmill exercise gym', 'indoor cycling'],
        excludeTerms: ['wedding', 'fashion', 'outdoor', 'marathon', 'race']
      },
      full_body: {
        terms: ['full body workout gym', 'compound exercise', 'functional training'],
        excludeTerms: ['wedding', 'fashion', 'outdoor', 'competition', 'beach']
      }
    };

    const config = searchConfigs[muscleGroup];
    if (!config) {
      return NextResponse.json(
        { error: 'Invalid muscle group' },
        { status: 400 }
      );
    }

    const allImages: UnsplashImage[] = [];
    
    // Search with multiple terms to get diverse results
    for (const searchTerm of config.terms) {
      if (allImages.length >= count) break;

      const excludeQuery = config.excludeTerms.map(term => `-${term}`).join(',');
      const query = `${searchTerm} ${excludeQuery}`;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?` +
        `query=${encodeURIComponent(query)}&` +
        `per_page=20&` +
        `orientation=landscape&` +
        `content_filter=high`,
        {
          headers: {
            'Authorization': `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Unsplash API error for term "${searchTerm}": ${response.status}`);
        continue;
      }

      const data: UnsplashSearchResponse = await response.json();
      
      // Filter images to ensure they are fitness-related
      const fitnessImages = filterFitnessImages(data.results);
      allImages.push(...fitnessImages.slice(0, count - allImages.length));
    }

    // Return image URLs
    const imageUrls = allImages
      .slice(0, count)
      .map(img => img.urls.regular);

    return NextResponse.json({
      images: imageUrls,
      total: allImages.length,
      muscleGroup
    });

  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

/**
 * Filter images to ensure they are fitness-related and appropriate
 */
function filterFitnessImages(images: UnsplashImage[]): UnsplashImage[] {
  const fitnessKeywords = [
    'gym', 'workout', 'exercise', 'fitness', 'training', 'muscle', 'strength',
    'dumbbell', 'barbell', 'weight', 'equipment', 'machine', 'squat', 'bench',
    'press', 'curl', 'lift', 'pull', 'push', 'cardio', 'treadmill', 'athletic'
  ];

  const excludeKeywords = [
    'wedding', 'bride', 'groom', 'marriage', 'ceremony', 'dress', 'suit',
    'train', 'railway', 'locomotive', 'station', 'track', 'railroad',
    'fashion', 'model', 'portrait', 'beach', 'vacation', 'party',
    'food', 'restaurant', 'cooking', 'kitchen', 'medical', 'hospital',
    'injury', 'pain', 'therapy', 'rehabilitation'
  ];

  return images.filter(image => {
    const text = `${image.alt_description || ''} ${image.description || ''}`.toLowerCase();
    const tags = image.tags?.map(tag => tag.title.toLowerCase()).join(' ') || '';
    const allText = `${text} ${tags}`;

    // Must contain at least one fitness keyword
    const hasFitnessKeyword = fitnessKeywords.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );

    // Must not contain any exclude keywords
    const hasExcludeKeyword = excludeKeywords.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );

    // Additional check: image ID or description should not contain problematic terms
    const imageId = image.id.toLowerCase();
    const hasProblematicId = excludeKeywords.some(keyword => 
      imageId.includes(keyword)
    );

    return hasFitnessKeyword && !hasExcludeKeyword && !hasProblematicId;
  });
}