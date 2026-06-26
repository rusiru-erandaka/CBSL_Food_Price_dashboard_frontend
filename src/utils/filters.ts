import type { ForecastModel, SelectOption, TimeRange } from "@/types/api";

export const TIME_RANGE_OPTIONS: Array<SelectOption & { value: TimeRange }> = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "2 Years", value: "2y" },
  { label: "All Time", value: "all" },
];

export const FORECAST_MODEL_OPTIONS: Array<SelectOption & { value: ForecastModel }> = [
  { label: "Moving Average", value: "moving_average" },
  { label: "Linear Regression", value: "linear_regression" },
];

export const DEFAULT_TIME_RANGE: TimeRange = "30d";
export const DEFAULT_FORECAST_MODEL: ForecastModel = "moving_average";
export const DEFAULT_FORECAST_DAYS_AHEAD = 30;

export function isValidTimeRange(value: string | null): value is TimeRange {
  return TIME_RANGE_OPTIONS.some((option) => option.value === value);
}

export function isValidForecastModel(value: string | null): value is ForecastModel {
  return FORECAST_MODEL_OPTIONS.some((option) => option.value === value);
}

export function getTimeRangeLabel(value: TimeRange) {
  return TIME_RANGE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getForecastModelLabel(value: ForecastModel | string) {
  return FORECAST_MODEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
