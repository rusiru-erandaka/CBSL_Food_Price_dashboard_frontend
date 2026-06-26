import type { PriceSnapshot } from "@/types/api";
import { chartTheme } from "@/utils/chartTheme";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CompareMarketsChartProps {
  food: string;
  priceType: string;
  asOf: string | null;
  data: PriceSnapshot[];
}

export function CompareMarketsChart({
  food,
  priceType,
  asOf,
  data,
}: CompareMarketsChartProps) {
  const sorted = [...data].sort((left, right) => right.price - left.price);
  const chartHeight = Math.max(280, sorted.length * 52);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Markets</CardTitle>
        <CardDescription>
          Latest {priceType} prices for {food}
          {asOf ? ` as of ${formatDate(asOf)}` : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical" margin={{ top: 10, right: 20, left: 16, bottom: 0 }}>
              <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: chartTheme.axis, fontSize: 12 }}
                tickFormatter={(value: number) => formatCompactCurrency(value)}
              />
              <YAxis
                dataKey="item"
                type="category"
                tickLine={false}
                axisLine={false}
                width={96}
                tick={{ fill: chartTheme.axis, fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Price"]}
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
              <Bar dataKey="price" fill={chartTheme.bar} radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
