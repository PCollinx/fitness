# Default Playlists Feature

## Overview
The Default Playlists feature allows admins to curate Spotify playlists that all users can access, providing a consistent music experience for workouts without requiring every user to connect their own Spotify account.

## Implementation Summary

### 1. Database Schema ✅
- **Model**: `DefaultPlaylist`
- **Fields**:
  - `id`: String (Primary key)
  - `name`: String (Playlist name)
  - `description`: String (Optional description)
  - `spotifyPlaylistId`: String (Unique Spotify playlist ID)
  - `spotifyPlaylistUrl`: String (Direct Spotify link)
  - `category`: Enum ["workout", "general"]
  - `imageUrl`: String (Optional playlist cover image)
  - `isActive`: Boolean (Whether playlist is visible to users)
  - `createdById`: String (Admin who added it)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### 2. Admin API ✅
**Endpoint**: `/api/admin/default-playlists`

**Methods**:
- **GET**: List all default playlists with optional filtering
  - Query params: `category`, `isActive`
  - Returns: Array of playlists with creator info
  
- **POST**: Create new default playlist
  - Required: `name`, `spotifyPlaylistId`, `category`
  - Optional: `description`, `spotifyPlaylistUrl`, `imageUrl`, `isActive`
  - Validates: Unique Spotify ID, valid category
  
- **PUT**: Update existing playlist
  - Required: `id`
  - Optional: All other fields
  
- **DELETE**: Remove playlist
  - Query param: `id`

**Authentication**: Admin only (uses `requireAdmin()`)

### 3. Public API ✅
**Endpoint**: `/api/default-playlists`

**Method**:
- **GET**: Fetch active default playlists
  - Query param: `category` (optional)
  - Returns: Only active playlists (no creator info)
  
**Authentication**: Any authenticated user

### 4. Admin UI ✅
**Location**: `/app/admin/playlists/page.tsx`

**Features**:
- **Two Tabs**:
  1. **Default Playlists**: View/manage existing defaults
     - Toggle active/inactive status
     - Delete playlists
     - Open in Spotify
  
  2. **Add from Spotify**: Browse admin's Spotify playlists
     - View all playlists from connected Spotify account
     - Select and configure as default
     - Set category (workout/general)
     - Add custom description
     - Prevents duplicates

**Workflow**:
1. Admin connects Spotify account (if not already)
2. Browse "Add from Spotify" tab
3. Click "Set as Default" on desired playlist
4. Configure category and description
5. Save - playlist becomes available to all users

### 5. User-Facing UI ✅
**Location**: `app/components/SpotifyMusic.tsx`

**Updates**:
- Added "Curated" tab (first tab, default view)
- Shows all active default playlists
- Special styling:
  - Yellow badge indicator "Curated"
  - Yellow accent border on hover
  - Info banner explaining curation
  - Fallback gradient for playlists without images
- Click to open directly in Spotify (no connection required)

**Tab Order**:
1. **Curated** 🌟 - Admin-curated playlists (NEW)
2. **My Playlists** 👤 - User's own Spotify playlists
3. **Workout** 💪 - Spotify's workout playlists

## User Experience Flow

### For Admins:
1. Navigate to `/admin/playlists`
2. Connect Spotify (one-time)
3. Browse personal playlists
4. Select playlists to share with users
5. Configure and save as defaults
6. Toggle active/inactive as needed

### For Regular Users:
1. Navigate to Music page (`/music`)
2. See "Curated" tab by default
3. Browse admin-selected playlists
4. Click any playlist to open in Spotify
5. No Spotify connection required to view defaults

## Benefits

### For Users:
✅ Instant access to quality playlists without setup
✅ Curated content from fitness experts
✅ Consistent experience across all users
✅ No need to search for workout music
✅ Can still use personal playlists if connected

### For Admins:
✅ Control over music experience
✅ Easy playlist management
✅ Can update/rotate playlists anytime
✅ Track what's available to users
✅ Maintain brand consistency

## Technical Notes

### Type Assertions
- Used `(prisma as any).defaultPlaylist` due to Prisma client type recognition delay
- This is a common pattern when adding new models
- Alternative: Restart TypeScript server or rebuild

### Security
- Admin endpoints require `requireAdmin()` middleware
- Public endpoint only returns active playlists
- No sensitive creator information exposed to regular users
- Validates categories and prevents duplicate Spotify IDs

### Performance
- Default playlists cached client-side
- Only fetches when tab is active
- Minimal database queries with selective field returns
- Image lazy loading with Next.js Image component

## Future Enhancements

### Possible Additions:
- [ ] Playlist categories beyond workout/general
- [ ] Featured/promoted playlist rotation
- [ ] Playlist usage analytics
- [ ] User feedback on playlists
- [ ] Auto-sync playlist track counts
- [ ] Playlist scheduling (show different playlists by time/day)
- [ ] Multiple playlist images in carousel
- [ ] Playlist preview/sampling in UI

## Files Modified/Created

### Created:
- `prisma/migrations/[timestamp]_add_default_playlist_model/migration.sql`
- `app/api/admin/default-playlists/route.ts`
- `app/api/default-playlists/route.ts`
- `app/admin/playlists/page.tsx`
- `docs/default-playlists-feature.md`

### Modified:
- `prisma/schema.prisma`
- `app/components/SpotifyMusic.tsx`

## Testing Checklist

- [ ] Admin can access `/admin/playlists`
- [ ] Admin can connect Spotify
- [ ] Admin can view their playlists
- [ ] Admin can save playlist as default
- [ ] Admin can toggle playlist active/inactive
- [ ] Admin can delete default playlist
- [ ] Users can see curated playlists
- [ ] Users can open playlists in Spotify
- [ ] Default playlists show before personal playlists
- [ ] Curated badge displays correctly
- [ ] Empty states display when no playlists exist
- [ ] Duplicate prevention works
- [ ] Category filtering works
- [ ] Mobile responsive design

## Deployment Notes

1. Run Prisma migration on production:
   ```bash
   npx prisma migrate deploy
   ```

2. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Verify admin role is set for designated users

4. Have admin add first few default playlists

5. Monitor API performance and adjust as needed
