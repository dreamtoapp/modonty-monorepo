import { SEODoctorConfig } from "@/components/shared/seo-doctor";
import { createOrganizationSEOConfig as createOrganizationSEOConfigInternal } from "./create-organization-seo-config";

export const createOrganizationSEOConfig = createOrganizationSEOConfigInternal;

export const organizationSEOConfig: SEODoctorConfig =
  createOrganizationSEOConfigInternal();

