import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { GenericBarChartProps } from "./barChart.types";
import { computeRanks, getBaseHue, getShadedColor, computeTotals } from "./barChart.utils";

/* -------------------------------------------------
   Layout presets
-------------------------------------------------- */
const LAYOUT_PRESETS = {
  desktop: { margin: { top: 40, right: 20, bottom: 50, left: 60 }, barGap: 12, fontScale: 1 },
  tablet: { margin: { top: 32, right: 16, bottom: 42, left: 48 }, barGap: 10, fontScale: 0.95 },
  mobile: { margin: { top: 28, right: 12, bottom: 36, left: 40 }, barGap: 8, fontScale: 0.9 },
} as const;

function normalizeForStacking(data: any[]) {
  const rows: Record<string, any> = {};

  data.forEach(d => {
    if (!rows[d.category]) {
      rows[d.category] = { category: d.category, __max: 0, __topSegment: "" };
    }

    rows[d.category][d.subCategory] = d.value;
    rows[d.category].__total = (rows[d.category].__total || 0) + d.value;

    if (d.value > rows[d.category].__max) {
      rows[d.category].__max = d.value;
      rows[d.category].__topSegment = d.subCategory;
    }
  });

  return Object.keys(rows).map(k => rows[k]);
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
export function GenericBarChart({ data, title, formFactor }: GenericBarChartProps) {
  const layout = LAYOUT_PRESETS[formFactor];

  computeRanks(data);
  const totals = computeTotals(data);
  const chartData = normalizeForStacking(data);
  const stackSegments = Array.from(new Set(data.map(d => d.subCategory).filter(Boolean)));

  const RoundedTopBar = (props: any) => {
    const { x, y, width, height, fill, payload, dataKey } = props;
    const isTop = payload && payload.__topSegment === dataKey;
    if (!isTop) return <rect x={x} y={y} width={width} height={height} fill={fill} />;

    const r = 8;
    return (
      <path
        d={`M ${x},${y + height} L ${x},${y + r} Q ${x},${y} ${x + r},${y} L ${x + width - r},${y} Q ${x + width},${y} ${x + width},${y + r} L ${x + width},${y + height} Z`}
        fill={fill}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} margin={layout.margin} barGap={layout.barGap}>
        {title && <text x="50%" y={20} textAnchor="middle" fontSize={14 * layout.fontScale} fontWeight={600}>{title}</text>}
        <CartesianGrid vertical={false} horizontal opacity={0.3} />
        <XAxis dataKey="category" tickLine={false} label={{ value: "Pillars", position: "bottom", offset: 0 }} />
        <YAxis tickLine={false} label={{ value: "Score (0–100)", angle: -90, position: "insideLeft", offset: 0 }} />
        <Tooltip />
        {stackSegments.map((segment, index) => {
          const baseHue = getBaseHue(data.find(d => d.subCategory === segment)?.stackKey);
          return (
            <Bar
              key={segment}
              dataKey={segment}
              stackId="stack"
              barSize={24}
              shape={<RoundedTopBar />}
              fill={getShadedColor(baseHue, index + 1, stackSegments.length)}
            />
          );
        })}
        <Bar dataKey="__total" isAnimationActive={false} fill="transparent" label={({ x, y, width, value }) =>
          typeof x === "number" && typeof width === "number" ? (
            <text x={x + width / 2} y={y} dy={-10} dx={-23} textAnchor="middle" fontSize={12 * layout.fontScale} fontWeight={600} fill="#555">{value}</text>
          ) : null
        }/>
      </BarChart>
    </ResponsiveContainer>
  );
}
