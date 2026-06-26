import { useEffect } from "react";
import { ArrowLeft, Orbit } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { CorrelationCard } from "@/components/cards/CorrelationCard";
import { StatisticsCards } from "@/components/cards/StatisticsCards";
import { CompareMarketsChart } from "@/components/charts/CompareMarketsChart";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { DashboardFilters } from "@/components/filters/DashboardFilters";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompareMarkets, useRainfallCorrelation } from "@/hooks/useAnalytics";
import { useForecast } from "@/hooks/useForecast";
import { useFoodMetadata } from "@/hooks/useFoods";
import { useStatistics } from "@/hooks/useStatistics";
import { useTrend } from "@/hooks/useTrend";
import type { DashboardFilterState, ForecastModel, TimeRange } from "@/types/api";
import {
  DEFAULT_FORECAST_DAYS_AHEAD,
  DEFAULT_FORECAST_MODEL,
  FORECAST_MODEL_OPTIONS,
  DEFAULT_TIME_RANGE,
  getTimeRangeLabel,
  isValidForecastModel,
  isValidTimeRange,
} from "@/utils/filters";

export function FoodDetailsPage() {
  const { foodName } = useParams();
  const decodedFoodName = decodeURIComponent(foodName ?? "");
  const [searchParams, setSearchParams] = useSearchParams();

  const metadataQuery = useFoodMetadata(decodedFoodName);
  const metadata = metadataQuery.data;

  const availableMarkets = metadata?.available_markets ?? [];
  const availablePriceTypes = metadata?.available_price_types ?? [];

  useEffect(() => {
    if (!decodedFoodName || !metadata) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    let changed = false;

    if (searchParams.get("food") !== decodedFoodName) {
      nextParams.set("food", decodedFoodName);
      changed = true;
    }

    const market = searchParams.get("market");
    if ((!market || !availableMarkets.includes(market)) && availableMarkets[0]) {
      nextParams.set("market", availableMarkets[0]);
      changed = true;
    }

    const priceType = searchParams.get("priceType");
    if ((!priceType || !availablePriceTypes.includes(priceType)) && availablePriceTypes[0]) {
      nextParams.set("priceType", availablePriceTypes[0]);
      changed = true;
    }

    const timeRange = searchParams.get("timeRange");
    if (!isValidTimeRange(timeRange)) {
      nextParams.set("timeRange", DEFAULT_TIME_RANGE);
      changed = true;
    }

    const model = searchParams.get("model");
    if (!isValidForecastModel(model)) {
      nextParams.set("model", DEFAULT_FORECAST_MODEL);
      changed = true;
    }

    if (changed) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    decodedFoodName,
    metadata,
    availableMarkets,
    availablePriceTypes,
    searchParams,
    setSearchParams,
  ]);

  const selectedMarket = availableMarkets.includes(searchParams.get("market") ?? "")
    ? (searchParams.get("market") as string)
    : availableMarkets[0] ?? "";
  const selectedPriceType = availablePriceTypes.includes(searchParams.get("priceType") ?? "")
    ? (searchParams.get("priceType") as string)
    : availablePriceTypes[0] ?? "";
  const selectedTimeRange = isValidTimeRange(searchParams.get("timeRange"))
    ? (searchParams.get("timeRange") as TimeRange)
    : DEFAULT_TIME_RANGE;
  const selectedModel = isValidForecastModel(searchParams.get("model"))
    ? (searchParams.get("model") as ForecastModel)
    : DEFAULT_FORECAST_MODEL;

  const filterState: DashboardFilterState = {
    food: decodedFoodName,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
    model: selectedModel,
  };

  const trendQuery = useTrend({
    foodName: decodedFoodName,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
  });

  const statisticsQuery = useStatistics({
    foodName: decodedFoodName,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
  });

  const forecastQuery = useForecast({
    foodName: decodedFoodName,
    market: selectedMarket,
    priceType: selectedPriceType,
    model: selectedModel,
    daysAhead: DEFAULT_FORECAST_DAYS_AHEAD,
  });

  const compareMarketsQuery = useCompareMarkets({
    food: decodedFoodName,
    priceType: selectedPriceType,
  });

  const rainfallQuery = useRainfallCorrelation({
    food: decodedFoodName,
    market: selectedMarket,
    priceType: selectedPriceType,
  });

  const updateFilters = (patch: Partial<DashboardFilterState>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      nextParams.set(key, value);
    });

    setSearchParams(nextParams, { replace: true });
  };

  if (!decodedFoodName) {
    return (
      <PageContainer>
        <ErrorState
          title="Food not specified"
          message="The detail page requires a food name in the route."
        />
      </PageContainer>
    );
  }

  if (metadataQuery.isLoading && !metadata) {
    return (
      <PageContainer>
        <LoadingState title="Loading food metadata" lines={5} />
      </PageContainer>
    );
  }

  if (metadataQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Food metadata unavailable"
          message={metadataQuery.error.message}
          onRetry={() => metadataQuery.refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8">
      <section className="space-y-5">
        <Button variant="ghost" asChild className="pl-0 text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Orbit className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <CardTitle className="text-3xl md:text-4xl">{decodedFoodName}</CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-base leading-7">
                  Detailed analysis for one food category, including metadata, historical trends,
                  forecasts, and market-level dispersion.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{availableMarkets.length} markets</Badge>
                <Badge variant="secondary">{availablePriceTypes.length} price types</Badge>
                <Badge variant="outline">{getTimeRangeLabel(selectedTimeRange)}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Available Markets
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {availableMarkets.join(", ") || "No markets available"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Available Price Types
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {availablePriceTypes.join(", ") || "No price types available"}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Focus
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Public price analysis for {decodedFoodName} across markets and forecast models.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <DashboardFilters
        value={filterState}
        foodOptions={[{ label: decodedFoodName, value: decodedFoodName }]}
        marketOptions={availableMarkets.map((market) => ({ label: market, value: market }))}
        priceTypeOptions={availablePriceTypes.map((priceType) => ({
          label: priceType[0].toUpperCase() + priceType.slice(1),
          value: priceType,
        }))}
        onChange={updateFilters}
        showFoodSelector={false}
        foodLocked
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Statistics</h2>
          <p className="text-sm text-muted-foreground">
            Descriptive summary for {decodedFoodName} under the current filters.
          </p>
        </div>
        {statisticsQuery.isLoading && !statisticsQuery.data ? (
          <LoadingState title="Loading statistics" lines={6} />
        ) : statisticsQuery.isError ? (
          <ErrorState
            title="Statistics unavailable"
            message={statisticsQuery.error.message}
            onRetry={() => statisticsQuery.refetch()}
          />
        ) : statisticsQuery.data ? (
          <StatisticsCards statistics={statisticsQuery.data} />
        ) : (
          <EmptyState />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historical Trend</h2>
          <p className="text-sm text-muted-foreground">
            Detailed time-series view for {decodedFoodName} in {selectedMarket}.
          </p>
        </div>
        {trendQuery.isLoading && !trendQuery.data ? (
          <LoadingState title="Loading historical trend" lines={5} />
        ) : trendQuery.isError ? (
          <ErrorState
            title="Trend data unavailable"
            message={trendQuery.error.message}
            onRetry={() => trendQuery.refetch()}
          />
        ) : trendQuery.data?.points.length ? (
          <PriceTrendChart
            trend={trendQuery.data}
            title="Historical Price Trend"
            description="The primary analytical view for this food category."
          />
        ) : (
          <EmptyState />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Forecast</h2>
              <p className="text-sm text-muted-foreground">
                Model-based projection overlaid on the historical series.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FORECAST_MODEL_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedModel === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilters({ model: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          {forecastQuery.isLoading && !forecastQuery.data ? (
            <LoadingState title="Loading forecast" lines={4} />
          ) : forecastQuery.isError ? (
            <ErrorState
              title="Forecast unavailable"
              message={forecastQuery.error.message}
              onRetry={() => forecastQuery.refetch()}
            />
          ) : forecastQuery.data && trendQuery.data ? (
            <ForecastChart
              actualPoints={trendQuery.data.points}
              forecastPoints={forecastQuery.data.forecast}
              model={forecastQuery.data.model}
              daysAhead={DEFAULT_FORECAST_DAYS_AHEAD}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        {rainfallQuery.isLoading && !rainfallQuery.data ? (
          <LoadingState title="Loading rainfall signal" lines={3} />
        ) : rainfallQuery.isError ? (
          <ErrorState
            title="Rainfall signal unavailable"
            message={rainfallQuery.error.message}
            onRetry={() => rainfallQuery.refetch()}
          />
        ) : rainfallQuery.data ? (
          <CorrelationCard correlation={rainfallQuery.data.correlation} />
        ) : (
          <EmptyState message="No rainfall relationship could be derived for this filter set." />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Latest price dispersion across all markets for {decodedFoodName}.
          </p>
        </div>
        {compareMarketsQuery.isLoading && !compareMarketsQuery.data ? (
          <LoadingState title="Loading market comparison" lines={5} />
        ) : compareMarketsQuery.isError ? (
          <ErrorState
            title="Market comparison unavailable"
            message={compareMarketsQuery.error.message}
            onRetry={() => compareMarketsQuery.refetch()}
          />
        ) : compareMarketsQuery.data?.markets.length ? (
          <CompareMarketsChart
            food={compareMarketsQuery.data.food}
            priceType={compareMarketsQuery.data.price_type}
            asOf={compareMarketsQuery.data.as_of}
            data={compareMarketsQuery.data.markets}
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </PageContainer>
  );
}
