---
name: SEO Meta Tags and JSON-LD Generator for Clients
overview: Add an intelligent SEO generator that creates meta robots tags and JSON-LD structured data for clients based on official best practices. The generator will analyze existing client data and create optimized SEO metadata, then store it in the database and update the UI.
todos:
  - id: '1'
    content: Add metaTags Json field to Client schema in Prisma
    status: completed
  - id: '2'
    content: Create generate-client-seo.ts server action with complete meta tags object and JSON-LD generation
    status: completed
  - id: '3'
    content: Update update-client.ts to support metaRobots, metaTags, and jsonLdStructuredData fields
    status: completed
  - id: '4'
    content: Update get-client-by-id.ts to include metaTags field
    status: completed
  - id: '5'
    content: Add Generate SEO Data button to SEO tab component with loading states and display meta tags
    status: completed
  - id: '6'
    content: Export generateClientSEO from actions index
    status: completed
  - id: '7'
    content: Create comprehensive JSON-LD generator with @graph structure including Organization, WebSite, and WebPage nodes
    status: completed
  - id: '8'
    content: Update or enhance existing generateOrganizationStructuredData function to use comprehensive approach
    status: completed
---

# SEO Meta Tags and JSON-LD Generator for Clients

## Overview

Add an intelligent SEO generator that automatically creates a COMPLETE meta tags object and JSON-LD structured data for clients following official best practices. The generator will analyze existing client data and create a comprehensive, 100% complete meta tags object covering all SEO requirements including standard meta tags, Open Graph, Twitter Cards, and more.

## Implementation Plan

### 1. Add Meta Tags Storage Field to Schema

**File**: `dataLayer/prisma/schema/schema.prisma`

- Add `metaTags` field to Client model:
  - Type: `Json?` (store complete meta tags object)
  - Store comprehensive meta tags object as JSON

### 2. Create SEO Generation Server Action

**File**: `admin/app/(dashboard)/clients/actions/clients-actions/generate-client-seo.ts`

- Generate **Complete Meta Tags Object**:

**Standard SEO Meta Tags:**

- `title`: Use `seoTitle` or `name` (50-60 chars)
- `description`: Use `seoDescription` or `description` (150-160 chars)
- `robots`: `"index, follow"` (default for public pages)
- `author`: Organization name
- `language`: Detect from content or default to "ar"
- `charset`: "UTF-8"
- `viewport`: "width=device-width, initial-scale=1.0"

**Complete Open Graph Tags (All Properties):**

