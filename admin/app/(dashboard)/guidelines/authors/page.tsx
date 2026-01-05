"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  Target,
  CheckCircle2,
  Info,
  ArrowLeft,
  Award,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

export default function AuthorsGuidelinesPage() {
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
        <h1 className="text-3xl font-semibold">Author Guidelines</h1>
        <p className="text-muted-foreground">
          E-E-A-T requirements, profile optimization, credentials, and author page SEO best practices.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Author Profile Optimization</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Build trust and authority with comprehensive author profiles
                </p>
              </div>
            </div>

            <Tabs defaultValue="e-e-a-t" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="e-e-a-t">E-E-A-T</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="e-e-a-t" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4 text-sm">E-E-A-T Requirements (Google Quality Guidelines)</h4>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-blue-600" />
                          <h5 className="font-medium">Expertise</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>List relevant credentials and qualifications</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Include years of experience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Specify areas of specialization</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                          <h5 className="font-medium">Authoritativeness</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Link to professional profiles (LinkedIn, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Include published works or portfolio</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Show industry recognition or awards</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          <h5 className="font-medium">Trustworthiness</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Use professional profile photo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Provide accurate contact information</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Maintain consistent online presence</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4 text-sm">Profile Requirements</h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Profile Image:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li><strong>Dimensions:</strong> 400×400px (square, 1:1 ratio)</li>
                          <li><strong>Format:</strong> JPG or PNG, under 100KB</li>
                          <li><strong>Style:</strong> Professional headshot, clear face, good lighting</li>
                          <li><strong>Alt Text:</strong> "Author Name Profile Photo"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Bio & Description:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Minimum 150 words for comprehensive profile</li>
                          <li>Include professional background and expertise</li>
                          <li>Mention relevant achievements and credentials</li>
                          <li>Use natural language, avoid keyword stuffing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4 text-sm">Schema.org Person Structured Data</h4>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Author profiles automatically include Schema.org Person JSON-LD. Key properties:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>name:</strong> Author's full name</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>jobTitle:</strong> Professional title/role</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>worksFor:</strong> Organization/Client reference</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>sameAs:</strong> Social profile URLs (LinkedIn, Twitter, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span><strong>knowsAbout:</strong> Areas of expertise/topics</span>
                        </li>
                      </ul>
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
