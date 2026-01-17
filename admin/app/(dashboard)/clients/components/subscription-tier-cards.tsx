"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";

interface Tier {
  value: string;
  name: string;
  price: number;
  articlesPerMonth: number;
  popular?: boolean;
}

interface SubscriptionTierCardsProps {
  selectedTier?: string;
  onSelect: (tier: string) => void;
  tiers?: Tier[];
}

export function SubscriptionTierCards({ selectedTier, onSelect, tiers = [] }: SubscriptionTierCardsProps) {
  const [selectedTierDetails, setSelectedTierDetails] = useState<Tier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  const handleInfoClick = (e: React.MouseEvent, tier: Tier) => {
    e.stopPropagation();
    setSelectedTierDetails(tier);
    setDialogOpen(true);
  };

  if (tiers.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading subscription tiers...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.value;

          return (
            <Card
              key={tier.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => onSelect(tier.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{tier.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleInfoClick(e, tier)}
                    >
                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTierDetails?.name} Package
            </DialogTitle>
            <DialogDescription>
              Complete package details and specifications
            </DialogDescription>
          </DialogHeader>
          {selectedTierDetails && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatPrice(selectedTierDetails.price)}</span>
                  <span className="text-sm text-muted-foreground">SAR/year</span>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Articles Per Month</span>
                  <span className="text-sm font-semibold">{selectedTierDetails.articlesPerMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Package Type</span>
                  <span className="text-sm font-semibold">{selectedTierDetails.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Billing Period</span>
                  <span className="text-sm font-semibold">Annual</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