- Required: `og:title`, `og:type` ("website"), `og:url`, `og:image`
- Recommended: `og:description`, `og:site_name`, `og:locale`
- Image Properties: `og:image:url`, `og:image:secure_url`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`
- Additional: `og:locale:alternate` (if multiple languages)

**Complete Twitter Card Tags (All Properties):**

- Required: `twitter:card` ("summary_large_image" or "summary")
- Required for summary: `twitter:title`
- Recommended: `twitter:description`, `twitter:image`, `twitter:site`, `twitter:creator`
- Image: `twitter:image:alt`
- Use client's `twitterCard`, `twitterTitle`, `twitterDescription`, `twitterSite` if available

**Additional Meta Tags:**

- `canonical`: Use `canonicalUrl` or generate from slug
- `theme-color`: Default theme color
- `format-detection`: For telephone/email/address

- Generate **Complete JSON-LD Structured Data** (100% Comprehensive):

**Use @graph structure for comprehensive knowledge graph:**

        - Organization node (complete with ALL properties)
        - WebSite node (if applicable)
        - WebPage node (for client page)

**Organization Schema - ALL Properties (Based on Official Schema.org & Google Requirements):**

**Core Required/Highly Recommended:**

        - `@context`: "https://schema.org"
        - `@type`: "Organization" (or subtype if applicable)
        - `@id`: Unique identifier URL
        - `name`: Organization name
        - `url`: Website URL (absolute)
        - `logo`: ImageObject with url, width, height (min 112x112px per Google)

**Identity & Naming:**

        - `legalName`: If different from name
        - `alternateName`: Abbreviations, aliases
        - `description`: Full description
        - `slogan`: Tagline/motto if available

**Contact Information (Complete):**

        - `telephone`: Primary phone
        - `email`: Primary email
        - `contactPoint`: Array of ContactPoint objects with:
                - `@type`: "ContactPoint"
                - `contactType`: "customer service", "sales", "technical support", etc.
                - `telephone`: Phone number
                - `email`: Email address
                - `areaServed`: Country/region
                - `availableLanguage`: Array of languages
                - `contactOption`: "TollFree", "HearingImpairedSupported", etc.

**Address (Complete PostalAddress):**

        - `address`: PostalAddress object with:
                - `@type`: "PostalAddress"
                - `streetAddress`: Street address
                - `addressLocality`: City
                - `addressRegion`: State/Province
                - `postalCode`: ZIP/Postal code
                - `addressCountry`: ISO country code
                - `postOfficeBoxNumber`: PO Box if applicable
        - `legalAddress`: Separate legal address if different
        - `location`: Place with GeoCoordinates if available

**Social & External Links:**

        - `sameAs`: Array of social profile URLs (LinkedIn, Twitter, Facebook, Instagram, etc.)
        - `mainEntityOfPage`: URL to main page about organization

**Business Information:**

        - `foundingDate`: ISO-8601 date (YYYY-MM-DD)
        - `founder`: Array of Person objects if available
        - `numberOfEmployees`: QuantitativeValue with value/range
        - `naics`: Industry classification code
        - `taxID`: Tax identification number
        - `vatID`: VAT identification
        - `leiCode`: Legal Entity Identifier (ISO 17442)
        - `iso6523Code`: ISO 6523 organization identifier
        - `globalLocationNumber`: GS1 GLN if available

**Additional Properties (If Available):**

        - `keywords`: Array of relevant keywords
        - `knowsAbout`: Topics organization knows about
        - `knowsLanguage`: Languages used
        - `image`: Additional images (not just logo)
        - `aggregateRating`: Overall rating if available
        - `review`: Reviews if available
        - `makesOffer`: Services/products offered
        - `parentOrganization`: If part of larger org
        - `subOrganization`: Subsidiaries/branches
        - `memberOf`: Memberships
        - `hasCertification`: Certifications held
        - `award`: Awards won

**WebSite Node (If Applicable):**

        - `@type`: "WebSite"
        - `@id`: Website identifier
        - `url`: Site URL
        - `name`: Site name
        - `publisher`: Reference to Organization
        - `potentialAction`: SearchAction for site search

**WebPage Node (For Client Page):**

        - `@type`: "WebPage"
        - `@id`: Page URL
        - `url`: Page URL
        - `name`: Page title
        - `description`: Page description
        - `isPartOf`: Reference to WebSite
        - `about`: Reference to Organization
        - `inLanguage`: Language code
        - `datePublished`: Publication date
        - `dateModified`: Last modified date

**Format Requirements:**

        - Use absolute URLs throughout (from `NEXT_PUBLIC_SITE_URL`)
        - Dates in ISO-8601 format (YYYY-MM-DD for dates, full ISO for datetimes)
        - Logo as ImageObject with width/height
        - ContactPoint as array (can have multiple)
        - Address as PostalAddress object
        - Use @graph structure for multiple related entities
        - Format as JSON-LD string for storage
        - Set `jsonLdLastGenerated` timestamp

- Update client record with:
  - `metaRobots`: `"index, follow"`
  - `metaTags`: Complete meta tags object as JSON
  - `jsonLdStructuredData`: Generated JSON-LD string
  - `jsonLdLastGenerated`: Current timestamp

### 3. Update Client Update Action

**File**: `admin/app/(dashboard)/clients/actions/clients-actions/update-client.ts`

- Add support for updating `metaRobots`, `metaTags`, and `jsonLdStructuredData` fields
- Ensure these fields are included in the update data

### 4. Update SEO Tab Component

**File**: `admin/app/(dashboard)/clients/[id]/components/tabs/seo-tab.tsx`

- Add "Generate SEO Data" button in Meta Tags section (when missing)
- Add "Generate JSON-LD" button in JSON-LD section (when missing)
- Or combine into single "Generate SEO Data" button that generates both
- Show loading state during generation
- Use `useRouter` to refresh page after successful generation
- Display success/error toasts
- **Display Complete Meta Tags Object**:
  - Show formatted JSON view of generated meta tags
  - Display in expandable/collapsible section
  - Show breakdown by category (Standard, Open Graph, Twitter, Additional)
  - Allow copying full meta tags object

### 5. Export New Action

**File**: `admin/app/(dashboard)/clients/actions/clients-actions/index.ts`

- Export `generateClientSEO` function

### 6. Create Comprehensive JSON-LD Generator

**File**: `admin/lib/seo/generate-complete-organization-jsonld.ts` (NEW)

- Create new comprehensive generator function
- Generate complete @graph structure with:
  - Organization node (all available properties)
  - WebSite node (if applicable)
  - WebPage node (for client page)
- Include ALL possible properties from client data:
  - All contact information (multiple contactPoints)
  - Complete address structure
  - All social profiles (sameAs)
  - Business identifiers (taxID, vatID, etc.)
  - Founder information if available
  - Certifications, awards, etc.
- Follow schema.org Organization specification exactly
- Follow Google's Organization markup requirements
- Use absolute URLs throughout
- Proper ISO-8601 date formatting
- ImageObject structure for logo with dimensions
- ContactPoint array structure
- Complete PostalAddress structure

**File**: `admin/lib/seo/structured-data.ts` (UPDATE)

- Update or enhance existing `generateOrganizationStructuredData` function
- Or create new comprehensive version
- Ensure compatibility with existing code

## Data Flow

```
User clicks "Generate SEO Data"
  → Server Action: generateClientSEO(clientId)
    → Fetch full client data with relations (logoMedia, ogImageMedia, twitterImageMedia)
    → Generate complete meta tags object:
      - Standard SEO tags (title, description, robots, author, etc.)
      - Complete Open Graph tags (all properties with image dimensions)
      - Complete Twitter Card tags (all properties)
      - Additional meta tags (canonical, theme-color, etc.)
    → Generate metaRobots: "index, follow"
    → Generate comprehensive JSON-LD using @graph structure:
      - Organization node (all available properties)
      - WebSite node (if applicable)
      - WebPage node (for client page)
      - Include ALL schema.org Organization properties from client data
    → Update client record in database:
      - metaRobots
      - metaTags (complete object as JSON)
      - jsonLdStructuredData
      - jsonLdLastGenerated
    → Revalidate client page
  → UI updates via router.refresh()
  → Success toast notification
  → Display generated meta tags in SEO tab
