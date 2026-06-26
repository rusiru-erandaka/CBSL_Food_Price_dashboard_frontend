import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Gauge,
  Landmark,
  Sigma,
} from "lucide-react";
import type { FoodStatistics } from "@/types/api";
import { formatChangeDirection, formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsCardsProps {
  statistics: FoodStatistics;
}

const metrics = [
  {
    key: "current_price",
    label: "Current Price",
    description: "Latest observed market price",
    icon: Landmark,
    formatter: formatCurrency,
  },
  {
    key: "avg_price",
    label: "Average Price",
    description: "Mean price across the selected window",
    icon: BarChart3,
    formatter: formatCurrency,
  },
  {
    key: "min_price",
    label: "Minimum Price",
    description: "Lowest recorded price in range",
    icon: ArrowDownRight,
    formatter: formatCurrency,
  },
  {
    key: "max_price",
    label: "Maximum Price",
    description: "Highest recorded price in range",
    icon: ArrowUpRight,
    formatter: formatCurrency,
  },
  {
    key: "price_change_percent",
    label: "Price Change",
    description: "Change versus the start of the selected range",
    icon: Sigma,
    formatter: formatPercent,
  },
  {
    key: "volatility",
    label: "Volatility",
    description: "Standard deviation across observations",
    icon: Gauge,
    formatter: formatNumber,
  },
] as const;

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const direction = formatChangeDirection(statistics.price_change_percent);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = statistics[metric.key];

        return (
          <Card key={metric.key}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">
                    {metric.formatter(value)}
                    {metric.key === "volatility" ? (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">LKR</span>
                    ) : null}
                  </CardTitle>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{metric.description}</p>
              {metric.key === "price_change_percent" ? (
                <p
                  className={`mt-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                    direction === "up"
                      ? "text-emerald-600"
                      : direction === "down"
                        ? "text-rose-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {direction === "up"
                    ? "Acceleration"
                    : direction === "down"
                      ? "Cooling"
                      : "Stable"}
                </p>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
