"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { runSeed, testOpenAI } from "../actions/seed-actions";

const MIN_ARTICLES = 10;
const MAX_ARTICLES = 300;

export function SeedForm() {
  const { toast } = useToast();
  const [articleCount, setArticleCount] = useState<number>(70);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }
    setProgress(10);
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 90) return current;
        return current + 10;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning]);

  const isDev = process.env.NODE_ENV === "development";

  const distributions = useMemo(() => {
    const total = Math.min(Math.max(articleCount || 0, MIN_ARTICLES), MAX_ARTICLES);

    const published = Math.round(total * 0.6);
    const draft = Math.round(total * 0.25);
    const writing = Math.round(total * 0.1);
    const scheduled = total - (published + draft + writing);

    const shortCount = Math.round(total * 0.3);
    const mediumCount = Math.round(total * 0.4);
    const longCount = total - (shortCount + mediumCount);

    return {
      total,
      statuses: { published, draft, writing, scheduled },
      lengths: { short: shortCount, medium: mediumCount, long: longCount },
    };
  }, [articleCount]);

  const handleRunSeed = async () => {
    if (!isDev) {
      toast({
        title: "Not available in this environment",
        description: "The seeding UI is only enabled in development.",
        variant: "destructive",
      });
      return;
    }

    if (!articleCount || articleCount < MIN_ARTICLES || articleCount > MAX_ARTICLES) {
      toast({
        title: "Invalid article count",
        description: `Please enter a value between ${MIN_ARTICLES} and ${MAX_ARTICLES}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRunning(true);
      const result = await runSeed({ articleCount: distributions.total, useOpenAI });

      if (result?.success) {
        toast({
          title: "Seed completed",
          description:
            result.message ??
            `Cleared DB and seeded ${distributions.total} articles (${distributions.statuses.published} published, ${distributions.statuses.draft} draft).`,
        });
      } else {
        toast({
          title: "Failed to trigger seed",
          description: result?.error ?? "Unknown error while starting the seed process.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while starting the seed process.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {!isDev && (
        <Alert variant="destructive">
          <AlertTitle>Dev only</AlertTitle>
          <AlertDescription>
            Database seeding can only be configured and triggered in the development environment.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Article Seeding</CardTitle>
          <CardDescription>
            Choose how many SEO articles to generate. This will clear the current development database and reseed it
            with realistic data using the distribution shown below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-sm font-medium" htmlFor="article-count">
              Number of articles
            </label>
            <Input
              id="article-count"
              type="number"
              min={MIN_ARTICLES}
              max={MAX_ARTICLES}
              value={articleCount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (Number.isNaN(value)) {
                  setArticleCount(MIN_ARTICLES);
                  return;
                }
                setArticleCount(value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Recommended between {MIN_ARTICLES} and {MAX_ARTICLES} for fast local testing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useOpenAI"
                checked={useOpenAI}
                onCheckedChange={(checked) => setUseOpenAI(checked === true)}
              />
              <label htmlFor="useOpenAI" className="text-sm">
                Use OpenAI to generate realistic content (requires OPENAI_API_KEY)
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              When enabled, article content and SEO fields will be generated using OpenAI. If it fails, the seed will
              fall back to local templates.
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isTestingOpenAI}
                onClick={async () => {
                  setIsTestingOpenAI(true);
                  try {
                    const result = await testOpenAI();
                    if (result.success) {
                      toast({
                        title: "OpenAI test succeeded",
                        description: "The API key is valid and OpenAI responded successfully.",
                      });
                    } else {
                      toast({
                        title: "OpenAI test failed",
                        description: result.error ?? "Unknown error while testing OpenAI.",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "OpenAI test error",
                      description: "Unexpected error while testing OpenAI.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsTestingOpenAI(false);
                  }
                }}
              >
                {isTestingOpenAI ? "Testing..." : "Test OpenAI"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status distribution
              </p>
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{distributions.total}</span>
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Published:</span> {distributions.statuses.published}
                </li>
                <li>
                  <span className="font-medium text-foreground">Draft:</span> {distributions.statuses.draft}
                </li>
                <li>
                  <span className="font-medium text-foreground">Writing:</span> {distributions.statuses.writing}
                </li>
                <li>
                  <span className="font-medium text-foreground">Scheduled:</span> {distributions.statuses.scheduled}
                </li>
              </ul>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Length distribution
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Short:</span> {distributions.lengths.short}
                </li>
                <li>
                  <span className="font-medium text-foreground">Medium:</span> {distributions.lengths.medium}
                </li>
                <li>
                  <span className="font-medium text-foreground">Long:</span> {distributions.lengths.long}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
              {isRunning && (
                <div className="w-full md:w-48">
                  <Progress value={progress} />
                </div>
              )}
              <Button type="button" onClick={handleRunSeed} disabled={isRunning || !isDev}>
                {isRunning ? "Running seed..." : "Run Seed"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

