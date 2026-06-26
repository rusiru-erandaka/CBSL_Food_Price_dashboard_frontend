import { apiClient } from "@/api/client";
import type {
  CompareFoodsQuery,
  CompareFoodsResponse,
  CompareMarketsQuery,
  CompareMarketsResponse,
  FoodForecast,
  FoodMetadata,
  FoodStatistics,
  FoodTrend,
  ForecastQuery,
  RainfallCorrelationQuery,
  RainfallCorrelationResponse,
  StatisticsQuery,
  TrendQuery,
} from "@/types/api";

interface FoodsResponse {
  foods: string[];
}

interface MarketsResponse {
  markets: string[];
}

interface PriceTypesResponse {
  price_types: string[];
}

const foodPath = (foodName: string) => `/api/v1/foods/${encodeURIComponent(foodName)}`;

export async function fetchFoods() {
  const response = await apiClient.get<FoodsResponse>("/api/v1/foods");
  return response.data.foods;
}

export async function fetchMarkets() {
  const response = await apiClient.get<MarketsResponse>("/api/v1/markets");
  return response.data.markets;
}

export async function fetchPriceTypes() {
  const response = await apiClient.get<PriceTypesResponse>("/api/v1/price-types");
  return response.data.price_types;
}

export async function fetchFoodMetadata(foodName: string) {
  const response = await apiClient.get<FoodMetadata>(foodPath(foodName));
  return response.data;
}

export async function fetchFoodTrend(query: TrendQuery) {
  const response = await apiClient.get<FoodTrend>(`${foodPath(query.foodName)}/trends`, {
    params: {
      market: query.market,
      price_type: query.priceType,
      time_range: query.timeRange,
    },
  });

  return response.data;
}

export async function fetchFoodStatistics(query: StatisticsQuery) {
  const response = await apiClient.get<FoodStatistics>(
    `${foodPath(query.foodName)}/statistics`,
    {
      params: {
        market: query.market,
        price_type: query.priceType,
        time_range: query.timeRange,
      },
    },
  );

  return response.data;
}

export async function fetchFoodForecast(query: ForecastQuery) {
  const response = await apiClient.get<FoodForecast>(`${foodPath(query.foodName)}/forecast`, {
    params: {
      market: query.market,
      price_type: query.priceType,
      model: query.model,
      days_ahead: query.daysAhead,
    },
  });

  return response.data;
}

export async function fetchCompareMarkets(query: CompareMarketsQuery) {
  const response = await apiClient.get<CompareMarketsResponse>("/api/v1/compare-markets", {
    params: {
      food: query.food,
      price_type: query.priceType,
    },
  });

  return response.data;
}

export async function fetchCompareFoods(query: CompareFoodsQuery) {
  const response = await apiClient.get<CompareFoodsResponse>("/api/v1/compare-foods", {
    params: {
      market: query.market,
      price_type: query.priceType,
    },
  });

  return response.data;
}

export async function fetchRainfallCorrelation(query: RainfallCorrelationQuery) {
  const response = await apiClient.get<RainfallCorrelationResponse>(
    "/api/v1/rainfall-correlation",
    {
      params: {
        food: query.food,
        market: query.market,
        price_type: query.priceType,
      },
    },
  );

  return response.data;
}
