# Workout Image Generation Fix

## Issue
When creating a new workout, the image was not being added and the following error occurred:

```
workoutImageStorage.ts:388 Failed to fetch dynamic image, using fallback: 
Error: UNSPLASH_ACCESS_KEY environment variable is not set
    at getUnsplashService (unsplashImageService.ts:406:13)
    at getImageForWorkout (workoutImageStorage.ts:381:47)
    at onSubmit (page.tsx:226:52)
```

## Root Cause

The issue was caused by trying to access `process.env.UNSPLASH_ACCESS_KEY` from a client-side component. 

### The Problem
1. `/app/workouts/new/page.tsx` is a **client component** (`"use client"`)
2. It was calling `getImageForWorkout()` directly, which uses `getUnsplashService()`
3. `getUnsplashService()` tries to read `process.env.UNSPLASH_ACCESS_KEY`
4. In Next.js, **server-side environment variables are not accessible in client components**
5. The API key was undefined, causing the error

### Why Not Use `NEXT_PUBLIC_` Prefix?
While Next.js allows exposing environment variables to the client by prefixing them with `NEXT_PUBLIC_`, this would be a **security risk** for API keys:
- The Unsplash API key would be visible in the browser
- Anyone could extract and misuse your API key
- It violates best practices for API key security

## Solution

Created a server-side API route to handle image fetching securely:

### 1. Created API Route: `/app/api/images/workout/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // Authenticate the user
  const { error } = await authenticateApiUser();
  
  if (error) {
    return error;
  }

  const body = await request.json();
  const { exercises, workoutName, category } = body;

  // Get the image URL using the server-side utility
  // This has access to process.env.UNSPLASH_ACCESS_KEY
  const imageUrl = await getImageForWorkout(
    exercises,
    workoutName,
    category
  );

  return NextResponse.json({ imageUrl });
}
```

**Benefits:**
- Runs on the server where environment variables are accessible
- Keeps API key secure and hidden from the client
- Includes authentication to prevent abuse
- Follows established authentication pattern

### 2. Updated Workout Creation: `/app/workouts/new/page.tsx`

**Before:**
```typescript
import { getImageForWorkout } from "../../utils/workoutImageStorage";

// Inside onSubmit:
const workoutImage = await getImageForWorkout(exerciseDetails, data.name, data.category);
```

**After:**
```typescript
// Removed direct import of getImageForWorkout

// Inside onSubmit:
let workoutImage = "";
try {
  const imageResponse = await fetch("/api/images/workout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      exercises: exerciseDetails,
      workoutName: data.name,
      category: data.category,
    }),
  });

  if (imageResponse.ok) {
    const imageData = await imageResponse.json();
    workoutImage = imageData.imageUrl;
  } else {
    console.error("Failed to fetch workout image from API");
    workoutImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48";
  }
} catch (imageError) {
  console.error("Error fetching workout image:", imageError);
  workoutImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48";
}
```

**Benefits:**
- Uses API route instead of direct function call
- Includes error handling with fallback image
- Maintains user experience even if image API fails
- Logs errors for debugging

## Files Modified

### Created
- `/app/api/images/workout/route.ts` - New API endpoint for fetching workout images

### Modified
- `/app/workouts/new/page.tsx`:
  - Removed import of `getImageForWorkout`
  - Changed image fetching to use API endpoint
  - Added error handling with fallback image

## Technical Details

### Client vs Server Components in Next.js

| Feature | Client Component | Server Component |
|---------|-----------------|------------------|
| Directive | `"use client"` | Default (no directive) |
| Environment Variables | Only `NEXT_PUBLIC_*` | All `process.env.*` |
| Runs | Browser | Server |
| API Keys | ❌ Should NOT be exposed | ✅ Can access securely |

### Security Best Practices
1. **Never expose API keys to the client** - Always keep them server-side
2. **Use API routes for sensitive operations** - Create server endpoints that have access to secrets
3. **Authenticate API routes** - Prevent unauthorized access to your endpoints
4. **Use fallback strategies** - Gracefully handle API failures

### Error Handling Strategy
The solution implements a three-tier approach:
1. **Primary**: Try to fetch image from Unsplash via API
2. **Secondary**: If API fails, use a default fallback image
3. **User Experience**: Continue with workout creation regardless of image result

## Environment Variables

The `.env` file should contain:
```properties
# Unsplash API (server-side only - not prefixed with NEXT_PUBLIC_)
UNSPLASH_ACCESS_KEY=your_unsplash_api_key_here
```

**Important:** Do NOT prefix with `NEXT_PUBLIC_` as this would expose it to the browser.

## Testing

### Test Successful Image Fetch
1. Navigate to `/workouts/new`
2. Fill in workout details (name, category)
3. Add at least 3 exercises
4. Click "Save Workout"
5. Verify the workout is created with a relevant image from Unsplash

### Test Fallback Behavior
1. Temporarily remove or invalidate the `UNSPLASH_ACCESS_KEY` in `.env`
2. Restart the dev server
3. Create a new workout
4. Verify it uses the fallback image instead of failing
5. Verify the workout is still created successfully

### Verify Security
1. Open browser DevTools → Network tab
2. Create a workout
3. Find the POST request to `/api/images/workout`
4. Verify the request/response does NOT contain the API key
5. Check that environment variables are NOT visible in the client bundle

## Related Files
- `/app/utils/workoutImageStorage.ts` - Contains `getImageForWorkout()` function
- `/app/utils/unsplashImageService.ts` - Unsplash API service with `getUnsplashService()`
- `/lib/auth/api-auth.ts` - Authentication utilities used in the new API route
- `/.env` - Contains `UNSPLASH_ACCESS_KEY`

## Benefits
1. **Security** ✅ - API key stays server-side and hidden from clients
2. **Reliability** ✅ - Includes fallback image if API fails
3. **User Experience** ✅ - Workouts still created even if image fetch fails
4. **Best Practices** ✅ - Follows Next.js patterns for handling secrets
5. **Maintainability** ✅ - Consistent with other API routes in the project
6. **Authentication** ✅ - Protected endpoint prevents abuse

## Future Improvements
Consider these enhancements:
1. **Image caching** - Cache fetched images to reduce API calls
2. **Image optimization** - Use Next.js Image component with proper optimization
3. **More fallback options** - Rotate through multiple fallback images
4. **Rate limiting** - Add rate limiting to prevent API abuse
5. **Image preview** - Show image preview before saving workout
