"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Building2,
  Target,
  CheckCircle2,
  Info,
  ArrowLeft,
  Image as ImageIcon,
  Globe,
  Settings,
} from "lucide-react";

export default function ClientsGuidelinesPage() {
  return (
    <div className="container mx-auto max-w-[1128px] space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/guidelines">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guidelines
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Client Guidelines</h1>
        <p className="text-muted-foreground">
          Organization setup, branding, logo requirements, GTM integration, and Schema.org Organization optimization.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Client/Organization Setup</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete guide for setting up client organizations with optimal SEO and branding
                </p>
              </div>
            </div>

            <Tabs defaultValue="branding" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
              </TabsList>

              <TabsContent value="branding" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Logo Requirements</h4>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Dimensions & Format:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li><strong>Recommended:</strong> 512×512px (square) or 800×200px (horizontal)</li>
                          <li><strong>Format:</strong> PNG with transparency (preferred) or SVG</li>
                          <li><strong>File Size:</strong> Under 100KB for web performance</li>
                          <li><strong>Alt Text:</strong> "Company Name Logo" or "Brand Name Logo"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">OG Image (Default):</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li><strong>Dimensions:</strong> 1200×630px (required for social sharing)</li>
                          <li><strong>Format:</strong> JPG or PNG, under 300KB</li>
                          <li><strong>Purpose:</strong> Default image for all articles if no featured image</li>
                          <li><strong>Design:</strong> Include brand colors and logo</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">SEO Requirements</h4>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Required Fields:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Name:</strong> Official organization name
                              <p className="text-xs text-muted-foreground mt-1">
                                Used in Schema.org Organization schema
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Slug:</strong> SEO-friendly URL (auto-generated from name)
                              <p className="text-xs text-muted-foreground mt-1">
                                Example: "company-name" not "Company Name"
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>SEO Description:</strong> 150-160 characters
                              <p className="text-xs text-muted-foreground mt-1">
                                Meta description for organization pages
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4 text-sm">Schema.org Organization Structured Data</h4>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Client profiles automatically include Schema.org Organization JSON-LD. Key properties:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>name:</strong> Organization name</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>legalName:</strong> Legal business name (if different)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>url:</strong> Organization website URL</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>logo:</strong> Logo image URL</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>sameAs:</strong> Social profile URLs (LinkedIn, Twitter, Facebook)</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integration" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">GTM Integration</h4>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Google Tag Manager:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li><strong>GTM ID:</strong> Format: GTM-XXXXXXX</li>
                          <li>Enables advanced tracking and analytics</li>
                          <li>Allows client-specific tracking configurations</li>
                          <li>Required for multi-client analytics setup</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
