# Restructure Article Navigation - Move Stepper Inside & Counter with Arrows

## Current Structure

**ArticleFormNavigation** (`admin/app/(dashboard)/articles/components/article-form-navigation.tsx`):
- Left: Previous/Next arrows
- Center: Counter (`currentStep/totalSteps`)
- Right: Save button

**ArticleFormStepper** (`admin/app/(dashboard)/articles/components/article-form-stepper.tsx`):
- Separate component below navigation
- Shows 6 steps with numbers, labels, and connectors
- Clickable to navigate to steps

**Article Page** (`admin/app/(dashboard)/articles/new/page.tsx`):
- ArticleFormNavigation
- ArticleFormStepper (separate, below navigation)

## Desired Structure

**ArticleFormNavigation** should contain:
- Left: Previous arrow + Counter + Next arrow (all together)
- Center: Stepper (moved inside navigation)
- Right: Save button

**Article Page**:
- Only ArticleFormNavigation (stepper removed from page)

## Implementation Plan

### Step 1: Modify ArticleFormNavigation Component

1. **Import ArticleFormStepper** in ArticleFormNavigation
2. **Restructure layout**:
   - Left section: Previous arrow, Counter, Next arrow (in one group)
   - Center section: ArticleFormStepper component
   - Right section: Save button
3. **Move counter** from center to left (between arrows)

### Step 2: Update Article Page

1. **Remove ArticleFormStepper import** (no longer needed)
2. **Remove stepper JSX** from page (line 34-36)
3. **Remove wrapper div** around stepper (just the stepper div)

## Files to Modify

1. **`admin/app/(dashboard)/articles/components/article-form-navigation.tsx`**
   - Import ArticleFormStepper
   - Restructure layout: Left (arrows + counter), Center (stepper), Right (save)
   - Move counter from center span to left section (between arrows)

2. **`admin/app/(dashboard)/articles/new/page.tsx`**
   - Remove ArticleFormStepper import
   - Remove stepper JSX and wrapper div

## Layout Structure

### Current Navigation Layout:
```tsx
<div className="flex items-center justify-between h-10">
  {/* Left: Previous/Next */}
  <div className="flex items-center gap-1">
    <PreviousButton />
    <NextButton />
  </div>
  
  {/* Center: Counter */}
  <span>{currentStep}/{totalSteps}</span>
  
  {/* Right: Save */}
  <SaveButton />
</div>
```

### New Navigation Layout:
```tsx
<div className="flex items-center justify-between">
  {/* Left: Previous + Counter + Next */}
  <div className="flex items-center gap-2">
    <PreviousButton />
    <span className="text-xs text-muted-foreground font-medium">
      {currentStep}/{totalSteps}
    </span>
    <NextButton />
  </div>
  
  {/* Center: Stepper */}
  <div className="flex-1 flex justify-center">
    <ArticleFormStepper />
  </div>
  
  {/* Right: Save */}
  <SaveButton />
</div>
```

## Implementation Details

### Changes to ArticleFormNavigation:

1. **Add import**:
```tsx
import { ArticleFormStepper } from './article-form-stepper';
```

2. **Update layout structure**:
   - Change flex layout to accommodate 3 sections
   - Move counter span to left section
   - Add stepper in center with flex-1 for spacing
   - Adjust height constraints if needed

3. **Counter position**:
   - Move from center span to left div
   - Place between Previous and Next buttons
   - Use gap-2 for spacing

4. **Stepper integration**:
   - Add in center section
   - Use flex-1 and justify-center for centering
   - May need to adjust stepper component width/styling

### Changes to Article Page:

1. **Remove import**:
```tsx
// Remove this line:
import { ArticleFormStepper } from '../components/article-form-stepper';
```

2. **Remove JSX**:
```tsx
// Remove this section:
<div className="mt-6 mb-8">
  <ArticleFormStepper />
</div>
```

## Expected Result

After changes:
- Navigation contains: Arrows+Counter (left), Stepper (center), Save (right)
- Counter is with arrows in left section
- Stepper is integrated inside navigation component
- Page only renders ArticleFormNavigation (stepper removed)
- All functionality preserved (navigation, stepping, saving)

## Considerations

1. **Layout spacing**: May need to adjust padding/margins for stepper in navigation
2. **Stepper width**: May need to constrain stepper width in center section
3. **Responsive design**: Ensure layout works on smaller screens
4. **Height constraints**: Navigation height may need adjustment to fit stepper
