// Theme utilities for Chart.js using Tailwind CSS semantic tokens (HSL)
// This ensures charts look great in both light and dark themes.

export const getCssVar = (name: string): string => {
  const varName = name.startsWith("--") ? name : `--${name}`;
  if (typeof window === "undefined") return "";
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(varName).trim();
  return value || ""; // e.g. "225 84% 55%"
};

export const hslVar = (name: string, alpha?: number): string => {
  const hsl = getCssVar(name);
  if (!hsl) return alpha != null ? `hsla(0,0%,50%,${alpha})` : `hsl(0 0% 50%)`;
  // Use modern hsl with slash alpha; Canvas supports it in modern browsers
  return alpha != null ? `hsl(${hsl} / ${alpha})` : `hsl(${hsl})`;
};

export const chartPalette = (): string[] => {
  return [
    hslVar("--primary"),
    hslVar("--accent"),
    hslVar("--success"),
    hslVar("--warning"),
    hslVar("--destructive"),
    hslVar("--primary-light"),
    hslVar("--accent-light"),
  ];
};

export type ChartKind = "line" | "bar" | "pie" | "doughnut" | "radar" | "scatter" | "bubble";

export const buildChartOptions = (overrides: any = {}) => {
  const fg = hslVar("--foreground");
  const muted = hslVar("--muted-foreground");
  const grid = hslVar("--border");
  const card = hslVar("--card");

  const base: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Disable animations globally for performance
    plugins: {
      legend: {
        labels: { color: muted },
      },
      tooltip: {
        backgroundColor: card,
        titleColor: fg,
        bodyColor: fg,
        borderColor: grid,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: grid },
        ticks: { color: muted },
        border: { color: grid },
      },
      y: {
        grid: { color: grid },
        ticks: { color: muted },
        border: { color: grid },
        beginAtZero: true,
      },
    },
  };

  return {
    ...base,
    ...overrides,
    plugins: { ...(base.plugins || {}), ...(overrides.plugins || {}) },
    scales: { ...(base.scales || {}), ...(overrides.scales || {}) },
  };
};
