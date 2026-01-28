import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { GenericBarChartProps, BarChartDatum } from "./barChart.types";
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

  data.forEach((d) => {
    if (!rows[d.category]) {
      rows[d.category] = { category: d.category, __max: 0, __topSegment: "", __rawData: [] };
    }

    rows[d.category][d.subCategory] = d.value;
    rows[d.category].__total = (rows[d.category].__total || 0) + d.value;
    rows[d.category].__rawData.push(d);

    if (d.value > rows[d.category].__max) {
      rows[d.category].__max = d.value;
      rows[d.category].__topSegment = d.subCategory;
    }
  });

  return Object.keys(rows).map((k) => rows[k]);
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
export function GenericBarChart({ data, title, formFactor, onDrillDown }: GenericBarChartProps) {
  const layout = LAYOUT_PRESETS[formFactor];
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // computeRanks(data);
  const rankMap = computeRanks(data);

  const totals = computeTotals(data);
  const chartData = normalizeForStacking(data);
  const stackSegments = Array.from(new Set(data.map((d) => d.subCategory).filter(Boolean)));

  const RoundedTopBar = (props: any) => {
    const { x, y, width, height, fill, payload, dataKey } = props;
    const isTop = payload && payload.__topSegment === dataKey;
    const isHovered = hoveredBar === payload?.category;

    const finalFill = isHovered ? adjustBrightness(fill, 1.1) : fill;

    if (!isTop) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={finalFill}
          style={{ transition: "fill 0.2s ease" }}
        />
      );
    }

    const r = 8;
    return (
      <path
        d={`M ${x},${y + height} L ${x},${y + r} Q ${x},${y} ${x + r},${y} L ${
          x + width - r
        },${y} Q ${x + width},${y} ${x + width},${y + r} L ${x + width},${y + height} Z`}
        fill={finalFill}
        style={{ transition: "fill 0.2s ease" }}
      />
    );
  };

  const handleBarClick = (data: any) => {
    if (onDrillDown && data && data.__rawData) {
      onDrillDown(data.category, data.__rawData);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
        <div className="font-semibold text-gray-900 mb-2">{payload[0].payload.category}</div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-gray-700">{entry.dataKey}</span>
              </div>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-sm font-semibold">
          <span className="text-gray-700">Total</span>
          <span className="text-gray-900">{payload[0].payload.__total}</span>
        </div>
        {onDrillDown && (
          <div className="mt-2 text-xs text-gray-500 italic">Click to drill down</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '360px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={layout.margin}
          barGap={layout.barGap}
          onMouseMove={(state: any) => {
            if (state?.activePayload?.[0]?.payload?.category) {
              setHoveredBar(state.activePayload[0].payload.category);
            }
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
        {title && (
          <text
            x="50%"
            y={20}
            textAnchor="middle"
            fontSize={14 * layout.fontScale}
            fontWeight={600}
          >
            {title}
          </text>
        )}
        <CartesianGrid vertical={false} horizontal opacity={0.3} />
        <XAxis
          dataKey="category"
          tickLine={false}
          label={{ value: "PILLARS", position: "bottom", offset: 0 }}
          style={{ cursor: onDrillDown ? "pointer" : "default" }}
        />
        <YAxis
          tickLine={false}
          label={{
            value: "SCORE (0-100)",
            angle: -90,
            position: "insideLeft",
            offset: 0,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        {stackSegments.map((segment, index) => {
          const baseHue = getBaseHue(data.find((d) => d.subCategory === segment)?.stackKey);
          return (
            <Bar
              key={segment}
              dataKey={segment}
              stackId="stack"
              barSize={24}
              shape={<RoundedTopBar />}
              fill={getShadedColor(baseHue, index + 1, stackSegments.length)}
              onClick={handleBarClick}
              style={{ cursor: onDrillDown ? "pointer" : "default" }}
            />
          );
        })}
        <Bar
          dataKey="__total"
          isAnimationActive={false}
          fill="transparent"
          label={({ x, y, width, value }) =>
            typeof x === "number" && typeof width === "number" ? (
              <text
                x={x + width / 2}
                y={y}
                dy={-10}
                dx={-23}
                textAnchor="middle"
                fontSize={12 * layout.fontScale}
                fontWeight={600}
                fill="#555"
              >
                {value}
              </text>
            ) : null
          }
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}

// Helper function to adjust brightness
function adjustBrightness(color: string, factor: number): string {
  if (color.startsWith("hsl")) {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const [, h, s, l] = match;
      const newL = Math.min(100, parseInt(l) * factor);
      return `hsl(${h}, ${s}%, ${newL}%)`;
    }
  }
  return color;
}