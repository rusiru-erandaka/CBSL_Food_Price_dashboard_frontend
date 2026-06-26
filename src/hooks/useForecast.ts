import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchFoodForecast } from "@/api/foodApi";
import type { ForecastQuery } from "@/types/api";
import { queryKeys } from "@/utils/queryKeys";

export function useForecast(query: ForecastQuery) {
  return useQuery({
    queryKey: queryKeys.forecast(query),
    queryFn: () => fetchFoodForecast(query),
    enabled: Boolean(query.foodName && query.market && query.priceType && query.model),
    placeholderData: keepPreviousData,
  });
}
