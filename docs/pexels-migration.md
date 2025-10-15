# Migration from Unsplash to Pexels API

## Overview

This document explains the migration from Unsplash to Pexels for workout image generation in the FitTrack application.

## Reason for Migration

The Pexels API provides higher quality, more relevant fitness images with better search results compared to Unsplash for our specific use case.

## Changes Made

### 1. New Pexels Service Created

**File:** `/app/utils/pexelsImageService.ts`

A complete Pexels API integration service with:
- Image caching for performance
- Uniqueness tracking to avoid repeated images
- Muscle group-specific search terms
- Fallback images for API failures
- Smart workout image selection based on exercises and workout name

### 2. Updated Image Storage Service

**File:** `/app/utils/workoutImageStorage.ts`

**Changes:**
```typescript
// Before
import { getUnsplashService } from "./unsplashImageService";
const unsplashService = getUnsplashService();

// After
import { getPexelsService } from "./pexelsImageService";
const pexelsService = getPexelsService();
```

### 3. New API Endpoint

**File:** `/app/api/images/pexels/route.ts`

New endpoint for fetching Pexels images:
```
GET /api/images/pexels?muscleGroup=chest&count=8
```

**Response:**
```json
{
  "images": ["url1", "url2", ...],
  "count": 8,
  "muscleGroup": "chest"
}
```

### 4. Environment Variable Update

**File:** `.env`

```bash
# New - Pexels API
PEXELS_API_KEY="your-pexels-api-key-here"

# Deprecated - Unsplash API (can be removed)
# UNSPLASH_ACCESS_KEY="your-key"
```

### 5. Documentation Updates

**File:** `README.md`

Updated environment variables section to reference Pexels instead of Unsplash.

## API Comparison

### Unsplash API
- URL: `https://api.unsplash.com/search/photos`
- Auth: `Client-ID` header
- Rate Limit: 50 requests/hour (free tier)
- Image Quality: Excellent
- Fitness Content: Good

### Pexels API
- URL: `https://api.pexels.com/v1/search`
- Auth: API key in `Authorization` header
- Rate Limit: 200 requests/hour (free tier)
- Image Quality: Excellent
- Fitness Content: Better for gym/workout searches

## Key Differences in Implementation

### 1. **Authorization Header Format**

**Unsplash:**
```typescript
headers: {
  'Authorization': `Client-ID ${apiKey}`
}
```

**Pexels:**
```typescript
headers: {
  'Authorization': apiKey  // Direct API key
}
```

### 2. **Response Structure**

**Unsplash:**
```typescript
interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

image.urls.regular  // Access image URL
```

**Pexels:**
```typescript
interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

photo.src.large  // Access image URL
```

### 3. **Image URL Formats**

**Unsplash:**
```
https://images.unsplash.com/photo-[id]?auto=format&fit=crop&w=800&h=600
```

**Pexels:**
```
https://images.pexels.com/photos/[id]/pexels-photo-[id].jpeg?auto=compress&cs=tinysrgb&w=800
```

## Fallback Images

Both services have curated fallback images in case API calls fail:

### Pexels Fallbacks (Updated):
```typescript
const fallbackUrls = [
  "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  // ... more
];
```

## Migration Checklist

- [x] Create Pexels service (`pexelsImageService.ts`)
- [x] Update `workoutImageStorage.ts` to use Pexels
- [x] Create new `/api/images/pexels` endpoint
- [x] Update `.env` with `PEXELS_API_KEY`
- [x] Update `README.md` documentation
- [ ] Add Pexels API key to production environment
- [ ] Test image generation for all muscle groups
- [ ] Verify fallback images work correctly
- [ ] Monitor API usage and rate limits

## Getting Your Pexels API Key

1. Visit [Pexels API](https://www.pexels.com/api/)
2. Click "Get Started" and create a free account
3. Your API key will be displayed on the dashboard
4. Copy the key and add it to your `.env` file:
   ```
   PEXELS_API_KEY=your_api_key_here
   ```

## Testing the Migration

### Test Muscle Group Images:
```bash
curl "http://localhost:3000/api/images/pexels?muscleGroup=chest&count=5"
```

### Test in Application:
1. Create a new workout
2. Verify the workout gets a relevant Pexels image
3. Check that images are diverse and not repeating
4. Confirm fallback images work when API is unavailable

## Performance Considerations

### Caching
Both services implement image caching:
- Cache key format: `${muscleGroup}-${count}`
- Cache persists for the duration of the application
- Reduces API calls significantly

### Uniqueness Tracking
- Tracks last 50 used images
- Ensures no immediate repetition
- Resets history when reaching limit

### API Rate Limits

**Pexels Free Tier:**
- 200 requests/hour
- No monthly limit
- No attribution required

**Recommended:**
- Cache aggressively
- Pre-warm cache on application start
- Use fallback images when rate limit approached

## Backwards Compatibility

The old Unsplash service remains in the codebase but is no longer used. It can be safely removed after verifying Pexels works correctly in production.

**Files that can be removed (after testing):**
- `/app/utils/unsplashImageService.ts`
- `/app/api/images/unsplash/route.ts`

## Future Improvements

1. **Image Quality Options**: Add query parameters for different image sizes
2. **Custom Filters**: Allow filtering by photographer or color
3. **Local Caching**: Store frequently used images in database
4. **CDN Integration**: Serve images through CDN for faster loading
5. **Lazy Loading**: Only fetch images when needed
6. **A/B Testing**: Compare user engagement with different image sources

## Rollback Plan

If issues arise with Pexels:

1. Revert `workoutImageStorage.ts` to use `getUnsplashService()`
2. Update `.env` to prioritize `UNSPLASH_ACCESS_KEY`
3. Old Unsplash service still exists and will work immediately

## Support

For issues with Pexels API:
- Documentation: https://www.pexels.com/api/documentation/
- Support: support@pexels.com

---

**Migration Date:** October 15, 2025  
**Status:** ✅ Complete  
**Production Deployment:** Pending Pexels API key configuration
