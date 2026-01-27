export interface BarChartDatum {
  category: string;
  subCategory: string;
  value: number;
  stackKey?: string;
  _rank?: number;
  _total?: number;
}

export interface GenericBarChartProps {
  data: BarChartDatum[];
  title?: string;
  formFactor: "desktop" | "tablet" | "mobile";
}
