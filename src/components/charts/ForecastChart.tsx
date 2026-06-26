import { useMemo } from "react";
import type { ForecastPoint, TrendPoint } from "@/types/api";
import { chartTheme } from "@/utils/chartTheme";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/format";
import { getForecastModelLabel } from "@/utils/filters";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ForecastChartProps {
  actualPoints: TrendPoint[];
  forecastPoints: ForecastPoint[];
  model: string;
  daysAhead: number;
}

export function ForecastChart({
  actualPoints,
  forecastPoints,
  model,
  daysAhead,
}: ForecastChartProps) {
  const data = useMemo(() => {
    const map = new Map<
      string,
      { date: string; actualPrice?: number; forecastPrice?: number }
    >();

    actualPoints.forEach((point) => {
      map.set(point.date, {
        date: point.date,
        actualPrice: point.price,
      });
    });

    forecastPoints.forEach((point) => {
      const existing = map.get(point.date);

      map.set(point.date, {
        date: point.date,
        actualPrice: existing?.actualPrice,
        forecastPrice: point.predicted_price,
      });
    });

    return Array.from(map.values()).sort((left, right) => left.date.localeCompare(right.date));
  }, [actualPoints, forecastPoints]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Forecast</CardTitle>
            <CardDescription>
              Historical data overlaid with a {daysAhead}-day forward projection.
            </CardDescription>
          </div>
          <Badge variant="secondary">{getForecastModelLabel(model)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tick={{ fill: chartTheme.axis, fontSize: 12 }}
                tickFormatter={(value) => formatDate(value, { month: "short", day: "numeric" })}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={86}
                tick={{ fill: chartTheme.axis, fontSize: 12 }}
                tickFormatter={(value: number) => formatCompactCurrency(value)}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "actualPrice" ? "Historical" : "Forecast",
                ]}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: chartTheme.tooltipBackground,
                  borderRadius: "16px",
                  borderColor: chartTheme.tooltipBorder,
                  color: chartTheme.tooltipText,
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                }}
                labelStyle={{ color: chartTheme.tooltipText }}
                itemStyle={{ color: chartTheme.tooltipText }}
              />
              <Legend
                wrapperStyle={{ color: chartTheme.axis }}
                formatter={(value) =>
                  value === "actualPrice" ? "Historical price" : "Forecast price"
                }
              />
              <Line
                type="monotone"
                dataKey="actualPrice"
                name="actualPrice"
                stroke={chartTheme.actualLine}
                strokeWidth={2.2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecastPrice"
                name="forecastPrice"
                stroke={chartTheme.forecastLine}
                strokeWidth={2.2}
                strokeDasharray="6 6"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
