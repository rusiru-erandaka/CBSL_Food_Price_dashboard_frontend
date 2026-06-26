import type {
  CompareFoodsQuery,
  CompareMarketsQuery,
  ForecastQuery,
  RainfallCorrelationQuery,
  StatisticsQuery,
  TrendQuery,
} from "@/types/api";

export const queryKeys = {
  foods: ["foods"] as const,
  markets: ["markets"] as const,
  priceTypes: ["price-types"] as const,
  foodMetadata: (foodName: string) => ["food-metadata", foodName] as const,
  trend: (query: TrendQuery) => ["trend", query] as const,
  statistics: (query: StatisticsQuery) => ["statistics", query] as const,
  forecast: (query: ForecastQuery) => ["forecast", query] as const,
  compareMarkets: (query: CompareMarketsQuery) => ["compare-markets", query] as const,
  compareFoods: (query: CompareFoodsQuery) => ["compare-foods", query] as const,
  rainfallCorrelation: (query: RainfallCorrelationQuery) =>
    ["rainfall-correlation", query] as const,
};
