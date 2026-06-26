import type { DashboardFilterState, SelectOption } from "@/types/api";
import { TIME_RANGE_OPTIONS } from "@/utils/filters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface DashboardFiltersProps {
  value: DashboardFilterState;
  foodOptions: SelectOption[];
  marketOptions: SelectOption[];
  priceTypeOptions: SelectOption[];
  onChange: (patch: Partial<DashboardFilterState>) => void;
  showFoodSelector?: boolean;
  foodLocked?: boolean;
}

export function DashboardFilters({
  value,
  foodOptions,
  marketOptions,
  priceTypeOptions,
  onChange,
  showFoodSelector = true,
  foodLocked = false,
}: DashboardFiltersProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Narrow the dataset by food, market, price type, and analytical window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {showFoodSelector ? (
            <SearchableSelect
              label="Food"
              value={value.food}
              options={foodOptions}
              placeholder="Select food"
              searchPlaceholder="Search foods..."
              emptyMessage="No foods found."
              disabled={foodLocked}
              onChange={(food) => onChange({ food })}
            />
          ) : null}

          <SearchableSelect
            label="Market"
            value={value.market}
            options={marketOptions}
            placeholder="Select market"
            searchPlaceholder="Search markets..."
            emptyMessage="No markets found."
            onChange={(market) => onChange({ market })}
          />

          <SearchableSelect
            label="Price Type"
            value={value.priceType}
            options={priceTypeOptions}
            placeholder="Select price type"
            searchPlaceholder="Search price types..."
            emptyMessage="No price types found."
            onChange={(priceType) => onChange({ priceType })}
          />

          <SearchableSelect
            label="Time Range"
            value={value.timeRange}
            options={TIME_RANGE_OPTIONS}
            placeholder="Select time range"
            searchPlaceholder="Search time ranges..."
            emptyMessage="No ranges found."
            onChange={(timeRange) =>
              onChange({ timeRange: timeRange as DashboardFilterState["timeRange"] })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
