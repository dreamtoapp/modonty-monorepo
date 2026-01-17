"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useHeaderRef } from "./client-form-header-wrapper";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Plus, Pencil, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SEODoctor } from "@/components/shared/seo-doctor";
import { createOrganizationSEOConfig } from "../helpers/client-seo-config";
import { getSEOSettings, type SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";
import { useClientForm } from "../helpers/hooks/use-client-form";
import { clientFormSections, getVisibleFieldCount } from "../helpers/client-form-config";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { SubscriptionSection } from "./form-sections/subscription-section";
import { BusinessBriefSection } from "./form-sections/business-brief-section";
import { BusinessSection } from "./form-sections/business-section";
import { ContactSection } from "./form-sections/contact-section";
import { SEOSection } from "./form-sections/seo-section";
import { LegalSection } from "./form-sections/legal-section";
import { AddressSection } from "./form-sections/address-section";
import { MediaSocialSection } from "./form-sections/media-social-section";
import { ClassificationSection } from "./form-sections/classification-section";
import { AdditionalSection } from "./form-sections/additional-section";
import type { ClientFormData, ClientWithRelations, FormSubmitResult } from "@/lib/types";

interface ClientFormProps {
  initialData?: Partial<ClientWithRelations>;
  industries?: Array<{ id: string; name: string }>;
  clients?: Array<{ id: string; name: string; slug: string }>;
  onSubmit: (data: ClientFormData) => Promise<FormSubmitResult>;
  clientId?: string;
}

export function ClientForm({ initialData, industries = [], clients = [], onSubmit, clientId }: ClientFormProps) {
  const headerRef = useHeaderRef();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);

  const { form, handleSubmit, loading, error, setError, tierConfigs, isEditMode } = useClientForm({
    initialData,
    onSubmit,
    clientId,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSEOSettings();
        setSeoSettings(settings);
      } catch (error) {
        console.error("Failed to load SEO settings:", error);
      }
    }
    loadSettings();
  }, []);

  // Watch all form fields that affect SEO Doctor
  const watchedFields = {
    name: form.watch("name"),
    slug: form.watch("slug"),
    legalName: form.watch("legalName"),
    url: form.watch("url"),
    email: form.watch("email"),
    phone: form.watch("phone"),
    seoTitle: form.watch("seoTitle"),
    seoDescription: form.watch("seoDescription"),
    businessBrief: form.watch("businessBrief"),
    gtmId: form.watch("gtmId"),
    canonicalUrl: form.watch("canonicalUrl"),
    twitterCard: form.watch("twitterCard"),
    twitterTitle: form.watch("twitterTitle"),
    twitterDescription: form.watch("twitterDescription"),
    twitterSite: form.watch("twitterSite"),
    contactType: form.watch("contactType"),
    addressStreet: form.watch("addressStreet"),
    addressCity: form.watch("addressCity"),
    addressCountry: form.watch("addressCountry"),
    addressPostalCode: form.watch("addressPostalCode"),
    sameAs: form.watch("sameAs"),
    contentPriorities: form.watch("contentPriorities"),
    foundingDate: form.watch("foundingDate"),
  };

  const seoDoctorNode = seoSettings ? (
    <SEODoctor
      data={{
        ...initialData,
        name: watchedFields.name || initialData?.name || "",
        slug: watchedFields.slug || initialData?.slug || "",
        legalName: watchedFields.legalName || initialData?.legalName || "",
        url: watchedFields.url || initialData?.url || "",
        email: watchedFields.email || initialData?.email || "",
        phone: watchedFields.phone || initialData?.phone || "",
        seoTitle: watchedFields.seoTitle || initialData?.seoTitle || "",
        seoDescription: watchedFields.seoDescription || initialData?.seoDescription || "",
        businessBrief: watchedFields.businessBrief || initialData?.businessBrief || "",
        gtmId: watchedFields.gtmId || initialData?.gtmId || "",
        canonicalUrl: watchedFields.canonicalUrl || initialData?.canonicalUrl || "",
        twitterCard: watchedFields.twitterCard || initialData?.twitterCard || "",
        twitterTitle: watchedFields.twitterTitle || initialData?.twitterTitle || "",
        twitterDescription: watchedFields.twitterDescription || initialData?.twitterDescription || "",
        twitterSite: watchedFields.twitterSite || initialData?.twitterSite || "",
        contactType: watchedFields.contactType || initialData?.contactType || "",
        addressStreet: watchedFields.addressStreet || initialData?.addressStreet || "",
        addressCity: watchedFields.addressCity || initialData?.addressCity || "",
        addressCountry: watchedFields.addressCountry || initialData?.addressCountry || "",
        addressPostalCode: watchedFields.addressPostalCode || initialData?.addressPostalCode || "",
        sameAs: watchedFields.sameAs || initialData?.sameAs || [],
        contentPriorities: watchedFields.contentPriorities || initialData?.contentPriorities || [],
        foundingDate: watchedFields.foundingDate
          ? watchedFields.foundingDate
          : (initialData?.foundingDate ? new Date(initialData.foundingDate) : undefined),
        logoMedia: (initialData as any)?.logoMedia,
        ogImageMedia: (initialData as any)?.ogImageMedia,
        twitterImageMedia: (initialData as any)?.twitterImageMedia,
      }}
      config={createOrganizationSEOConfig(seoSettings)}
    />
  ) : null;

  // Expose SEO Doctor to header via ref
  useEffect(() => {
    if (headerRef?.current && seoDoctorNode) {
      headerRef.current.setSEODoctor(seoDoctorNode);
    }
  }, [
    headerRef,
    seoDoctorNode,
    seoSettings,
    watchedFields.name,
    watchedFields.slug,
    watchedFields.seoTitle,
    watchedFields.seoDescription,
    watchedFields.legalName,
    watchedFields.url,
    watchedFields.email,
    watchedFields.phone,
    watchedFields.businessBrief,
    watchedFields.gtmId,
    watchedFields.canonicalUrl,
    watchedFields.twitterCard,
    watchedFields.twitterTitle,
    watchedFields.twitterDescription,
    watchedFields.twitterSite,
    watchedFields.contactType,
    watchedFields.addressStreet,
    watchedFields.addressCity,
    watchedFields.addressCountry,
    watchedFields.addressPostalCode,
    watchedFields.foundingDate,
  ]);

  // Expose action buttons to header via ref
  const buttonConfig = useMemo(() => {
    const buttonText = loading ? "Saving..." : isEditMode ? "Update Client" : "Create Client";
    const buttonIcon = loading ? (
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
    ) : isEditMode ? (
      <Pencil className="h-4 w-4 mr-2" />
    ) : (
      <Plus className="h-4 w-4 mr-2" />
    );
    const buttonClassName = isEditMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white";

    return { buttonText, buttonIcon, buttonClassName };
  }, [loading, isEditMode]);

  useEffect(() => {
    if (headerRef?.current) {
      const actionButtons = (
        <Button
          type="button"
          variant="default"
          className={buttonConfig.buttonClassName}
          disabled={loading}
          onClick={() => {
            if (formRef.current) {
              formRef.current.requestSubmit();
            }
          }}
        >
          {buttonConfig.buttonIcon}
          {buttonConfig.buttonText}
        </Button>
      );
      headerRef.current.setActionButtons(actionButtons);
    }
  }, [headerRef, loading, buttonConfig]);

  return (
    <form ref={formRef} id="client-form" onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div
            className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Tab-based Form Sections */}
        <Tabs defaultValue="required" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6">
            <TabsTrigger value="required" className="relative">
              Required
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {getVisibleFieldCount("required", isEditMode)}
              </span>
            </TabsTrigger>
            <TabsTrigger value="business" className="relative">
              Business
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {getVisibleFieldCount("business", isEditMode)}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contact-seo" className="relative">
              Contact & SEO
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {getVisibleFieldCount("contact-seo", isEditMode)}
              </span>
            </TabsTrigger>
            <TabsTrigger value="legal-address" className="relative">
              Legal & Address
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {getVisibleFieldCount("legal-address", isEditMode)}
              </span>
            </TabsTrigger>
            {isEditMode ? (
              <TabsTrigger value="media-social" className="relative">
                Media & Social
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {getVisibleFieldCount("media-social", isEditMode)}
                </span>
              </TabsTrigger>
            ) : (
              <TabsTrigger value="media-social" disabled className="relative">
                Media & Social
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {getVisibleFieldCount("media-social", isEditMode)}
                </span>
              </TabsTrigger>
            )}
            <TabsTrigger value="classification-additional" className="relative">
              Additional
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {getVisibleFieldCount("classification-additional", isEditMode)}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Required Tab */}
          <TabsContent value="required" className="space-y-6 mt-6">
            <div className="space-y-6">
              <BasicInfoSection form={form} />
              <SubscriptionSection form={form} isEditMode={isEditMode} tierConfigs={tierConfigs} />
              <BusinessBriefSection form={form} />
            </div>
          </TabsContent>

          {/* Business Details Tab */}
          <TabsContent value="business" className="space-y-6 mt-6">
            <BusinessSection form={form} industries={industries} />
          </TabsContent>

          {/* Contact & SEO Tab */}
          <TabsContent value="contact-seo" className="space-y-6 mt-6">
            <div className="space-y-6">
              <ContactSection form={form} />
              <SEOSection form={form} initialData={initialData} />
            </div>
          </TabsContent>

          {/* Legal & Address Tab */}
          <TabsContent value="legal-address" className="space-y-6 mt-6">
            <div className="space-y-6">
              <LegalSection form={form} />
              <AddressSection form={form} />
            </div>
          </TabsContent>

          {/* Media & Social Tab */}
          <TabsContent value="media-social" className="space-y-6 mt-6">
            {isEditMode ? (
              <MediaSocialSection form={form} clientId={clientId} initialData={initialData} />
            ) : (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">Media Management</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Media (logo, OG image, Twitter image) can be added after creating the client. You'll be able to upload and manage media in the edit view.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Classification & Additional Tab */}
          <TabsContent value="classification-additional" className="space-y-6 mt-6">
            <div className="space-y-6">
              <ClassificationSection form={form} clients={clients} />
              <AdditionalSection form={form} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
