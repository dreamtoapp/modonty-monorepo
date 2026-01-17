import { SEODoctorConfig, type SEOFieldValidator } from "@/components/shared/seo-doctor";
import {
  validateSlug,
  createValidateSEODescription,
  createValidateTwitterTitle,
  createValidateTwitterDescription,
  validateTwitterCards,
  validateTwitterImageAlt,
  validateCanonicalUrl,
} from "@/components/shared/seo-doctor/validators";
import type { SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";
// Consolidated validators
import {
  validateName,
  validateLegalName,
  validateUrl,
  validateDescription,
  validateContactInfo,
  validateSocialProfiles,
  validateFoundingDate,
  validateBusinessBrief,
  validateGTMId,
  createValidateSEOTitleAndOG,
} from './validators-basic';

import {
  validateLogo,
  validateLogoAlt,
  validateOGImageForClient,
  validateOGImageAltForClient,
  validateOGImageDimensionsForClient,
  validateTwitterImageAltForClient,
  validateAddress,
  validateAddressRegion,
  validateNationalAddress,
  validateContactPoint,
  validateMultipleContactPoints,
  validateSaudiIdentifiers,
  validateLegalForm,
  validateClassification,
  validateOrganizationType,
  validateNumberOfEmployees,
  validateLicenseInfo,
} from './validators-advanced';
import { generateOrganizationStructuredData } from "./generate-organization-structured-data";
import { 
  getFieldMapping, 
  CLIENT_FIELD_MAPPINGS,
  getMetaTagsFields,
  getJsonLdFields 
} from "../client-field-mapping";

/**
 * Get label from mapping file, fallback to provided label
 */
function getLabelFromMapping(fieldName: string, fallbackLabel: string): string {
  const mapping = getFieldMapping(fieldName);
  if (mapping?.description) {
    return mapping.description;
  }
  return fallbackLabel;
}

/**
 * Map database field names to validator field names
 * Some validators check nested properties (e.g., logoMedia -> logo, logoAlt)
 */
const FIELD_TO_VALIDATOR_MAP: Record<string, string[]> = {
  'logoMedia': ['logo', 'logoAlt'],
  'ogImageMedia': ['ogImage', 'ogImageAlt', 'ogImageWidth'],
  'twitterImageMedia': ['twitterImageAlt'],
  // Direct mappings (field name = validator name)
  'name': ['name'],
  'slug': ['slug'],
  'legalName': ['legalName'],
  'url': ['url'],
  'seoTitle': ['seoTitle'],
  'seoDescription': ['seoDescription'],
  'description': ['description'],
  'canonicalUrl': ['canonicalUrl'],
  'metaRobots': ['metaRobots'],
  'sameAs': ['sameAs'],
  'email': ['email'],
  'phone': ['phone'],
  'contactType': ['contactType'],
  'addressStreet': ['addressStreet'],
  'addressCity': ['addressCity'],
  'addressRegion': ['addressRegion'],
  'addressCountry': ['addressCountry'],
  'addressPostalCode': ['addressPostalCode'],
  'addressBuildingNumber': ['addressStreet'], // Combined with addressStreet
  'addressAdditionalNumber': ['addressStreet'], // Combined with addressStreet
  'addressNeighborhood': ['addressStreet'], // Part of address validation
  'commercialRegistrationNumber': ['commercialRegistrationNumber'],
  'vatID': ['vatID'],
  'taxID': ['taxID'],
  'legalForm': ['legalForm'],
  'businessActivityCode': ['businessActivityCode'],
  'isicV4': ['isicV4'],
  'numberOfEmployees': ['numberOfEmployees'],
  'licenseNumber': ['licenseNumber'],
  'organizationType': ['organizationType'],
  'alternateName': ['alternateName'],
  'slogan': ['slogan'],
  'foundingDate': ['foundingDate'],
  'keywords': ['keywords'],
  'knowsLanguage': ['knowsLanguage'],
  'twitterCard': ['twitterCard'],
  'twitterTitle': ['twitterTitle'],
  'twitterDescription': ['twitterDescription'],
  'twitterSite': ['twitterSite'],
  'contentPriorities': ['contentPriorities'],
  'parentOrganization': ['parentOrganization'],
};

/**
 * Get validator field names for a database field
 */
function getValidatorFieldsForMappingField(fieldName: string): string[] {
  return FIELD_TO_VALIDATOR_MAP[fieldName] || [fieldName];
}

/**
 * Get validator for a field name
 */
function getValidatorForField(fieldName: string, settings?: SEOSettings): SEOFieldValidator | null {
  const validatorMap: Record<string, SEOFieldValidator> = {
    'name': validateName,
    'slug': validateSlug,
    'legalName': validateLegalName,
    'url': validateUrl,
    'logo': validateLogo,
    'logoAlt': validateLogoAlt,
    'ogImage': validateOGImageForClient,
    'ogImageAlt': validateOGImageAltForClient,
    'ogImageWidth': validateOGImageDimensionsForClient,
    'seoTitle': createValidateSEOTitleAndOG(settings),
    'seoDescription': createValidateSEODescription(settings),
    'sameAs': validateSocialProfiles,
    'email': validateContactInfo,
    'foundingDate': validateFoundingDate,
    'description': validateDescription,
    'contactType': validateContactPoint,
    'twitterCard': validateTwitterCards,
    'twitterTitle': createValidateTwitterTitle(settings),
    'twitterDescription': createValidateTwitterDescription(settings),
    'twitterImageAlt': validateTwitterImageAltForClient,
    'canonicalUrl': validateCanonicalUrl,
    'addressStreet': validateAddress,
    'commercialRegistrationNumber': validateSaudiIdentifiers,
    'legalForm': validateLegalForm,
    'vatID': validateSaudiIdentifiers,
    'taxID': validateSaudiIdentifiers,
    'addressRegion': validateAddressRegion,
    'addressPostalCode': validateNationalAddress,
    'businessActivityCode': validateClassification,
    'isicV4': validateClassification,
    'numberOfEmployees': validateNumberOfEmployees,
    'licenseNumber': validateLicenseInfo,
    'organizationType': validateOrganizationType,
    'alternateName': validateName,
    'slogan': validateDescription,
  };
  
  return validatorMap[fieldName] || null;
}

export const createOrganizationSEOConfig = (
  settings?: SEOSettings,
): SEODoctorConfig => {
  // Get all fields that affect MetaTags or JSON-LD
  const metaTagsFields = getMetaTagsFields();
  const jsonLdFields = getJsonLdFields();
  
  // Combine and deduplicate by field name
  const allSeoFields = new Map<string, typeof CLIENT_FIELD_MAPPINGS[0]>();
  metaTagsFields.forEach(f => allSeoFields.set(f.field, f));
  jsonLdFields.forEach(f => allSeoFields.set(f.field, f));
  
  // Build field configs from mapping
  const fieldConfigs: Array<{ name: string; label: string; validator: SEOFieldValidator }> = [];
  const processedValidatorFields = new Set<string>();
  
  for (const mapping of allSeoFields.values()) {
    // Skip Integration category (gtmId doesn't affect SEO output)
    if (mapping.category === 'Integration') {
      continue;
    }
    
    const validatorFields = getValidatorFieldsForMappingField(mapping.field);
    
    for (const validatorField of validatorFields) {
      // Avoid duplicates (e.g., addressStreet appears multiple times)
      if (processedValidatorFields.has(validatorField)) {
        continue;
      }
      
      const validator = getValidatorForField(validatorField, settings);
      if (validator) {
        processedValidatorFields.add(validatorField);
        fieldConfigs.push({
          name: validatorField,
          label: getLabelFromMapping(mapping.field, validatorField),
          validator,
        });
      }
    }
  }
  
  // Calculate maxScore by summing optimal scores from mapping file
  // This ensures maxScore is derived from the single source of truth
  let calculatedMaxScore = 0;
  const processedFields = new Set<string>();
  
  for (const mapping of allSeoFields.values()) {
    // Skip Integration category (gtmId doesn't affect SEO output)
    if (mapping.category === 'Integration') {
      continue;
    }
    
    // Avoid counting the same field multiple times (e.g., addressStreet appears in multiple validators)
    if (processedFields.has(mapping.field)) {
      continue;
    }
    
    // Add optimal score from mapping if available
    if (mapping.score?.optimal) {
      calculatedMaxScore += mapping.score.optimal;
      processedFields.add(mapping.field);
    }
  }

  return {
    entityType: "Organization",
    maxScore: calculatedMaxScore || 200, // Fallback to 200 if calculation fails
    generateStructuredData: generateOrganizationStructuredData,
    fields: fieldConfigs,
  };
};