```

## Best Practices Implementation

### Complete Meta Tags Object Structure

```typescript
{
  // Standard SEO
  title: string,              // 50-60 chars, from seoTitle or name
  description: string,        // 150-160 chars, from seoDescription or description
  robots: "index, follow",   // Default for public pages
  author: string,             // Organization name
  language: string,           // "ar" or detected
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1.0",

  // Open Graph (Complete)
  openGraph: {
    title: string,
    description: string,
    type: "website",
    url: string,              // Absolute URL
    siteName: string,
    locale: string,           // "ar_SA" or detected
    images: [{
      url: string,           // Absolute URL
      secure_url: string,    // HTTPS version
      type: string,          // MIME type
      width: number,         // From ogImageMedia
      height: number,       // From ogImageMedia
      alt: string           // From ogImageMedia.altText
    }]
  },

  // Twitter Cards (Complete)
  twitter: {
    card: "summary_large_image" | "summary",
    title: string,
    description: string,
    image: string,           // Absolute URL
    imageAlt: string,
    site: string,           // @username
    creator: string         // @username if available
  },

  // Additional
  canonical: string,         // Absolute URL
  themeColor: string,
  formatDetection: {
    telephone: boolean,
    email: boolean,
    address: boolean
  }
}
```

### Meta Robots

- **Default Value**: `"index, follow"` (standard for public organization pages)
- **Rationale**: Organization pages should be indexed and allow link following

### Open Graph Best Practices

- **Required**: `og:title`, `og:type`, `og:url`, `og:image`
- **Image Requirements**:
  - Minimum 1200x630px for large images
  - Include all image properties: url, secure_url, type, width, height, alt
  - Use absolute HTTPS URLs
- **Type**: Use "website" for organization pages
- **Locale**: Format as "language_TERRITORY" (e.g., "ar_SA", "en_US")

### Twitter Cards Best Practices

- **Card Type**: Use "summary_large_image" if image available, else "summary"
- **Image Requirements**:
  - Summary: 144x144px minimum
  - Large Image: 1200x600px recommended
  - Include alt text for accessibility
- **Fallback**: Twitter falls back to OG tags if Twitter-specific tags missing

### JSON-LD Organization Schema (100% Complete)

**Structure**: Use `@graph` format for comprehensive knowledge graph

**Organization Node - Complete Properties:**

**Core (Required/Highly Recommended):**

- `@context`: "https://schema.org"
- `@type`: "Organization" (or specific subtype)
- `@id`: Unique identifier URL
- `name`: Organization name
- `url`: Website URL (absolute)
- `logo`: ImageObject (min 112x112px, with width/height)

**Identity:**

- `legalName`, `alternateName`, `description`, `slogan`

**Contact (Complete):**

- `telephone`: Primary phone
- `email`: Primary email
- `contactPoint`: Array of ContactPoint objects (multiple types: customer service, sales, support)
- Each ContactPoint: `contactType`, `telephone`, `email`, `areaServed`, `availableLanguage`, `contactOption`

**Location:**

- `address`: Complete PostalAddress (streetAddress, addressLocality, addressRegion, postalCode, addressCountry)
- `legalAddress`: Separate legal address if different
- `location`: Place with GeoCoordinates if available

**Business Info:**

- `foundingDate`: ISO-8601 date
- `founder`: Array of Person objects
- `numberOfEmployees`: QuantitativeValue
- `naics`, `taxID`, `vatID`, `leiCode`, `iso6523Code`, `globalLocationNumber`

**Social & External:**

- `sameAs`: Array of all social profile URLs
- `mainEntityOfPage`: URL to main page

**Additional (If Available):**

- `keywords`, `knowsAbout`, `knowsLanguage`
- `image`: Additional images
- `aggregateRating`, `review`
- `makesOffer`: Services/products
- `parentOrganization`, `subOrganization`
- `memberOf`, `hasCertification`, `award`

**WebSite Node (Optional but Recommended):**

- Links to Organization as publisher
- Includes SearchAction for site search

**WebPage Node (For Client Page):**

- Links to WebSite and Organization
- Includes page metadata

**Format Requirements:**

- Absolute URLs using `NEXT_PUBLIC_SITE_URL`
- ISO-8601 date format (YYYY-MM-DD for dates)
- Logo as ImageObject with width/height (min 112x112px)
- ContactPoint as array (supports multiple contact types)
- Address as complete PostalAddress object
- Use @graph for multiple related entities

## Files to Modify

1. `dataLayer/prisma/schema/schema.prisma` (UPDATE - Add metaTags Json field)
2. `admin/app/(dashboard)/clients/actions/clients-actions/generate-client-seo.ts` (NEW)
3. `admin/app/(dashboard)/clients/actions/clients-actions/update-client.ts` (UPDATE)
4. `admin/app/(dashboard)/clients/actions/clients-actions/index.ts` (UPDATE)
5. `admin/app/(dashboard)/clients/[id]/components/tabs/seo-tab.tsx` (UPDATE - Display meta tags object)
6. `admin/lib/seo/generate-complete-organization-jsonld.ts` (NEW - Comprehensive JSON-LD generator)
7. `admin/lib/seo/structured-data.ts` (UPDATE - Enhance or integrate comprehensive generator)
8. `admin/app/(dashboard)/clients/actions/clients-actions/get-client-by-id.ts` (UPDATE - Include metaTags)
9. `admin/app/(dashboard)/clients/[id]/components/client-tabs.tsx` (UPDATE - Add metaTags to interface)

## Complete JSON-LD Organization Example

Based on official Schema.org and Google requirements, the generated JSON-LD will use @graph structure:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://modonty.com/clients/client-slug#organization",
      "name": "Client Name",
      "legalName": "Client Legal Name Inc.",
      "alternateName": "Client Short Name",
      "url": "https://modonty.com/clients/client-slug",
      "description": "Full organization description...",
      "slogan": "Company tagline",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/.../logo.jpg",
        "width": 600,
        "height": 60
      },
      "image": "https://res.cloudinary.com/.../hero-image.jpg",
      "foundingDate": "2010-05-20",
      "founder": [
        {
          "@type": "Person",
          "name": "Founder Name"
        }
      ],
      "telephone": "+1-555-123-4567",
      "email": "info@client.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": "+1-800-555-1000",
          "email": "support@client.com",
          "areaServed": "US",
          "availableLanguage": ["English", "Arabic"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "telephone": "+1-800-555-2000",
          "email": "sales@client.com",
          "areaServed": ["US", "CA"],
          "availableLanguage": "English"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://www.linkedin.com/company/client",
        "https://twitter.com/client",
        "https://www.facebook.com/client"
      ],
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": 250
      },
      "naics": "541512",
      "taxID": "12-3456789",
      "keywords": ["keyword1", "keyword2"],
      "knowsAbout": ["topic1", "topic2"],
      "mainEntityOfPage": "https://modonty.com/clients/client-slug"
    },
    {
      "@type": "WebSite",
      "@id": "https://modonty.com/#website",
      "url": "https://modonty.com",
      "name": "Modonty",
      "publisher": {
        "@id": "https://modonty.com/clients/client-slug#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://modonty.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://modonty.com/clients/client-slug",
      "url": "https://modonty.com/clients/client-slug",
      "name": "Client Name - Professional Services",
      "description": "Page description...",
      "isPartOf": {
        "@id": "https://modonty.com/#website"
      },
      "about": {
        "@id": "https://modonty.com/clients/client-slug#organization"
      },
      "inLanguage": "ar",
      "datePublished": "2024-01-15T08:00:00Z",
      "dateModified": "2024-12-20T12:00:00Z"
    }
  ]
}
```

