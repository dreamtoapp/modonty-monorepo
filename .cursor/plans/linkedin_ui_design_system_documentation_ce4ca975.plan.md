---
name: LinkedIn UI Design System Documentation
overview: ''
todos: []
---

# LinkedIn UI Design System Documentation Plan

## Overview

Create a comprehensive design system guide that replicates LinkedIn's exact UI design patterns. This will be the single source of truth for all design decisions across the monorepo (admin, beta, home packages), ensuring 100% alignment with LinkedIn's professional, calm, editorial aesthetic.

## LinkedIn Design Specifications (Verified)

### Colors (Exact LinkedIn Values)

**Background & Surfaces:**

- Background: `#f3f2ef` (hsl(45, 8%, 95%)) - LinkedIn's exact warm gray background
- Card/White: `#ffffff` (hsl(0, 0%, 100%)) - Pure white for cards
- Border: `#e0e0de` (hsl(60, 3%, 88%)) - LinkedIn's subtle border color

**Primary Colors:**

- Primary Blue: `#0a66c2` (hsl(210, 90%, 40%)) - LinkedIn's exact brand blue
- Primary Hover: `#004182` - Darker blue on hover
- Primary Light: `#70b5f9` - Light blue for secondary actions

**Text Colors:**

- Primary Text: `#000000` (hsl(0, 0%, 0%)) - Black for main text
- Muted Text: `#666666` (hsl(0, 0%, 40%)) - LinkedIn's gray text
- Secondary Text: `#999999` - Lighter gray for less important text

**Status Colors:**

- Success: LinkedIn green (to be defined)
- Warning: LinkedIn yellow (to be defined)
- Error/Destructive: Standard red with WCAG compliance

### Typography (LinkedIn Patterns)

**Font Stack:**

- Primary: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`)
- Arabic: Tajawal (for RTL support)
- Font features: `rlig` (required ligatures), `calt` (contextual alternates)

**Type Scale:**

- H1: 2rem (32px) - Page titles
- H2: 1.5rem (24px) - Section headers
- H3: 1.25rem (20px) - Subsection headers
- H4: 1.125rem (18px) - Card titles
- Body: 1rem (16px) - Default text
- Small: 0.875rem (14px) - Secondary text
- Caption: 0.75rem (12px) - Metadata, timestamps

**Line Heights:**

- Headings: 1.2-1.3 (tight)
- Body: 1.5-1.6 (comfortable reading)
- Small text: 1.4

**Font Weights:**

- Regular: 400
- Medium: 500 (for emphasis)
- Semibold: 600 (for headings)
- Bold: 700 (for strong emphasis)

### Spacing (LinkedIn Patterns)

**LinkedIn uses consistent 8px grid:**

- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)

**Card Spacing:**

- Card padding: 16px (1rem)
- Card gap: 12px (0.75rem)
- Card border radius: 8px (0.5rem) - LinkedIn's subtle rounded corners

### Border Radius

- Small: 4px (0.25rem) - Buttons, small elements
- Default: 8px (0.5rem) - Cards, containers
- Large: 12px (0.75rem) - Large cards, modals

### Shadows (LinkedIn Subtle Shadows)

- Card shadow: `0 1px 2px rgba(0, 0, 0, 0.05)` - Very subtle
- Hover shadow: `0 2px 4px rgba(0, 0, 0, 0.1)` - Slightly more on hover
- Modal shadow: `0 4px 12px rgba(0, 0, 0, 0.15)` - For overlays

## Documentation Structure

### 1. Design Foundations

**Colors**

- Complete HSL color system with LinkedIn exact values
- Semantic color tokens mapping
- Dark mode color values (LinkedIn-inspired)
- Color usage guidelines with examples
- WCAG contrast ratios for all color combinations

**Typography**

- Complete type scale with LinkedIn patterns
- Font stack configuration
- RTL typography considerations (Arabic support)
- SEO-friendly heading hierarchy
- Text truncation patterns (line-clamp utilities)

**Spacing**

- 8px grid system (LinkedIn standard)
- Tailwind spacing scale mapping
- Component-specific spacing patterns
- Responsive spacing adjustments

**Border Radius**

- LinkedIn's subtle rounded corners
- Component-specific radius values
- Consistent radius scale

### 2. Component System (shadcn/ui + LinkedIn Patterns)

**Card Component (LinkedIn Style)**

- White background on warm gray
- Subtle border
- 8px border radius
- 16px padding
- Hover shadow effect
- Usage examples

**Button Component**

- Primary: LinkedIn blue (#0a66c2)
- Secondary: Light gray
- Ghost: Transparent with hover
- Sizes: sm, md, lg
- Icon placement patterns

**Input Components**

- LinkedIn-style form inputs
- Border color: #e0e0de
- Focus ring: Primary blue
- Error states

**Navigation**

- Top navigation bar (LinkedIn header style)
- Sticky positioning
- Icon + text patterns
- Active states

### 3. Layout Patterns (LinkedIn-Inspired)

**Card Grid Layout**

- Responsive grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Card gap: 12px
- Max-width container: 1128px (LinkedIn's feed width)
- Card hover effects

**Feed Layout**

- Vertical card stack
- Consistent spacing between cards
- Card content structure (image, title, excerpt, metadata)

**Container Patterns**

- Max-width: 1128px (LinkedIn standard)
- Padding: 16px mobile, 24px desktop
- Centered layout

### 4. Responsive Design

**Breakpoints (Tailwind Standard)**

- sm: 640px - Mobile landscape
- md: 768px - Tablet
- lg: 1024px - Desktop
- xl: 1280px - Large desktop
- 2xl: 1536px - Extra large

**Mobile-First Approach**

- Base styles for mobile
- Progressive enhancement for larger screens
- LinkedIn's responsive patterns

### 5. Icons (Lucide React)

**Icon Sizes**

- xs: 12px (0.75rem)
- sm: 16px (1rem)
- md: 20px (1.25rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)

**Icon Usage**

- Consistent sizing within components
- Proper spacing from text
- RTL icon mirroring (for directional icons)

### 6. Dark Mode (LinkedIn-Inspired)

**Dark Mode Colors**

- Background: Dark blue-gray
- Cards: Slightly lighter dark
- Text: Light gray/white
- Borders: Subtle dark borders
- Primary: Lighter blue for visibility

### 7. RTL Support (Arabic)

**RTL Patterns**

- Direction: `dir="rtl"` for Arabic
- Spacing: Logical properties (margin-inline, padding-inline)
- Icons: Mirror directional icons
- Text alignment: Right for Arabic, left for English

### 8. Accessibility (WCAG 2.1 AA)

**Color Contrast**

- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

**Keyboard Navigation**

- All interactive elements keyboard accessible
- Focus indicators: Pri
