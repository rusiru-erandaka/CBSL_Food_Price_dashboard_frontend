export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(
    "en-LK",
    options ?? {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

export function getCorrelationStrength(correlation: number) {
  const absolute = Math.abs(correlation);

  if (absolute >= 0.7) {
    return "Strong";
  }

  if (absolute >= 0.4) {
    return "Moderate";
  }

  return "Weak";
}

export function formatChangeDirection(value: number) {
  if (value > 0) {
    return "up";
  }

  if (value < 0) {
    return "down";
  }

  return "flat";
}
