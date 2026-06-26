import { useQuery } from "@tanstack/react-query";
import {
  fetchFoodMetadata,
  fetchFoods,
  fetchMarkets,
  fetchPriceTypes,
} from "@/api/foodApi";
import { queryKeys } from "@/utils/queryKeys";

export function useFoods() {
  return useQuery({
    queryKey: queryKeys.foods,
    queryFn: fetchFoods,
    staleTime: 1000 * 60 * 60,
  });
}

export function useMarkets() {
  return useQuery({
    queryKey: queryKeys.markets,
    queryFn: fetchMarkets,
    staleTime: 1000 * 60 * 60,
  });
}

export function usePriceTypes() {
  return useQuery({
    queryKey: queryKeys.priceTypes,
    queryFn: fetchPriceTypes,
    staleTime: 1000 * 60 * 60,
  });
}

export function useFoodMetadata(foodName: string) {
  return useQuery({
    queryKey: queryKeys.foodMetadata(foodName),
    queryFn: () => fetchFoodMetadata(foodName),
    enabled: Boolean(foodName),
    staleTime: 1000 * 60 * 10,
  });
}
