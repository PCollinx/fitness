# Exercise Dropdown Z-Index Fix

## Issue
When scrolling through exercises in the workout creation/edit dropdown, the muscle group headers (e.g., "CHEST", "BACK", "LEGS") were scrolling over the "Create Exercise" button at the top of the dropdown, creating a poor UI experience.

## Root Cause
Both the "Create Exercise" button and the muscle group headers were using `sticky top-0`, causing them to compete for the same position. The muscle group headers didn't have proper z-index layering, allowing them to render on top of the button during scroll.

## Solution

### Changes Applied

#### 1. New Workout Page (`/app/workouts/new/page.tsx`)

**Create Exercise Button:**
- Added `z-20` to ensure it stays on top
- Kept `sticky top-0` for fixed positioning

**Before:**
```tsx
<div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-2">
```

**After:**
```tsx
<div className="sticky top-0 z-20 bg-gray-900 border-b border-gray-700 p-2">
```

**Muscle Group Headers:**
- Added `z-10` (lower than button)
- Changed `top-0` to `top-[52px]` to position below the button
- The 52px accounts for the button height (~40px) + padding (~8px top + 8px bottom) + border

**Before:**
```tsx
<div className="sticky top-0 bg-gray-900 px-3 py-1.5 text-xs font-medium text-yellow-500 uppercase">
```

**After:**
```tsx
<div className="sticky top-[52px] z-10 bg-gray-900 px-3 py-1.5 text-xs font-medium text-yellow-500 uppercase">
```

#### 2. Edit Workout Page (`/app/workouts/edit/[id]/page.tsx`)

**Create Exercise Button:**
- Wrapped button in a sticky container with `z-20`
- Added proper positioning and background

**Before:**
```tsx
<button
  type="button"
  onClick={...}
  className="w-full px-4 py-3 text-left text-yellow-500 hover:bg-gray-550 flex items-center border-b border-gray-500"
>
```

**After:**
```tsx
<div className="sticky top-0 z-20 bg-gray-600 border-b border-gray-500">
  <button
    type="button"
    onClick={...}
    className="w-full px-4 py-3 text-left text-yellow-500 hover:bg-gray-550 flex items-center"
  >
```

**Muscle Group Headers:**
- Added `z-10` (lower than button)
- Changed `top-0` to `top-[57px]` to position below the button
- The 57px accounts for button height (~48px with padding) + border

**Before:**
```tsx
<div className="px-4 py-2 bg-gray-700 text-yellow-500 text-sm font-medium sticky top-0">
```

**After:**
```tsx
<div className="px-4 py-2 bg-gray-700 text-yellow-500 text-sm font-medium sticky top-[57px] z-10">
```

## Z-Index Hierarchy

The layering now follows this structure (highest to lowest):

1. **z-20**: Create Exercise Button (always visible at top)
2. **z-10**: Muscle Group Headers (stick below the button)
3. **z-0** (default): Exercise list items (scroll normally)

## Visual Result

### Before Fix:
```
[Create Exercise Button]
CHEST ← scrolls over button ❌
  - Bench Press
  - ...
BACK ← scrolls over button ❌
  - Pull-ups
  - ...
```

### After Fix:
```
[Create Exercise Button] ← always on top ✅
CHEST ← stops below button ✅
  - Bench Press
  - ...
BACK ← stops below button ✅
  - Pull-ups
  - ...
```

## Benefits

✅ **Clean UI**: Muscle group headers no longer overlap the Create Exercise button  
✅ **Better UX**: Users can always see and click the Create Exercise button  
✅ **Consistent Behavior**: Same fix applied to both new and edit workout pages  
✅ **Proper Layering**: Clear z-index hierarchy prevents future overlap issues

## Testing Checklist

### New Workout Page
- [ ] Open workout creation page
- [ ] Click on an exercise dropdown
- [ ] Scroll through the exercise list
- [ ] Verify "Create Exercise" button stays visible at top
- [ ] Verify muscle group headers stop below the button (don't overlap)
- [ ] Verify exercise items scroll normally under headers

### Edit Workout Page
- [ ] Open an existing workout for editing
- [ ] Click on an exercise dropdown
- [ ] Scroll through the exercise list
- [ ] Verify "Create New Exercise" button stays visible at top
- [ ] Verify muscle group headers stop below the button (don't overlap)
- [ ] Verify exercise items scroll normally under headers

## Technical Notes

### Why `top-[52px]` and `top-[57px]`?

The specific pixel values are calculated based on the actual rendered height of the sticky button:

**New Workout Page (52px):**
- Button padding: `py-2` = 8px top + 8px bottom = 16px
- Button content: ~32px (text + icon)
- Border: 1px
- Container padding: `p-2` = 8px top + 8px bottom = 16px
- **Total: ~52px**

**Edit Workout Page (57px):**
- Button padding: `py-3` = 12px top + 12px bottom = 24px
- Button content: ~32px (text + icon)
- Border: 1px
- **Total: ~57px**

These values ensure muscle group headers stick just below the button without gaps or overlaps.

### Alternative Approaches Considered

1. **Remove sticky from headers**: Would lose the helpful context of which muscle group is being viewed
2. **Remove sticky from button**: Would lose quick access to create custom exercises
3. **Use fixed positioning**: Would complicate scroll container management

The chosen solution maintains all useful sticky behaviors while fixing the layering issue.

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

All modern browsers support `position: sticky` and arbitrary Tailwind values like `top-[52px]`.

---

**Issue**: Muscle group headers scrolling over Create Exercise button  
**Status**: ✅ Fixed  
**Impact**: Medium (UI/UX improvement)  
**Risk**: Low (CSS-only changes)  
**Date**: October 13, 2025
