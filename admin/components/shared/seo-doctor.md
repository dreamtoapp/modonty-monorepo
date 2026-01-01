# SEO Doctor Component

A reusable, configurable SEO health checker component that provides real-time feedback on SEO optimization for any entity type (Organizations, Articles, Categories, Authors, etc.).

## Overview

The SEO Doctor component analyzes form data and provides:
- Real-time SEO health scoring
- Individual field validation with tooltips
- Schema.org structured data preview
- Visual feedback with status icons and color coding

## Installation

The component is located at `admin/components/shared/seo-doctor.tsx` and can be imported directly:

```typescript
import { SEODoctor } from "@/components/shared/seo-doctor";
import { organizationSEOConfig } from "@/components/shared/seo-configs";
```

## Basic Usage

```tsx
import { SEODoctor } from "@/components/shared/seo-doctor";
import { organizationSEOConfig } from "@/components/shared/seo-configs";

function MyForm() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    // ... other fields
  });

  return (
    <SEODoctor 
      data={formData} 
      config={organizationSEOConfig}
    />
  );
}
```

## Props

### SEODoctorProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `Record<string, any>` | Yes | Form data object containing all fields to validate |
| `config` | `SEODoctorConfig` | Yes | Configuration object defining checks and Schema.org type |
| `title` | `string` | No | Custom title for the component (default: "SEO Doctor") |

### SEODoctorConfig

| Property | Type | Description |
|----------|------|-------------|
| `entityType` | `string` | Schema.org entity type (e.g., "Organization", "Article", "Person") |
| `fields` | `SEOFieldConfig[]` | Array of field configurations with validators |
| `maxScore` | `number` | Maximum possible score for SEO health |
| `generateStructuredData` | `(data: Record<string, any>) => any` | Function to generate Schema.org structured data |

### SEOFieldConfig

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Field name in the data object |
| `label` | `string` | Display label for the field |
| `validator` | `SEOFieldValidator` | Function that validates the field and returns status, message, and score |

## Preset Configurations

### Organization/Client Configuration

```typescript
import { organizationSEOConfig } from "@/components/shared/seo-configs";

<SEODoctor 
  data={clientFormData} 
  config={organizationSEOConfig}
/>
```

**Includes checks for:**
- Client Name (required)
- Slug (required)
- Legal Name
- Website URL
- Logo
- OG Image
- SEO Title (50-60 chars optimal)
- SEO Description (150-160 chars optimal)
- Social Profiles
- Business Brief
- Contact Information
- GTM ID
- Founding Date
- Organization Description
- Open Graph Tags
- HTTPS Protocol
- ContactPoint Structure
- Logo Format
- Twitter Cards
- Canonical URL
- Address (Local SEO)

**Total Score:** 150 points

## Creating Custom Configurations

### Example: Article Configuration

```typescript
import { SEODoctorConfig, SEOFieldValidator } from "@/components/shared/seo-doctor";

const validateArticleTitle: SEOFieldValidator = (value) => {
  if (value && value.length >= 30 && value.length <= 60) {
    return {
      status: "good",
      message: `Perfect title length (${value.length} chars)`,
      score: 10,
    };
  }
  return {
    status: "warning",
    message: "Title should be 30-60 characters",
    score: 5,
  };
};

const validateWordCount: SEOFieldValidator = (value, data) => {
  const wordCount = data.content?.split(/\s+/).length || 0;
  if (wordCount >= 1000) {
    return {
      status: "good",
      message: `Comprehensive article (${wordCount} words)`,
      score: 15,
    };
  }
  return {
    status: "warning",
    message: `Article too short (${wordCount} words) - aim for 1000+ words`,
    score: 5,
  };
};

function generateArticleStructuredData(data: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.seoDescription,
    datePublished: data.datePublished,
    author: {
      "@type": "Person",
      name: data.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: data.publisherName,
    },
  };
}

export const articleSEOConfig: SEODoctorConfig = {
  entityType: "Article",
  maxScore: 200,
  generateStructuredData: generateArticleStructuredData,
  fields: [
    { name: "title", label: "Article Title", validator: validateArticleTitle },
    { name: "content", label: "Word Count", validator: validateWordCount },
    // ... more fields
  ],
};
```

## Validator Function Signature

```typescript
type SEOFieldValidator = (
  value: any,
  data: Record<string, any>
) => {
  status: "good" | "warning" | "error" | "info";
  message: string;
  score: number;
};
```

### Validator Examples

**Simple validation:**
```typescript
const validateRequired: SEOFieldValidator = (value) => {
  if (value && value.trim().length > 0) {
    return { status: "good", message: "Field is set", score: 5 };
  }
  return { status: "error", message: "Field is required", score: 0 };
};
```

**Length validation:**
```typescript
const validateLength: SEOFieldValidator = (value) => {
  const length = value?.length || 0;
  if (length >= 50 && length <= 60) {
    return { status: "good", message: `Perfect length (${length} chars)`, score: 10 };
  }
  return { status: "warning", message: `Length: ${length} chars`, score: 5 };
};
```

**Cross-field validation:**
```typescript
const validateContact: SEOFieldValidator = (value, data) => {
  const hasEmail = data.email?.trim().length > 0;
  const hasPhone = data.phone?.trim().length > 0;
  if (hasEmail && hasPhone) {
    return { status: "good", message: "Complete contact info", score: 10 };
  }
  return { status: "warning", message: "Add email and phone", score: 5 };
};
```

## Status Types

- **good**: Field meets requirements (green icon)
- **warning**: Field needs improvement (yellow icon)
- **error**: Field is missing or invalid (red icon)
- **info**: Informational message (gray icon)

## UI Features

- **Real-time updates**: Component recalculates as form data changes
- **Tooltips**: Hover over info icons to see detailed messages
- **Schema.org Preview**: Collapsible section showing generated structured data
- **Score visualization**: Progress bar and percentage badge
- **Color coding**: Green (80%+), Yellow (60-79%), Red (<60%)

## Examples

### Client Form

```tsx
import { SEODoctor } from "@/components/shared/seo-doctor";
import { organizationSEOConfig } from "@/components/shared/seo-configs";

function ClientForm() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    legalName: "",
    url: "",
    // ... all client fields
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Form fields */}
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <SEODoctor 
            data={formData} 
            config={organizationSEOConfig}
          />
        </div>
      </div>
    </div>
  );
}
```

### Article Form

```tsx
import { SEODoctor } from "@/components/shared/seo-doctor";
import { articleSEOConfig } from "@/components/shared/seo-configs";

function ArticleForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    seoTitle: "",
    // ... article fields
  });

  return (
    <SEODoctor 
      data={formData} 
      config={articleSEOConfig}
      title="Article SEO Health"
    />
  );
}
```

## Best Practices

1. **Keep validators focused**: Each validator should check one specific aspect
2. **Provide helpful messages**: Messages should guide users on how to improve
3. **Score appropriately**: Important fields should have higher scores
4. **Use cross-field validation**: Some checks need access to multiple fields
5. **Update structured data generator**: Ensure it matches your Schema.org requirements

## Schema.org Types Supported

- Organization
- Article
- Person
- Category
- LocalBusiness
- (Custom types via configuration)

## Notes

- All fields in the config are optional - component handles missing data gracefully
- Validators receive the field value and full data object for cross-field validation
- Structured data generator should remove undefined values
- Component is fully typed with TypeScript
