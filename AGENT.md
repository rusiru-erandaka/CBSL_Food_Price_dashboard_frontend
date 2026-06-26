# Frontend Agent Guide

## Product Context

- Project: Sri Lankan Food Price Analytics Platform frontend
- Audience: public users exploring market data, not internal operators
- UX goal: clean data-first analytics experience inspired by Google Trends, Kaggle, World Bank Data, and TradingView minimalism
- Visual direction: white base, restrained accent color, strong typography, low-noise layouts, responsive charts

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui-style component setup
- TanStack Query
- Axios
- Recharts
- React Router
- Lucide React

## Backend Contract

Base URL comes from `VITE_API_BASE_URL`.

Local development rule:

- In Vite dev, frontend requests should go to same-origin `/api/...`
- Vite proxies `/api` to `VITE_API_PROXY_TARGET`
- Do not point the browser directly at `http://0.0.0.0:8000`; that commonly fails with CORS in local dev
- If frontend and backend are deployed on different origins in production, backend CORS must still be configured server-side

Routes used by the frontend:

- `GET /api/v1/foods`
- `GET /api/v1/markets`
- `GET /api/v1/price-types`
- `GET /api/v1/foods/{food_name}`
- `GET /api/v1/foods/{food_name}/trends`
- `GET /api/v1/foods/{food_name}/statistics`
- `GET /api/v1/foods/{food_name}/forecast`
- `GET /api/v1/compare-markets`
- `GET /api/v1/rainfall-correlation`

Known query contracts from backend source:

- Trends/statistics: `market`, `price_type`, `time_range`
- Forecast: `market`, `price_type`, `days_ahead`, `model`
- Compare markets: `food`, `price_type`
- Rainfall correlation: `food`, `market`, `price_type`
- Time ranges: `7d`, `30d`, `3m`, `6m`, `1y`, `2y`, `all`
- Forecast models: `moving_average`, `linear_regression`

## Frontend Architecture

- `src/api`: Axios client and endpoint functions
- `src/hooks`: TanStack Query hooks and reusable query-key patterns
- `src/components/layout`: shell components such as navbar, footer, and page container
- `src/components/common`: loading, error, and empty states
- `src/components/filters`: dashboard filter controls with searchable dropdowns
- `src/components/cards`: metric and insight cards
- `src/components/charts`: trend, forecast, and comparison charts
- `src/pages`: route-level page composition
- `src/routes`: router definition
- `src/types`: API and view-model types
- `src/utils`: formatting helpers, constants, and filter utilities

## Current Interaction Model

- Dashboard state is stored in URL search params for shareable views
- Supported search params: `food`, `market`, `priceType`, `timeRange`, `model`
- Dashboard route: `/`
- Food detail route: `/food/:foodName`
- Current forecast horizon in the UI: `30` days ahead
- Food detail page locks the food route param and only exposes market, price type, time range, and model controls
- Theme state is persisted in `localStorage` under `cbsl-dashboard-theme`

## Current Feature Set

- Public landing dashboard with filter-driven analytics
- Statistics cards for current, average, minimum, maximum, change, and volatility
- Historical trend chart with tooltip, legend, and zoom brush
- Forecast visualization overlaying historical and predicted values
- Market comparison horizontal bar chart
- Rainfall correlation summary card with strength classification
- Food detail page with metadata and deeper analysis
- Responsive navbar with mobile menu and GitHub link
- Light and dark theme variants with a persistent navbar toggle
- Shared skeleton, error, and empty-state components
- Searchable filter dropdowns render as solid opaque overlay panels for legibility over chart and page content

## Engineering Conventions

- Keep API access centralized in `src/api`
- Reuse TanStack Query hooks instead of fetching inside components
- Preserve strict TypeScript types and small reusable view components
- Use environment variables for all backend URLs
- Prefer extending existing chart and card primitives before adding new page-specific UI
- Keep animations subtle and functional
- Vite build output is manually chunked by vendor group (`react`, `data`, `charts`, `ui`) to keep caching and loading behavior predictable

## Maintenance Rule

Whenever a feature is added or architecture changes, update this file in the same change set so future agents can understand the current product shape quickly.
