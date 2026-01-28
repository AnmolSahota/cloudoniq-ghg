import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

interface ESGDonutChartProps {
  score: number;
  onDrillDown?: (segment: string) => void;
}

const SEGMENT_DATA = [
  { name: "Environment", value: 15, color: "#93C5FD", key: "environment" },
  { name: "Social", value: 20, color: "#FDBA74", key: "social" },
  { name: "Governance", value: 14, color: "#A78BFA", key: "governance" },
];

export function ESGDonutChart({ score, onDrillDown }: ESGDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = SEGMENT_DATA.reduce((sum, item) => sum + item.value, 0);

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };

  const onPieLeave = () => {
    setHoveredIndex(null);
  };

  const onPieClick = (_: any, index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    if (onDrillDown) {
      onDrillDown(SEGMENT_DATA[index].key);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Enhanced ESG Score</h3>
        <button
          className="mb-4 p-1 rounded hover:bg-gray-100 transition-colors"
          title="Information"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 16v-4m0-4h.01"
            />
          </svg>
        </button>

        <div className="relative w-[240px] h-[240px]">
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
              <Pie
                data={SEGMENT_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={onPieClick}
                activeIndex={hoveredIndex ?? undefined}
                activeShape={renderActiveShape}
                style={{ cursor: onDrillDown ? "pointer" : "default" }}
              >
                {SEGMENT_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      opacity: activeIndex !== null && activeIndex !== index ? 0.5 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          </div>

          {/* Center score */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{score}</div>
              <div className="text-sm text-gray-500 mt-1">/ 100</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3 w-full">
          {SEGMENT_DATA.map((segment, index) => (
            <div
              key={segment.name}
              className={`flex items-center justify-between p-2 rounded transition-all ${
                hoveredIndex === index || activeIndex === index
                  ? "bg-gray-50"
                  : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onPieClick(null, index)}
              style={{ cursor: onDrillDown ? "pointer" : "default" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {segment.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {segment.value}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round((segment.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {onDrillDown && (
          <div className="mt-4 text-xs text-gray-500 italic text-center">
            Click on any segment to view details
          </div>
        )}
      </div>
    </div>
  );
}