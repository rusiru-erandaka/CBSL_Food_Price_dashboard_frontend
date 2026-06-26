import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCompareFoods, fetchCompareMarkets, fetchRainfallCorrelation } from "@/api/foodApi";
import type {
  CompareFoodsQuery,
  CompareMarketsQuery,
  RainfallCorrelationQuery,
} from "@/types/api";
import { queryKeys } from "@/utils/queryKeys";

export function useCompareMarkets(query: CompareMarketsQuery) {
  return useQuery({
    queryKey: queryKeys.compareMarkets(query),
    queryFn: () => fetchCompareMarkets(query),
    enabled: Boolean(query.food && query.priceType),
    placeholderData: keepPreviousData,
  });
}

export function useCompareFoods(query: CompareFoodsQuery) {
  return useQuery({
    queryKey: queryKeys.compareFoods(query),
    queryFn: () => fetchCompareFoods(query),
    enabled: Boolean(query.market && query.priceType),
    placeholderData: keepPreviousData,
  });
}

export function useRainfallCorrelation(query: RainfallCorrelationQuery) {
  return useQuery({
    queryKey: queryKeys.rainfallCorrelation(query),
    queryFn: () => fetchRainfallCorrelation(query),
    enabled: Boolean(query.food && query.market && query.priceType),
    placeholderData: keepPreviousData,
  });
}
