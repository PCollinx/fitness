export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    landscape: string;
  };
  alt: string;
  photographer: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
}

/**
 * API endpoint to fetch fresh fitness images from Pexels
 * GET /api/images/pexels?muscleGroup=chest&count=8
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const muscleGroup = searchParams.get("muscleGroup") || "full_body";
    const count = parseInt(searchParams.get("count") || "8");

    // Validate count
    if (count < 1 || count > 80) {
      return NextResponse.json(
        { error: "Count must be between 1 and 80" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Pexels API key not configured" },
        { status: 500 }
      );
    }

    // Define search terms for each muscle group (fitness-focused)
    const searchTermsMap: Record<string, string[]> = {
      chest: [
        "gym chest workout bench press",
        "fitness chest training",
        "gym bench press exercise",
      ],
      back: [
        "gym back workout pull ups",
        "fitness back training",
        "gym rowing exercise",
      ],
      shoulders: [
        "gym shoulder workout press",
        "fitness shoulder training",
        "gym shoulder exercise",
      ],
      arms: [
        "gym arm workout bicep",
        "fitness arm training",
        "gym bicep tricep exercise",
      ],
      legs: [
        "gym leg workout squat",
        "fitness leg training",
        "gym squat exercise",
      ],
      glutes: [
        "gym glute workout",
        "fitness glute training",
        "gym hip thrust exercise",
      ],
      core: [
        "gym core workout abs",
        "fitness core training",
        "gym abs exercise plank",
      ],
      cardio: [
        "gym cardio workout",
        "fitness cardio training",
        "gym treadmill running",
      ],
      full_body: [
        "gym full body workout",
        "fitness training gym",
        "gym exercise workout",
      ],
    };

    const searchTerms =
      searchTermsMap[muscleGroup] || searchTermsMap.full_body;
    const allImages: PexelsPhoto[] = [];

    // Fetch images from multiple search terms for variety
    for (const searchTerm of searchTerms) {
      if (allImages.length >= count) break;

      const perPage = Math.ceil(count / searchTerms.length);
      const response = await fetch(
        `https://api.pexels.com/v1/search?` +
          `query=${encodeURIComponent(searchTerm)}` +
          `&per_page=${perPage}` +
          `&orientation=landscape`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Pexels API error for term "${searchTerm}": ${response.status}`
        );
        continue;
      }

      const data: PexelsSearchResponse = await response.json();
      allImages.push(...filterFitnessImages(data.photos));
    }

    // Remove duplicates and get unique images
    const uniqueImages = [...new Map(allImages.map(img => [img.id, img])).values()];
    
    // Limit to requested count
    const selectedImages = uniqueImages.slice(0, count);

    // Format response with image URLs
    const imageUrls = selectedImages.map((img) => img.src.large);

    return NextResponse.json({
      images: imageUrls,
      count: imageUrls.length,
      muscleGroup,
    });
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Filter images to ensure they're fitness-related
 * Check alt text and photographer keywords
 */
function filterFitnessImages(images: PexelsPhoto[]): PexelsPhoto[] {
  const fitnessKeywords = [
    "gym",
    "fitness",
    "workout",
    "exercise",
    "training",
    "muscle",
    "strength",
    "cardio",
    "sport",
    "athlete",
    "lifting",
    "running",
    "bodybuilding",
    "crossfit",
    "dumbbell",
    "barbell",
    "bench",
    "squat",
    "deadlift",
  ];

  return images.filter((img) => {
    const altText = (img.alt || "").toLowerCase();

    // Check if alt text contains fitness keywords
    const hasFitnessKeyword = fitnessKeywords.some((keyword) =>
      altText.includes(keyword)
    );

    return hasFitnessKeyword;
  });
}
