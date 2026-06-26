import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchFoodStatistics } from "@/api/foodApi";
import type { StatisticsQuery } from "@/types/api";
import { queryKeys } from "@/utils/queryKeys";

export function useStatistics(query: StatisticsQuery) {
  return useQuery({
    queryKey: queryKeys.statistics(query),
    queryFn: () => fetchFoodStatistics(query),
    enabled: Boolean(query.foodName && query.market && query.priceType),
    placeholderData: keepPreviousData,
  });
}
