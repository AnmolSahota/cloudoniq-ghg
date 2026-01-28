// Exact colors from the Union Bank ESG Treemap
export const TREEMAP_COLORS: Record<string, string> = {
  // Primary category colors
  "Financed Emissions": "#B4BAE0",        // Light blue-purple
  "Greenhouse Gas Emissions": "#FDBA74",  // Orange
  "Social": "#FDE68A",                     // Yellow
  "Physical Risk": "#BFDBFE",              // Light blue
  
  // Default fallback
  default: "#E5E7EB",
};

// Border and text colors
export const TREEMAP_STYLES = {
  borderColor: "#FFFFFF",
  borderWidth: 2,
  borderRadius: 8,
  
  // Text styles
  titleColor: "#111827",
  titleFontSize: 13,
  titleFontWeight: 600,
  
  valueColor: "#374151",
  valueFontSize: 13,
  valueFontWeight: 400,
  
  // Padding
  textPaddingX: 12,
  textPaddingY: 20,
  valueOffsetY: 20,
};