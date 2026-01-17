# Database Fields vs Form Fields - Complete Comparison

## ✅ Fields Present in Both DB and Form

### Basic Information
- ✅ `name` - In form (Basic Information section)
- ✅ `slug` - In form (auto-generated, hidden)
- ✅ `legalName` - In form (Basic Information section)
- ✅ `url` - In form (Basic Information section)

### Media Relations
- ✅ `logoMediaId` - In form (Media section via MediaPicker)
- ✅ `ogImageMediaId` - In form (Media section via MediaPicker)
- ✅ `twitterImageMediaId` - In form (Twitter section via MediaPicker)

### Social & Contact
- ✅ `sameAs` - In form (Contact section via SocialProfilesInput)
- ✅ `email` - In form (Contact section)
- ✅ `phone` - In form (Contact section)
- ✅ `contactType` - In form (Contact section)

### SEO Fields
- ✅ `seoTitle` - In form (SEO section)
- ✅ `seoDescription` - In form (SEO section)
- ✅ `description` - In form (SEO section as "Organization Description")
- ✅ `canonicalUrl` - In form (SEO section)
- ✅ `twitterCard` - In form (Twitter section)
- ✅ `twitterTitle` - In form (Twitter section)
- ✅ `twitterDescription` - In form (Twitter section)
- ✅ `twitterSite` - In form (Twitter section)

### Business Information
- ✅ `businessBrief` - In form (Business section)
- ✅ `industryId` - In form (Business section)
- ✅ `targetAudience` - In form (Business section)
- ✅ `contentPriorities` - In form (Business section)
- ✅ `foundingDate` - In form (Business section)

### Address (Basic)
- ✅ `addressStreet` - In form (Contact section)
- ✅ `addressCity` - In form (Contact section)
- ✅ `addressCountry` - In form (Contact section)
- ✅ `addressPostalCode` - In form (Contact section)

### Saudi Arabia & Gulf Identifiers (NEW)
- ✅ `commercialRegistrationNumber` - In form (Saudi Arabia Legal & Registration section)
- ✅ `vatID` - In form (Saudi Arabia Legal & Registration section)
- ✅ `taxID` - In form (Saudi Arabia Legal & Registration section)
- ✅ `legalForm` - In form (Saudi Arabia Legal & Registration section)

### Address Enhancement (NEW)
- ✅ `addressRegion` - In form (Enhanced Address section)
- ✅ `addressNeighborhood` - In form (Enhanced Address section)
- ✅ `addressBuildingNumber` - In form (Enhanced Address section)
- ✅ `addressAdditionalNumber` - In form (Enhanced Address section)

### Classification & Business Info (NEW)
- ✅ `businessActivityCode` - In form (Business Classification section)
- ✅ `isicV4` - In form (Business Classification section)
- ✅ `numberOfEmployees` - In form (Business Classification section)
- ✅ `licenseNumber` - In form (Saudi Arabia Legal & Registration section)
- ✅ `licenseAuthority` - In form (Saudi Arabia Legal & Registration section)

### Additional Properties (NEW)
- ✅ `alternateName` - In form (Additional Properties section)
- ✅ `slogan` - In form (Additional Properties section)
- ✅ `keywords` - In form (Additional Properties section)
- ✅ `knowsLanguage` - In form (Additional Properties section)
- ✅ `organizationType` - In form (Business Classification section)

### Subscription Management
- ✅ `subscriptionTier` - In form (Subscription & Billing section)
- ✅ `subscriptionStartDate` - In form (Subscription & Billing section)
- ✅ `subscriptionEndDate` - In form (Subscription & Billing section)
- ✅ `subscriptionStatus` - In form (Subscription & Billing section, edit mode only)
- ✅ `paymentStatus` - In form (Subscription & Billing section, edit mode only)
- ✅ `articlesPerMonth` - In form (Subscription & Billing section, edit mode only)
- ✅ `subscriptionTierConfigId` - In form (handled internally)

### GTM Integration
- ✅ `gtmId` - In form (SEO section)

## ❌ Missing Fields in Form (Present in DB)

### 1. `metaRobots` ❌
- **DB Field**: `metaRobots String? // index, noindex, follow, nofollow`
- **Status**: NOT in form
- **Impact**: Cannot set robots meta tag for clients
- **Recommendation**: Add to SEO section as a dropdown

### 2. `parentOrganizationId` ⚠️
- **DB Field**: `parentOrganizationId String? @db.ObjectId // Parent company reference`
- **Status**: In formData state but NOT visible in UI
- **Impact**: Cannot link client to parent organization
- **Recommendation**: Add to "Additional Properties" or "Business Classification" section as a select dropdown

## 📋 Auto-Generated/System Fields (Not in Form - Expected)

These fields are auto-managed and don't need to be in the form:
- `id` - Auto-generated ObjectId
- `createdAt` - Auto-generated timestamp
- `updatedAt` - Auto-updated timestamp
- `jsonLdStructuredData` - Auto-generated from other fields
- `jsonLdLastGenerated` - Auto-managed
- `jsonLdValidationReport` - Auto-generated
- `metaTags` - Auto-generated from other fields

## 📊 Summary

- **Total DB Fields (excluding auto-generated)**: 58
- **Fields in Form**: 56
- **Missing Fields**: 2
  - `metaRobots` ❌
  - `parentOrganizationId` ⚠️ (in state but not in UI)

## 🎯 Action Items

1. **Add `metaRobots` field** to SEO section
2. **Add `parentOrganizationId` field** to UI (it's already in formData state)
