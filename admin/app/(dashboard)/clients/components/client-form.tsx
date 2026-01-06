"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormSelect, FormNativeSelect } from "@/components/admin/form-field";
import { SelectItem } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { slugify } from "@/lib/utils";
import { SubscriptionTierCards } from "./subscription-tier-cards";
import { CharacterCounter } from "@/components/shared/character-counter";
import { SocialProfilesInput } from "./social-profiles-input";
import { SEODoctor } from "@/components/shared/seo-doctor";
import { createOrganizationSEOConfig } from "../helpers/client-seo-config";
import { getSEOSettings, type SEOSettings } from "@/app/(dashboard)/settings/actions/settings-actions";
import { ChevronDown, ChevronUp, User, Building2, CreditCard, Mail, Image, Twitter, Search } from "lucide-react";
import { MediaPicker } from "@/components/shared/media-picker";

import { updateClient } from "../actions/clients-actions";
import { updateMedia } from "../../media/actions/media-actions";
import { ClientFormData, ClientWithRelations, FormSubmitResult } from "@/lib/types";
import { SubscriptionTier, SubscriptionStatus, PaymentStatus } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

interface ClientFormProps {
  initialData?: Partial<ClientWithRelations>;
  industries?: Array<{ id: string; name: string }>;
  onSubmit: (data: ClientFormData) => Promise<FormSubmitResult>;
  clientId?: string;
}

