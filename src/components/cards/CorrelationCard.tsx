import { CloudRain, TrendingDown, TrendingUp } from "lucide-react";
import { getCorrelationStrength } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CorrelationCardProps {
  correlation: number;
}

export function CorrelationCard({ correlation }: CorrelationCardProps) {
  const strength = getCorrelationStrength(correlation);
  const direction = correlation >= 0 ? "positive" : "negative";
  const DirectionIcon = correlation >= 0 ? TrendingUp : TrendingDown;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CloudRain className="h-5 w-5" />
          </div>
          <Badge variant="secondary">{strength} correlation</Badge>
        </div>
        <CardTitle>Rainfall Correlation</CardTitle>
        <CardDescription>
          Pearson correlation between the selected price series and rainfall overlap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-extrabold tracking-tight">{correlation.toFixed(2)}</span>
          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
            <DirectionIcon className="h-4 w-4" />
            <span className="capitalize">{direction} relationship</span>
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {strength === "Strong"
            ? "Rainfall and food prices are moving together in a pronounced way for this filter set."
            : strength === "Moderate"
              ? "Rainfall appears to have a noticeable, but not dominant, relationship with prices."
              : "Rainfall has only a limited observable relationship with this price series."}
        </p>
      </CardContent>
    </Card>
  );
}
