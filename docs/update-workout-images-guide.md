# Update Default Workouts with Pexels Images

## Overview

This guide explains how to update all default workouts in the database with fresh Pexels images.

## Available Scripts

### 1. Preview Images (Recommended First Step)

**Preview** what Pexels images will be used without changing the database:

```bash
npx tsx prisma/preview-workout-images.ts
```

**What it does:**
- ✅ Shows current vs new images for each workout
- ✅ Displays workout name, description, and exercises
- ✅ Indicates which images are from Pexels
- ✅ No database changes made
- ✅ Safe to run anytime

**Example Output:**
```
👀 Previewing Pexels images for workouts...

📊 Found 24 public workouts

======================================================================

1. 🏋️  Fat Burner HIIT
   📝 High-intensity interval training designed to maximize calorie burn
   💪 Exercises: Burpees, Mountain Climbers, Jump Squats, Push-ups
   🖼️  Current Image: https://images.unsplash.com/photo-157101...
   ✨ New Pexels:    https://images.pexels.com/photos/383775...
   🔄 Changed | Source: Pexels
```

### 2. Update All Workout Images

**Actually update** the database with new Pexels images:

```bash
npx tsx prisma/update-workout-images.ts
```

**What it does:**
- ✅ Fetches fresh Pexels images for each workout
- ✅ Updates database with new image URLs
- ✅ Shows before/after for each workout
- ✅ Includes progress counter
- ✅ Adds small delays to respect API rate limits

**Example Output:**
```
🖼️  Starting workout image update with Pexels...

📊 Found 24 public workouts to update

🔄 Updating: Fat Burner HIIT...
   ✅ Updated with new Pexels image
   🖼️  Old: https://images.unsplash.com/photo-1571019613454-1cb2...
   🖼️  New: https://images.pexels.com/photos/3837757/pexels-ph...

==================================================

✅ Update Complete!
   Success: 24 workouts
   Errors: 0 workouts
   Total: 24 workouts
```

### 3. Reseed Database (Full Reset)

If you want to **completely reseed** the database with fresh data:

```bash
npm run db:seed
```

**What it does:**
- ⚠️  Creates fresh default workouts from scratch
- ⚠️  Seeds exercise database
- ⚠️  Creates system user
- ✅ All workouts get fresh Pexels images automatically

**Warning:** This is more invasive and may affect other seeded data.

## Step-by-Step Guide

### Option 1: Quick Update (Recommended)

1. **Preview the changes:**
   ```bash
   npx tsx prisma/preview-workout-images.ts
   ```

2. **Review the output** - Check that:
   - Pexels images are being fetched successfully
   - Images look relevant to the workouts
   - No errors occurred

3. **Apply the updates:**
   ```bash
   npx tsx prisma/update-workout-images.ts
   ```

4. **Verify in app:**
   - Navigate to `/workouts` page
   - Check that workout cards show new images
   - Confirm images are high quality and relevant

### Option 2: Full Reseed

Use this if you want a complete fresh start:

```bash
npm run db:seed
```

**Note:** This will recreate all default workouts from scratch.

## What Gets Updated

### Workouts Updated:
- All **public workouts** (default/system workouts)
- Typically 24 workouts across 6 fitness goal categories:
  - Weight Loss (4 workouts)
  - Muscle Gain (4 workouts)
  - Endurance (4 workouts)
  - Flexibility (4 workouts)
  - General Fitness (4 workouts)
  - Strength (4 workouts)

### User Workouts:
- ❌ User-created workouts are **NOT updated**
- ✅ Only public/system workouts are changed
- Users keep their custom workout images

## Image Selection Logic

The `getImageForWorkout()` function uses Pexels to select images based on:

1. **Exercise muscle groups** - Primary factor
   - Analyzes all exercises in the workout
   - Identifies dominant muscle groups
   - Searches Pexels with muscle-specific terms

