"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Tier {
  value: string;
  name: string;
  price: string;
  articlesPerMonth: number;
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    value: "BASIC",
    name: "Basic",
    price: "2,499",
    articlesPerMonth: 2,
  },
  {
    value: "STANDARD",
    name: "Standard",
    price: "3,999",
    articlesPerMonth: 4,
    popular: true,
  },
  {
    value: "PRO",
    name: "Pro",
    price: "6,999",
    articlesPerMonth: 8,
  },
  {
    value: "PREMIUM",
    name: "Premium",
    price: "9,999",
    articlesPerMonth: 12,
  },
];

interface SubscriptionTierCardsProps {
  selectedTier?: string;
  onSelect: (tier: string) => void;
}

export function SubscriptionTierCards({ selectedTier, onSelect }: SubscriptionTierCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => {
        const isSelected = selectedTier === tier.value;

        return (
          <Card
            key={tier.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            } ${tier.popular ? "border-primary/30" : ""}`}
            onClick={() => onSelect(tier.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  {tier.popular && (
                    <span className="text-xs text-primary font-medium mt-1 block">
                      Most Popular
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">SAR/year</span>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{tier.articlesPerMonth}</span>{" "}
                    articles/month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
