# Fix Navigation Positioning Issue

## Problem Analysis

The navigation layout uses `justify-between` with a `flex-1` center section, which may cause positioning issues:

**Current Structure:**
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Left: Previous + Counter + Next */}
  <div className="flex items-center gap-2">...</div>
  
  {/* Center: Stepper */}
  <div className="flex-1 flex justify-center">
    <ArticleFormStepper />
  </div>
  
  {/* Right: Save */}
  <Tooltip>...</Tooltip>
</div>
```

**Potential Issues:**
1. `justify-between` pushes left and right to edges
2. Center section with `flex-1` might not center properly
3. Stepper component has `w-full` which may conflict with flex-1
4. The combination of `justify-between` and `flex-1` may cause unexpected spacing

## Current Navigation Layout Issues

The layout structure might not be working correctly because:
- `justify-between` distributes space between items
- `flex-1` on center tries to take remaining space
- These two properties together might create positioning problems
- The stepper's `w-full` class might be expanding beyond expected

## Solution Options

### Option 1: Use Grid Layout (Recommended)
Replace flex with grid for better control:

```tsx
<div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
  {/* Left: Previous + Counter + Next */}
  <div className="flex items-center gap-2">...</div>
  
  {/* Center: Stepper */}
  <div className="flex justify-center">
    <ArticleFormStepper />
  </div>
  
  {/* Right: Save */}
  <div>...</div>
</div>
```

### Option 2: Fix Flex Layout
Keep flex but fix the structure:

```tsx
<div className="flex items-center gap-4">
  {/* Left: Previous + Counter + Next */}
  <div className="flex items-center gap-2 shrink-0">...</div>
  
  {/* Center: Stepper */}
  <div className="flex-1 flex justify-center min-w-0">
    <ArticleFormStepper />
  </div>
  
  {/* Right: Save */}
  <div className="shrink-0">...</div>
</div>
```

Remove `justify-between` and let flex-1 handle spacing.

### Option 3: Absolute Positioning for Stepper
Use absolute positioning for stepper in center:

```tsx
<div className="relative flex items-center justify-between gap-4">
  {/* Left: Previous + Counter + Next */}
  <div className="flex items-center gap-2">...</div>
  
  {/* Center: Stepper (absolute) */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <ArticleFormStepper />
  </div>
  
  {/* Right: Save */}
  <div>...</div>
</div>
```

## Recommended Solution: Option 1 (Grid Layout)

Grid layout provides the most reliable control:
- Left column: auto width (fits content)
- Center column: 1fr (takes remaining space, centers content)
- Right column: auto width (fits content)
- Clean and predictable

## Implementation

### File to Modify:
`admin/app/(dashboard)/articles/components/article-form-navigation.tsx` (line 25)

### Change:
```tsx
// Before:
<div className="flex items-center justify-between gap-4">

// After (Option 1 - Grid):
<div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
```

And update center section:
```tsx
// Before:
<div className="flex-1 flex justify-center">

// After:
<div className="flex justify-center">
```

## Alternative: Option 2 (Fixed Flex)

If grid doesn't work, use Option 2:

```tsx
// Remove justify-between, add shrink-0 to sides
<div className="flex items-center gap-4">
  <div className="flex items-center gap-2 shrink-0">...</div>
  <div className="flex-1 flex justify-center min-w-0">...</div>
  <div className="shrink-0">...</div>
</div>
```

## Expected Result

After fix:
- Left section (arrows + counter): Fixed width on left
- Center section (stepper): Centered, takes remaining space
- Right section (save): Fixed width on right
- Proper spacing and alignment
- Stepper centered in available space
