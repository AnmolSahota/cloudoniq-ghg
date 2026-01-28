import { BarChartDatum } from "./barChart.types";
import { COLOR_TEMPLATE } from "./barChart.colors";

/* ---------- Color helpers ---------- */
export function getBaseHue(stackKey?: string) {
  return COLOR_TEMPLATE[stackKey ?? ""] ?? COLOR_TEMPLATE.default;
}

export function getShadedColor(
  hue: string,
  rank: number = 1,
  total: number = 1
) {
  const MAX_L = 70;
  const MIN_L = 40;

  const lightness = MAX_L - (rank / (total + 1)) * (MAX_L - MIN_L);

  return `hsl(${hue}, 60%, ${lightness}%)`;
}
/* ---------- Rank computation (IMMUTABLE) ---------- */
export function computeRanks(data: BarChartDatum[]) {
  const map: Record<string, BarChartDatum[]> = {};

  data.forEach(d => {
    if (!d.stackKey) return;

    const key = `${d.category}_${d.stackKey}`;
    map[key] = map[key] || [];
    map[key].push(d);
  });

  const rankedMap = new WeakMap<BarChartDatum, { rank: number; total: number }>();

  Object.values(map).forEach(items => {
    [...items]
      .sort((a, b) => a.value - b.value)
      .forEach((item, i) => {
        rankedMap.set(item, {
          rank: i + 1,
          total: items.length,
        });
      });
  });

  return rankedMap;
}


/* ---------- Totals ---------- */
export function computeTotals(data: BarChartDatum[]) {
  const totals: Record<string, number> = {};

  data.forEach((d) => {
    totals[d.category] = (totals[d.category] || 0) + d.value;
  });

  return totals;
}