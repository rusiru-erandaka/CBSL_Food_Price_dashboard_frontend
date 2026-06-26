import { useEffect, useMemo } from "react";
import { ArrowRight, Clock3, Database, LineChart, MapPinned } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompareMarkets, useRainfallCorrelation } from "@/hooks/useAnalytics";
import { useForecast } from "@/hooks/useForecast";
import { useFoods, useMarkets, usePriceTypes } from "@/hooks/useFoods";
import { useStatistics } from "@/hooks/useStatistics";
import { useTrend } from "@/hooks/useTrend";
import type { DashboardFilterState, ForecastModel, TimeRange } from "@/types/api";
import {
  DEFAULT_FORECAST_DAYS_AHEAD,
  DEFAULT_FORECAST_MODEL,
  DEFAULT_TIME_RANGE,
  FORECAST_MODEL_OPTIONS,
  getTimeRangeLabel,
  isValidForecastModel,
  isValidTimeRange,
} from "@/utils/filters";

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const foodsQuery = useFoods();
  const marketsQuery = useMarkets();
  const priceTypesQuery = usePriceTypes();

  const foods = foodsQuery.data ?? [];
  const markets = marketsQuery.data ?? [];
  const priceTypes = priceTypesQuery.data ?? [];

  useEffect(() => {
    if (!foods.length || !markets.length || !priceTypes.length) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    let changed = false;

    const food = searchParams.get("food");
    if ((!food || !foods.includes(food)) && foods[0]) {
      nextParams.set("food", foods[0]);
      changed = true;
    }

    const market = searchParams.get("market");
    if ((!market || !markets.includes(market)) && markets[0]) {
      nextParams.set("market", markets[0]);
      changed = true;
    }

    const priceType = searchParams.get("priceType");
    if ((!priceType || !priceTypes.includes(priceType)) && priceTypes[0]) {
      nextParams.set("priceType", priceTypes[0]);
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
  }, [foods, markets, priceTypes, searchParams, setSearchParams]);

  const selectedFood = foods.includes(searchParams.get("food") ?? "")
    ? (searchParams.get("food") as string)
    : foods[0] ?? "";
  const selectedMarket = markets.includes(searchParams.get("market") ?? "")
    ? (searchParams.get("market") as string)
    : markets[0] ?? "";
  const selectedPriceType = priceTypes.includes(searchParams.get("priceType") ?? "")
    ? (searchParams.get("priceType") as string)
    : priceTypes[0] ?? "";
  const selectedTimeRange = isValidTimeRange(searchParams.get("timeRange"))
    ? (searchParams.get("timeRange") as TimeRange)
    : DEFAULT_TIME_RANGE;
  const selectedModel = isValidForecastModel(searchParams.get("model"))
    ? (searchParams.get("model") as ForecastModel)
    : DEFAULT_FORECAST_MODEL;

  const filterState: DashboardFilterState = {
    food: selectedFood,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
    model: selectedModel,
  };

  const foodOptions = foods.map((food) => ({ label: food, value: food }));
  const marketOptions = markets.map((market) => ({ label: market, value: market }));
  const priceTypeOptions = priceTypes.map((priceType) => ({
    label: priceType[0].toUpperCase() + priceType.slice(1),
    value: priceType,
  }));

  const trendQuery = useTrend({
    foodName: selectedFood,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
  });

  const statisticsQuery = useStatistics({
    foodName: selectedFood,
    market: selectedMarket,
    priceType: selectedPriceType,
    timeRange: selectedTimeRange,
  });

  const forecastQuery = useForecast({
    foodName: selectedFood,
    market: selectedMarket,
    priceType: selectedPriceType,
    model: selectedModel,
    daysAhead: DEFAULT_FORECAST_DAYS_AHEAD,
  });

  const compareMarketsQuery = useCompareMarkets({
    food: selectedFood,
    priceType: selectedPriceType,
  });

  const rainfallQuery = useRainfallCorrelation({
    food: selectedFood,
    market: selectedMarket,
    priceType: selectedPriceType,
  });

  const catalogLoading =
    foodsQuery.isLoading || marketsQuery.isLoading || priceTypesQuery.isLoading;
  const catalogError = foodsQuery.error || marketsQuery.error || priceTypesQuery.error;

  const heroStats = useMemo(
    () => [
      {
        label: "Foods",
        value: foods.length.toString(),
        icon: Database,
      },
      {
        label: "Markets",
        value: markets.length.toString(),
        icon: MapPinned,
      },
      {
        label: "Window",
        value: getTimeRangeLabel(selectedTimeRange),
        icon: Clock3,
      },
    ],
    [foods.length, markets.length, selectedTimeRange],
  );

  const updateFilters = (patch: Partial<DashboardFilterState>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      nextParams.set(key, value);
    });

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <PageContainer className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="relative pb-4">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <LineChart className="h-3.5 w-3.5" />
              Sri Lanka public food price analytics
            </div>
            <CardTitle className="max-w-3xl text-3xl leading-tight md:text-5xl">
              Market-aware food price intelligence built for trend exploration, not admin work.
            </CardTitle>
            <CardDescription className="max-w-2xl pt-2 text-base leading-7">
              Explore historical pricing, market comparisons, forecast projections, and rainfall
              correlations from the national food dataset with a clean analytics-first interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              {heroStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[1.25rem] bg-secondary/60 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-background text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-extrabold">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <Button asChild className="w-full md:w-auto">
              <Link to={selectedFood ? `/food/${encodeURIComponent(selectedFood)}` : "/"}>
                Deeper analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {rainfallQuery.isLoading && !rainfallQuery.data ? (
          <LoadingState lines={3} title="Loading rainfall correlation" />
        ) : rainfallQuery.isError ? (
          <ErrorState
            title="Rainfall signal unavailable"
            message={rainfallQuery.error.message}
            onRetry={() => rainfallQuery.refetch()}
          />
        ) : rainfallQuery.data ? (
          <CorrelationCard correlation={rainfallQuery.data.correlation} />
        ) : (
          <EmptyState
            title="No rainfall correlation"
            message="Select a valid food, market, and price type to compute rainfall overlap."
          />
        )}
      </section>

      {catalogLoading && !foods.length && !markets.length && !priceTypes.length ? (
        <LoadingState title="Loading catalog filters" lines={5} />
      ) : catalogError ? (
        <ErrorState
          title="Unable to load filters"
          message={catalogError.message}
          onRetry={() => {
            void foodsQuery.refetch();
            void marketsQuery.refetch();
            void priceTypesQuery.refetch();
          }}
        />
      ) : (
        <DashboardFilters
          value={filterState}
          foodOptions={foodOptions}
          marketOptions={marketOptions}
          priceTypeOptions={priceTypeOptions}
          onChange={updateFilters}
        />
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Statistics</h2>
          <p className="text-sm text-muted-foreground">
            A concise summary of the selected series for {selectedFood || "the current food"}.
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
          <EmptyState message="No statistics are available for the selected filters." />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trend Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Interactive historical chart with zoom support. This is the primary view of the
            platform.
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
          <PriceTrendChart trend={trendQuery.data} />
        ) : (
          <EmptyState message="No historical trend points were returned for this combination." />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Forecast</h2>
              <p className="text-sm text-muted-foreground">
                Compare historical prices with a forward-looking model projection.
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
            <EmptyState message="Forecast data is not available for this selection." />
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active View</CardTitle>
            <CardDescription>Current analytical context reflected across the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-[1.25rem] bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Food
              </p>
              <p className="mt-2 text-lg font-semibold">{selectedFood || "Not selected"}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Market
                </p>
                <p className="mt-2 font-semibold">{selectedMarket || "Not selected"}</p>
              </div>
              <div className="rounded-[1.25rem] bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Price Type
                </p>
                <p className="mt-2 font-semibold capitalize">{selectedPriceType || "Not selected"}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Range
                </p>
                <p className="mt-2 font-semibold">{getTimeRangeLabel(selectedTimeRange)}</p>
              </div>
              <div className="rounded-[1.25rem] bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Model
                </p>
                <p className="mt-2 font-semibold">
                  {FORECAST_MODEL_OPTIONS.find((option) => option.value === selectedModel)?.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Latest market snapshot for the selected food across all available markets.
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
          <EmptyState message="No market comparison points were returned by the API." />
        )}
      </section>
    </PageContainer>
  );
}
