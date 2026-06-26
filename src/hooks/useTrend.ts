import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchFoodTrend } from "@/api/foodApi";
import type { TrendQuery } from "@/types/api";
import { queryKeys } from "@/utils/queryKeys";

export function useTrend(query: TrendQuery) {
  return useQuery({
    queryKey: queryKeys.trend(query),
    queryFn: () => fetchFoodTrend(query),
    enabled: Boolean(query.foodName && query.market && query.priceType),
    placeholderData: keepPreviousData,
  });
}
