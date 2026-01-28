import React from "react";

interface ESGTreeMapTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const ESGTreeMapTooltip: React.FC<ESGTreeMapTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const { name, value, category } = data;

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-3"
      style={{
        minWidth: "180px",
        maxWidth: "280px",
      }}
    >
      <div className="space-y-2">
        {/* Category badge */}
        {category && (
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {category}
          </div>
        )}
        
        {/* Name */}
        <div className="text-sm font-semibold text-gray-900">
          {name}
        </div>
        
        {/* Value */}
        {value !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-600">Score:</span>
            <span className="text-sm font-bold text-gray-900">{value.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};