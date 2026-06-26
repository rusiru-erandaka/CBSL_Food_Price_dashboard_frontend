export type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y" | "2y" | "all";

export type ForecastModel = "moving_average" | "linear_regression";

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export interface FoodMetadata {
  food: string;
  available_markets: string[];
  available_price_types: string[];
}

export interface TrendPoint {
  date: string;
  price: number;
}

export interface FoodTrend {
  food: string;
  market: string;
  price_type: string;
  points: TrendPoint[];
}

export interface FoodStatistics {
  food: string;
  market: string;
  price_type: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  current_price: number;
  price_change_percent: number;
  volatility: number;
}

export interface ForecastPoint {
  date: string;
  predicted_price: number;
}

export interface FoodForecast {
  food: string;
  market: string;
  price_type: string;
  model: ForecastModel | string;
  forecast: ForecastPoint[];
}

export interface PriceSnapshot {
  item: string;
  price: number;
}

export interface CompareMarketsResponse {
  food: string;
  price_type: string;
  as_of: string | null;
  markets: PriceSnapshot[];
}

export interface CompareFoodsResponse {
  market: string;
  price_type: string;
  as_of: string | null;
  foods: PriceSnapshot[];
}

export interface RainfallCorrelationResponse {
  correlation: number;
}

export interface TrendQuery {
  foodName: string;
  market: string;
  priceType: string;
  timeRange: TimeRange;
}

export interface StatisticsQuery extends TrendQuery {}

export interface ForecastQuery {
  foodName: string;
  market: string;
  priceType: string;
  model: ForecastModel;
  daysAhead: number;
}

export interface CompareMarketsQuery {
  food: string;
  priceType: string;
}

export interface CompareFoodsQuery {
  market: string;
  priceType: string;
}

export interface RainfallCorrelationQuery {
  food: string;
  market: string;
  priceType: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DashboardFilterState {
  food: string;
  market: string;
  priceType: string;
  timeRange: TimeRange;
  model: ForecastModel;
}
