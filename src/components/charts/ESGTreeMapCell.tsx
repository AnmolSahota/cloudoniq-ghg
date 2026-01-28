import React from "react";
import { TREEMAP_COLORS, TREEMAP_STYLES } from "./esgColor";

interface TreeMapCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  depth?: number;
  parent?: any;
  payload?: any;
}

export const ESGTreeMapCell: React.FC<TreeMapCellProps> = (props) => {
  const { x = 0, y = 0, width = 0, height = 0, name, value, parent, payload } = props;

  // Don't render very small cells
  if (width < 80 || height < 40) return null;

  // Get the category for coloring
  const category = payload?.category || parent?.name || name;
  const fill = TREEMAP_COLORS[category || ""] || TREEMAP_COLORS.default;

  // Calculate text wrapping for long names
  const maxCharsPerLine = Math.floor(width / 7);
  const words = (name || "").split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines max
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].substring(0, maxCharsPerLine - 3) + "...";
  }

  return (
    <g>
      {/* Main rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={TREEMAP_STYLES.borderColor}
        strokeWidth={TREEMAP_STYLES.borderWidth}
        rx={TREEMAP_STYLES.borderRadius}
        style={{
          cursor: "pointer",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Hover effect overlay */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0)"
        rx={TREEMAP_STYLES.borderRadius}
        style={{
          cursor: "pointer",
        }}
        className="hover:fill-black hover:fill-opacity-5"
      />

      {/* Title text (multi-line support) */}
      {displayLines.map((line, index) => (
        <text
          key={index}
          x={x + TREEMAP_STYLES.textPaddingX}
          y={y + TREEMAP_STYLES.textPaddingY + (index * 16)}
          fontSize={TREEMAP_STYLES.titleFontSize}
          fill={TREEMAP_STYLES.titleColor}
          fontWeight={TREEMAP_STYLES.titleFontWeight}
          style={{ pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}

      {/* Value text */}
      {value !== undefined && (
        <text
          x={x + TREEMAP_STYLES.textPaddingX}
          y={y + TREEMAP_STYLES.textPaddingY + (displayLines.length * 16) + TREEMAP_STYLES.valueOffsetY}
          fontSize={TREEMAP_STYLES.valueFontSize}
          fill={TREEMAP_STYLES.valueColor}
          fontWeight={TREEMAP_STYLES.valueFontWeight}
          style={{ pointerEvents: "none" }}
        >
          {value.toFixed(1)}
        </text>
      )}
    </g>
  );
};