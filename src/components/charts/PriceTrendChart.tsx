import type { FoodTrend } from "@/types/api";
import { chartTheme } from "@/utils/chartTheme";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceTrendChartProps {
  trend: FoodTrend;
  title?: string;
  description?: string;
}

export function PriceTrendChart({
  trend,
  title = "Historical Trend",
  description = "Observed prices over time for the selected food, market, and price type.",
}: PriceTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span>{trend.food}</span>
          <span>{trend.market}</span>
          <span>{trend.price_type}</span>
        </div>
        <div className="h-[360px] w-full md:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.points} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={32}
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
                cursor={{ stroke: chartTheme.cursor, strokeDasharray: "4 4" }}
                formatter={(value: number) => [formatCurrency(value), "Price"]}
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
              <Legend wrapperStyle={{ color: chartTheme.axis }} />
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke={chartTheme.primaryLine}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Brush
                dataKey="date"
                height={26}
                stroke={chartTheme.secondaryLine}
                tickFormatter={(value) => formatDate(value, { month: "short", day: "numeric" })}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