export function ClientForm({ initialData, industries = [], onSubmit, clientId }: ClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);
  const [openSections, setOpenSections] = useState({
    basic: true,
    subscription: true,
    business: false,
    contact: false,
    media: false,
    twitter: false,
    seo: false,
  });

  const isEditMode = Boolean(clientId);

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

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    legalName: string;
    url: string;
    logoMediaId?: string;
    ogImageMediaId?: string;
    twitterImageMediaId?: string;
    email: string;
    phone: string;
    seoTitle: string;
    seoDescription: string;
    sameAs: string[];
    businessBrief: string;
    industryId: string;
    targetAudience: string;
    contentPriorities: string;
    foundingDate: string;
    gtmId: string;
    subscriptionTier: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionStatus: string;
    paymentStatus: string;
    description?: string;
    contactType?: string;
    addressStreet?: string;
    addressCity?: string;
    addressCountry?: string;
    addressPostalCode?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterSite?: string;
    canonicalUrl?: string;
  }>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    legalName: initialData?.legalName || "",
    url: initialData?.url || "",
    logoMediaId: (initialData as any)?.logoMediaId || undefined,
    ogImageMediaId: (initialData as any)?.ogImageMediaId || undefined,
    twitterImageMediaId: (initialData as any)?.twitterImageMediaId || undefined,
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    sameAs: initialData?.sameAs || [],
    businessBrief: initialData?.businessBrief || "",
    industryId: initialData?.industryId || initialData?.industry?.id || "",
    targetAudience: initialData?.targetAudience || "",
    contentPriorities: initialData?.contentPriorities?.join(", ") || "",
    foundingDate: initialData?.foundingDate
      ? new Date(initialData.foundingDate).toISOString().split("T")[0]
      : "",
    gtmId: initialData?.gtmId || "",
    subscriptionTier: initialData?.subscriptionTier || "",
    subscriptionStartDate: initialData?.subscriptionStartDate
      ? new Date(initialData.subscriptionStartDate).toISOString().split("T")[0]
      : "",
    subscriptionEndDate: initialData?.subscriptionEndDate
      ? new Date(initialData.subscriptionEndDate).toISOString().split("T")[0]
      : "",
    subscriptionStatus: initialData?.subscriptionStatus || "PENDING",
    paymentStatus: initialData?.paymentStatus || "PENDING",
    description: initialData?.description || "",
    contactType: initialData?.contactType || "",
    addressStreet: initialData?.addressStreet || "",
    addressCity: initialData?.addressCity || "",
    addressCountry: initialData?.addressCountry || "",
    addressPostalCode: initialData?.addressPostalCode || "",
    twitterCard: initialData?.twitterCard || "",
    twitterTitle: initialData?.twitterTitle || "",
    twitterDescription: initialData?.twitterDescription || "",
    twitterSite: initialData?.twitterSite || "",
    canonicalUrl: initialData?.canonicalUrl || "",
  });

  useEffect(() => {
    const newSlug = slugify(formData.name);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
  }, [formData.name]);

  const getArticlesPerMonth = (tier: string): number => {
    switch (tier) {
      case "BASIC":
        return 2;
      case "STANDARD":
        return 4;
      case "PRO":
        return 8;
      case "PREMIUM":
        return 12;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (formData.subscriptionTier && formData.subscriptionStartDate) {
      const startDate = new Date(formData.subscriptionStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 18);
      setFormData((prev) => ({
        ...prev,
        subscriptionEndDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.subscriptionTier, formData.subscriptionStartDate]);

  const articlesPerMonth = getArticlesPerMonth(formData.subscriptionTier);

  const handleLogoAltTextUpdate = async (newAltText: string) => {
    if (!formData.logoMediaId) return;
    const result = await updateMedia(formData.logoMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "Logo alt text has been updated in the media library.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  const handleOGImageAltTextUpdate = async (newAltText: string) => {
    if (!formData.ogImageMediaId) return;
    const result = await updateMedia(formData.ogImageMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "OG image alt text has been updated in the media library.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  const handleTwitterImageAltTextUpdate = async (newAltText: string) => {
    if (!formData.twitterImageMediaId) return;
    const result = await updateMedia(formData.twitterImageMediaId, { altText: newAltText });
    if (result.success) {
      toast({
        title: "Alt text updated",
        description: "Twitter image alt text has been updated in the media library.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isEditMode) {
      if (!formData.businessBrief || formData.businessBrief.trim().length < 100) {
        setError("Business Brief is required and must be at least 100 characters long");
        setLoading(false);
        setOpenSections((prev) => ({ ...prev, business: true }));
        return;
      }

      if (!formData.subscriptionTier) {
        setError("Subscription Tier is required");
        setLoading(false);
        setOpenSections((prev) => ({ ...prev, subscription: true }));
        return;
      }

      if (formData.gtmId && !/^GTM-[A-Z0-9]+$/.test(formData.gtmId)) {
        setError("GTM ID must be in format GTM-XXXXXXX");
        setLoading(false);
        setOpenSections((prev) => ({ ...prev, seo: true }));
        return;
      }
    }

    const submitData = {
      ...formData,
      sameAs: Array.isArray(formData.sameAs) ? formData.sameAs : [],
      contentPriorities: formData.contentPriorities
        ? formData.contentPriorities.split(",").map((p: string) => p.trim()).filter(Boolean)
        : [],
      foundingDate: formData.foundingDate ? new Date(formData.foundingDate) : null,
      subscriptionStartDate: formData.subscriptionStartDate
        ? new Date(formData.subscriptionStartDate)
        : null,
      subscriptionEndDate: formData.subscriptionEndDate
        ? new Date(formData.subscriptionEndDate)
        : null,
      articlesPerMonth: articlesPerMonth,
      subscriptionTier: (formData.subscriptionTier as SubscriptionTier) || null,
      subscriptionStatus: (formData.subscriptionStatus as SubscriptionStatus) || SubscriptionStatus.PENDING,
      paymentStatus: (formData.paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
      description: formData.description || null,
      contactType: formData.contactType || null,
      addressStreet: formData.addressStreet || null,
      addressCity: formData.addressCity || null,
      addressCountry: formData.addressCountry || null,
      addressPostalCode: formData.addressPostalCode || null,
      twitterCard: formData.twitterCard && formData.twitterCard !== "auto" ? formData.twitterCard : null,
      twitterTitle: formData.twitterTitle || null,
      twitterDescription: formData.twitterDescription || null,
      twitterSite: formData.twitterSite || null,
      canonicalUrl: formData.canonicalUrl || null,
    };

    const result = clientId
      ? await updateClient(clientId, submitData)
      : await onSubmit(submitData);

    if (result.success) {
      router.push("/clients");
      router.refresh();
    } else {
      setError(result.error || "Failed to save client");
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Data */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <Collapsible open={openSections.basic} onOpenChange={() => toggleSection("basic")}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Core client details including name, legal name, and website URL
                        </CardDescription>
                      </div>
                    </div>
                    {openSections.basic ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <FormInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    hint={
                      formData.slug && formData.slug.trim()
                        ? `Slug: ${formData.slug} - Used in URLs and article mentions`
                        : "Client name used in articles and Authority Blog. Slug auto-generated."
                    }
                    required
                  />
                  <input type="hidden" name="slug" value={formData.slug} />
                  <FormInput
                    label="Legal Name"
                    name="legalName"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    hint="Official registered business name for Schema.org structured data"
                  />
                  <FormInput
                    label="URL"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    hint="Client's main website URL - used for backlinks and Schema.org"
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible
            open={openSections.subscription}
            onOpenChange={() => toggleSection("subscription")}
          >
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <CardTitle>Subscription & Billing</CardTitle>
                        <CardDescription>
                          Subscription tier, dates, status, and payment information
                        </CardDescription>
                      </div>
                    </div>
                    {openSections.subscription ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-1">
                        Subscription Tier
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Select the subscription plan that determines monthly article allocation and billing structure. This setting affects content delivery capacity and subscription management.
                      </p>
                    </div>
                    <SubscriptionTierCards
                      selectedTier={formData.subscriptionTier}
                      onSelect={(tier) => setFormData({ ...formData, subscriptionTier: tier })}
                    />
                    {!formData.subscriptionTier && (
                      <p className="text-xs text-destructive mt-2">
                        Please select a subscription tier to continue
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Subscription Start Date"
                      name="subscriptionStartDate"
                      type="date"
                      value={formData.subscriptionStartDate}
                      onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                      hint="When subscription begins - end date auto-calculated (18 months)"
                    />
                    <FormInput
                      label="Subscription End Date"
                      name="subscriptionEndDate"
                      type="date"
                      value={formData.subscriptionEndDate}
                      onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })}
                      hint="Auto-calculated: 18 months from start (ensures clients see full SEO results)"
                    />
                  </div>
                  {isEditMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormSelect
                        label="Subscription Status"
                        name="subscriptionStatus"
                        value={formData.subscriptionStatus}
                        onValueChange={(value) => setFormData({ ...formData, subscriptionStatus: value })}
                        hint="Current subscription state - Active enables content delivery"
                      >
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </FormSelect>
                      <FormSelect
                        label="Payment Status"
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                        hint="Track payment status for billing and subscription management"
                      >
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                      </FormSelect>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {isEditMode && (
            <>
              <Collapsible open={openSections.business} onOpenChange={() => toggleSection("business")}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle>Business Details</CardTitle>
                            <CardDescription>
                              Business brief, industry, target audience, and content priorities
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.business ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      <div>
                        <FormTextarea
                          label="Business Brief"
                          name="businessBrief"
                          value={formData.businessBrief}
                          onChange={(e) => setFormData({ ...formData, businessBrief: e.target.value })}
                          rows={6}
                          required
                          placeholder="Describe the client's business, products/services, target audience, and unique selling points. This helps content writers create relevant, customized content. (Minimum 100 characters)"
                          hint="Essential for content writers to create relevant, customized articles. Include business description, products/services, and unique selling points."
                        />
                        <div className="mt-1">
                          <CharacterCounter
                            current={formData.businessBrief.length}
                            min={100}
                            className="ml-1"
                          />
                        </div>
                      </div>
                      <FormNativeSelect
                        label="Industry"
                        name="industryId"
                        value={formData.industryId}
                        onChange={(e) => setFormData({ ...formData, industryId: e.target.value })}
                        placeholder="Select an industry"
                        hint="Categorizes client for better content targeting and organization"
                      >
                        {industries.map((industry) => (
                          <option key={industry.id} value={industry.id}>
                            {industry.name}
                          </option>
                        ))}
                      </FormNativeSelect>
                      <FormTextarea
                        label="Target Audience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        rows={3}
                        placeholder="Describe the target audience for this client"
                        hint="Helps writers tailor content tone, style, and topics to the right audience"
                      />
                      <FormInput
                        label="Content Priorities (comma-separated)"
                        name="contentPriorities"
                        value={formData.contentPriorities}
                        onChange={(e) => setFormData({ ...formData, contentPriorities: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                        hint="Key topics/keywords to prioritize in articles for better SEO targeting"
                      />
                      <FormInput
                        label="Founding Date"
                        name="foundingDate"
                        type="date"
                        value={formData.foundingDate}
                        onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
                        hint="Used in Schema.org structured data to establish business credibility"
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={openSections.contact} onOpenChange={() => toggleSection("contact")}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle>Contact & Branding</CardTitle>
                            <CardDescription>
                              Contact information, address, and social media profiles
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.contact ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          hint="Contact email for notifications and communication"
                        />
                        <FormInput
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          hint="Contact phone number for business inquiries"
                        />
                      </div>
                      <FormInput
                        label="Contact Type"
                        name="contactType"
                        value={formData.contactType || ""}
                        onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                        placeholder="e.g., customer service, technical support, sales"
                        hint="Contact type for Schema.org ContactPoint structure (improves structured data)"
                      />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Address (for Local SEO)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="Street Address"
                            name="addressStreet"
                            value={formData.addressStreet || ""}
                            onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                            hint="Street address for local businesses"
                          />
                          <FormInput
                            label="City"
                            name="addressCity"
                            value={formData.addressCity || ""}
                            onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                            hint="City name"
                          />
                          <FormInput
                            label="Country"
                            name="addressCountry"
                            value={formData.addressCountry || ""}
                            onChange={(e) => setFormData({ ...formData, addressCountry: e.target.value })}
                            hint="Country name"
                          />
                          <FormInput
                            label="Postal Code"
                            name="addressPostalCode"
                            value={formData.addressPostalCode || ""}
                            onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                            hint="Postal/ZIP code"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Address fields enable LocalBusiness schema for local SEO (optional - only needed for local businesses)
                        </p>
                      </div>
                      <SocialProfilesInput
                        label="Social Profiles"
                        value={Array.isArray(formData.sameAs) ? formData.sameAs : []}
                        onChange={(urls) => setFormData({ ...formData, sameAs: urls })}
                        hint="Add social media URLs one at a time. Used in Schema.org for SEO and brand verification."
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Media section: centralize logo and OG images */}
              <Collapsible open={openSections.media} onOpenChange={() => toggleSection("media")}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle>Media & Social Images</CardTitle>
                            <CardDescription>
                              Logo and Open Graph images for branding and social sharing
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.media ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      {/* Logo */}
                      <div className="space-y-2">
                        <MediaPicker
                          clientId={clientId || initialData?.id || null}
                          value={(initialData as any)?.logoMedia?.url || ""}
                          altText={(initialData as any)?.logoMedia?.altText || ""}
                          mediaId={formData.logoMediaId}
                          showUrlField={false}
                          showAltOverlay
                          onSelect={(media) => {
                            setFormData({
                              ...formData,
                              logoMediaId: media.mediaId,
                            });
                          }}
                          onClear={() => {
                            setFormData({
                              ...formData,
                              logoMediaId: undefined,
                            });
                          }}
                          onAltTextUpdate={handleLogoAltTextUpdate}
                          label="Logo"
                          hint="Logo image displayed in client profile and articles. Click the edit icon on the image to update alt text."
                        />
                      </div>

                      {/* OG Image */}
                      <div className="space-y-2">
                        <MediaPicker
                          clientId={clientId || initialData?.id || null}
                          value={(initialData as any)?.ogImageMedia?.url || ""}
                          altText={(initialData as any)?.ogImageMedia?.altText || ""}
                          mediaId={formData.ogImageMediaId}
                          showUrlField={false}
                          showAltOverlay
                          onSelect={(media) => {
                            setFormData({
                              ...formData,
                              ogImageMediaId: media.mediaId,
                            });
                          }}
                          onClear={() => {
                            setFormData({
                              ...formData,
                              ogImageMediaId: undefined,
                            });
                          }}
                          onAltTextUpdate={handleOGImageAltTextUpdate}
                          label="OG Image"
                          hint="Default Open Graph image for social media shares (1200x630px recommended). Click the edit icon on the image to update alt text."
                        />
                      </div>

                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Twitter - all fields in one card */}
              <Collapsible open={openSections.twitter} onOpenChange={() => toggleSection("twitter")}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Twitter className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle>Twitter (Social SEO)</CardTitle>
                            <CardDescription>
                              Twitter card configuration for optimized social media sharing
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.twitter ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Twitter Cards (for Social SEO)</p>
                        <FormSelect
                          label="Twitter Card Type"
                          name="twitterCard"
                          value={formData.twitterCard || "auto"}
                          onValueChange={(value) => setFormData({ ...formData, twitterCard: value })}
                          hint="Card type for Twitter/X sharing"
                        >
                          <SelectItem value="auto">Auto-generate from OG tags</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                          <SelectItem value="summary">Summary</SelectItem>
                        </FormSelect>
                        <FormInput
                          label="Twitter Title"
                          name="twitterTitle"
                          value={formData.twitterTitle || ""}
                          onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
                          hint={`Twitter-specific title (max ${seoSettings?.twitterTitleMax || 70} chars, auto-generated from SEO title if not provided)`}
                        />
                        {seoSettings && (
                          <div className="mt-1">
                            <CharacterCounter
                              current={(formData.twitterTitle || "").length}
                              max={seoSettings.twitterTitleMax}
                              restrict={seoSettings.twitterTitleRestrict}
                              className="ml-1"
                            />
                          </div>
                        )}
                        <FormTextarea
                          label="Twitter Description"
                          name="twitterDescription"
                          value={formData.twitterDescription || ""}
                          onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
                          rows={2}
                          hint={`Twitter-specific description (max ${seoSettings?.twitterDescriptionMax || 200} chars, auto-generated from SEO description if not provided)`}
                        />
                        {seoSettings && (
                          <div className="mt-1">
                            <CharacterCounter
                              current={(formData.twitterDescription || "").length}
                              max={seoSettings.twitterDescriptionMax}
                              restrict={seoSettings.twitterDescriptionRestrict}
                              className="ml-1"
                            />
                          </div>
                        )}
                        <MediaPicker
                          clientId={clientId || initialData?.id || null}
                          value={(initialData as any)?.twitterImageMedia?.url || ""}
                          altText={(initialData as any)?.twitterImageMedia?.altText || ""}
                          mediaId={formData.twitterImageMediaId}
                          showUrlField={false}
                          showAltOverlay
                          onSelect={(media) => {
                            setFormData({
                              ...formData,
                              twitterImageMediaId: media.mediaId,
                            });
                          }}
                          onClear={() => {
                            setFormData({
                              ...formData,
                              twitterImageMediaId: undefined,
                            });
                          }}
                          onAltTextUpdate={handleTwitterImageAltTextUpdate}
                          label="Twitter Image"
                          hint="Twitter-specific image (auto-generated from OG image if not provided). Click the edit icon on the image to update alt text."
                        />
                        <FormInput
                          label="Twitter Site"
                          name="twitterSite"
                          value={formData.twitterSite || ""}
                          onChange={(e) => setFormData({ ...formData, twitterSite: e.target.value })}
                          placeholder="@username"
                          hint="Twitter/X username (e.g., @company) for attribution"
                        />
                        <p className="text-xs text-muted-foreground">
                          Twitter Cards improve social SEO signals and engagement. Fields auto-generate from existing SEO data if not provided.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={openSections.seo} onOpenChange={() => toggleSection("seo")}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Search className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle>SEO & Tracking</CardTitle>
                            <CardDescription>
                              SEO metadata, canonical URLs, and Google Tag Manager configuration
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.seo ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      <FormInput
                        label="SEO Title"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                        hint={`Meta title for search engines (${seoSettings?.seoTitleMin || 30}-${seoSettings?.seoTitleMax || 60} chars optimal) - improves search visibility`}
                      />
                      {seoSettings && (
                        <div className="mt-1">
                          <CharacterCounter
                            current={formData.seoTitle.length}
                            min={seoSettings.seoTitleMin}
                            max={seoSettings.seoTitleMax}
                            restrict={seoSettings.seoTitleRestrict}
                            className="ml-1"
                          />
                        </div>
                      )}
                      <div>
                        <FormTextarea
                          label="SEO Description"
                          name="seoDescription"
                          value={formData.seoDescription}
                          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                          rows={3}
                          hint={`Meta description shown in search results (${seoSettings?.seoDescriptionMin || 120}-${seoSettings?.seoDescriptionMax || 160} chars) - influences click-through rate`}
                        />
                        {seoSettings && (
                          <div className="mt-1">
                            <CharacterCounter
                              current={formData.seoDescription.length}
                              min={seoSettings.seoDescriptionMin}
                              max={seoSettings.seoDescriptionMax}
                              restrict={seoSettings.seoDescriptionRestrict}
                              className="ml-1"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <FormTextarea
                          label="Organization Description"
                          name="description"
                          value={formData.description || ""}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          hint="Schema.org Organization description (separate from SEO description) - used in structured data"
                        />
                        <div className="mt-1">
                          <CharacterCounter
                            current={(formData.description || "").length}
                            min={100}
                            className="ml-1"
                          />
                        </div>
                      </div>
                      <FormInput
                        label="Canonical URL"
                        name="canonicalUrl"
                        type="url"
                        value={formData.canonicalUrl || ""}
                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                        placeholder="https://example.com/page"
                        hint="Canonical URL prevents duplicate content issues - auto-generated if not provided"
                      />
                      {/* Twitter section moved to its own card above */}
                      <FormInput
                        label="Google Tag Manager ID"
                        name="gtmId"
                        value={formData.gtmId}
                        onChange={(e) => setFormData({ ...formData, gtmId: e.target.value })}
                        placeholder="GTM-XXXXXXX"
                        hint="GTM ID allows clients to see article performance in their own Google Analytics"
                        error={
                          formData.gtmId && !/^GTM-[A-Z0-9]+$/.test(formData.gtmId)
                            ? "GTM ID must be in format GTM-XXXXXXX"
                            : undefined
                        }
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Client" : "Create Client"}
            </Button>
          </div>
        </div>

        {/* Right Column - SEO Doctor (Always Visible) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SEODoctor
              data={{
                // Start with initialData (has correct types and Media relations)
                ...initialData,
                // Override with formData values (only if they're not empty)
                name: formData.name || initialData?.name || "",
                slug: formData.slug || initialData?.slug || "",
                legalName: formData.legalName || initialData?.legalName || "",
                url: formData.url || initialData?.url || "",
                email: formData.email || initialData?.email || "",
                phone: formData.phone || initialData?.phone || "",
                seoTitle: formData.seoTitle || initialData?.seoTitle || "",
                seoDescription: formData.seoDescription || initialData?.seoDescription || "",
                businessBrief: formData.businessBrief || initialData?.businessBrief || "",
                gtmId: formData.gtmId || initialData?.gtmId || "",
                canonicalUrl: formData.canonicalUrl || initialData?.canonicalUrl || "",
                twitterCard: formData.twitterCard || initialData?.twitterCard || "",
                twitterTitle: formData.twitterTitle || initialData?.twitterTitle || "",
                twitterDescription: formData.twitterDescription || initialData?.twitterDescription || "",
                twitterSite: formData.twitterSite || initialData?.twitterSite || "",
                contactType: formData.contactType || initialData?.contactType || "",
                addressStreet: formData.addressStreet || initialData?.addressStreet || "",
                addressCity: formData.addressCity || initialData?.addressCity || "",
                addressCountry: formData.addressCountry || initialData?.addressCountry || "",
                addressPostalCode: formData.addressPostalCode || initialData?.addressPostalCode || "",
                // Convert formData arrays/strings to match expected types
                sameAs: formData.sameAs && formData.sameAs.length > 0
                  ? formData.sameAs
                  : (initialData?.sameAs || []),
                contentPriorities: formData.contentPriorities
                  ? formData.contentPriorities.split(", ").filter(Boolean)
                  : (initialData?.contentPriorities || []),
                foundingDate: formData.foundingDate
                  ? formData.foundingDate
                  : (initialData?.foundingDate ? new Date(initialData.foundingDate).toISOString().split("T")[0] : undefined),
                // Ensure Media relations are always from initialData (they're not in formData)
                logoMedia: (initialData as any)?.logoMedia,
                ogImageMedia: (initialData as any)?.ogImageMedia,
                twitterImageMedia: (initialData as any)?.twitterImageMedia,
              }}
              config={seoSettings ? createOrganizationSEOConfig(seoSettings) : createOrganizationSEOConfig()}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