2. **Workout name** - Secondary factor
   - Keywords like "HIIT", "cardio", "strength"
   - Contextual search terms
   - e.g., "Chest Destroyer" → chest workout images

3. **Uniqueness tracking** - Prevents repeats
   - Tracks last 50 images used
   - Ensures variety across workouts
   - No immediate image duplication

## Troubleshooting

### Issue: API Rate Limit Reached

**Error:**
```
❌ Error updating workout: API rate limit exceeded
```

**Solution:**
- Wait a few minutes (Pexels allows 200 requests/hour)
- The script includes 500ms delays between requests
- If still hitting limits, increase delay in script

### Issue: No Pexels API Key

**Error:**
```
Error: PEXELS_API_KEY environment variable is not set
```

**Solution:**
```bash
# Add to .env file
PEXELS_API_KEY=your-pexels-api-key-here
```

### Issue: Images Not Appearing in App

**Check:**
1. Image URLs are valid (check browser console)
2. Next.js image domains configured in `next.config.js`:
   ```javascript
   images: {
     domains: ['images.pexels.com'],
   }
   ```
3. Clear browser cache and hard refresh (Cmd/Ctrl + Shift + R)

### Issue: All Images Are Fallbacks

**Error:**
```
🖼️  New: https://images.pexels.com/photos/1552242/... (fallback)
```

**This means:**
- Pexels API might be down
- API key might be invalid
- Network connectivity issues

**Solution:**
- Verify API key in `.env`
- Check Pexels API status: https://www.pexels.com/api/
- Test API manually: `curl "http://localhost:3000/api/images/pexels?muscleGroup=chest&count=1"`

## Next.js Configuration

Ensure `next.config.js` allows Pexels images:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },
};
```

## Script Files Location

```
prisma/
├── seed.ts                      # Main database seeding script
├── preview-workout-images.ts    # Preview new Pexels images (no changes)
└── update-workout-images.ts     # Update workouts with Pexels images
```

## Performance Notes

### API Calls
- Preview: ~24 API calls (one per workout)
- Update: ~24 API calls + database updates
- Duration: ~30-60 seconds (with rate limit delays)

### Database Impact
- Update: Modifies only `image` field in `Workout` table
- No impact on exercises, sessions, or user data
- Safe to run on production database

### Caching
- Pexels service includes built-in caching
- Same muscle group searches return cached results
- Cache persists for script duration

## Verification Checklist

After running updates:

- [ ] Preview script shows Pexels URLs (not Unsplash)
- [ ] Update script completed without errors
- [ ] `/workouts` page loads successfully
- [ ] Workout cards display new images
- [ ] Images are relevant to workout content
- [ ] No broken image links
- [ ] Images load quickly
- [ ] Mobile view displays images correctly

## Rollback

If you need to revert changes:

1. **If you have a database backup:**
   ```bash
   # Restore from backup
   ```

2. **If you want to go back to Unsplash:**
   - Revert `workoutImageStorage.ts` to use `getUnsplashService()`
   - Run update script again

3. **If you just want to reseed:**
   ```bash
   npm run db:seed
   ```

## Production Deployment

Before running in production:

1. ✅ Test in development first
2. ✅ Backup production database
3. ✅ Verify Pexels API key is in production env
4. ✅ Run preview script first to check output
5. ✅ Run update script during low-traffic period
6. ✅ Monitor for errors
7. ✅ Verify images in production UI

## Summary

**Quick Commands:**
```bash
# Preview changes (safe, no database updates)
npx tsx prisma/preview-workout-images.ts

# Apply updates (updates database)
npx tsx prisma/update-workout-images.ts

# Full reseed (nuclear option)
npm run db:seed
```

**Recommended Workflow:**
1. Preview → 2. Review → 3. Update → 4. Verify

---

**Need Help?**
- Check docs/pexels-migration.md for API details
- Verify .env has PEXELS_API_KEY
- Test API endpoint: `/api/images/pexels`