## Complete Meta Tags Object Example

Based on official documentation and best practices, the generated meta tags object will include:

```typescript
{
  // Standard SEO Meta Tags
  title: "Client Name - Professional Services",
  description: "Comprehensive description of the organization...",
  robots: "index, follow",
  author: "Client Name",
  language: "ar",
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1.0",

  // Open Graph (Complete - All Properties)
  openGraph: {
    title: "Client Name - Professional Services",
    description: "Comprehensive description...",
    type: "website",
    url: "https://modonty.com/clients/client-slug",
    siteName: "Modonty",
    locale: "ar_SA",
    images: [{
      url: "https://res.cloudinary.com/.../og-image.jpg",
      secure_url: "https://res.cloudinary.com/.../og-image.jpg",
      type: "image/jpeg",
      width: 1200,
      height: 630,
      alt: "Client Name - Organization Logo"
    }]
  },

  // Twitter Cards (Complete - All Properties)
  twitter: {
    card: "summary_large_image",
    title: "Client Name - Professional Services",
    description: "Comprehensive description...",
    image: "https://res.cloudinary.com/.../twitter-image.jpg",
    imageAlt: "Client Name - Organization Logo",
    site: "@modonty",
    creator: "@clientname" // If available
  },

  // Additional Meta Tags
  canonical: "https://modonty.com/clients/client-slug",
  themeColor: "#ffffff",
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  }
}
```

## Testing Considerations

- Test with client that has all fields populated (logo, ogImage, twitterImage, etc.)
- Test with client that has minimal data (only name and slug)
- Verify JSON-LD validates with Google Rich Results Test
- Verify JSON-LD validates with Schema.org Validator
- Verify @graph structure is correct
- Verify all Organization properties are included when data available
- Verify ContactPoint array structure (multiple contact types)
- Verify PostalAddress structure is complete
- Verify ImageObject structure for logo (with dimensions)
- Verify meta tags object is complete and follows all best practices
- Test Open Graph image dimensions and properties
- Test Twitter Card fallback to OG tags
- Ensure meta robots follows best practices
- Test page refresh after generation
- Verify database updates correctly (metaTags, metaRobots, jsonLdStructuredData)
- Verify meta tags object displays correctly in SEO tab
- Verify JSON-LD displays correctly in SEO tab
- Test with client having all fields vs minimal fields
