import React from "react";
import { GenericBarChart } from "../../components/charts/GenericBarChart";
import { BarChartDatum } from "../../components/charts/barChart.types";

const demoData: BarChartDatum[] = [
  { category: "Environment", subCategory: "Scope 1", stackKey: "environment", value: 15 },
  { category: "Environment", subCategory: "Scope 2", stackKey: "environment", value: 12 },
  { category: "Environment", subCategory: "Scope 3", stackKey: "environment", value: 20 },
  { category: "Social", subCategory: "Employees", stackKey: "social", value: 30 },
  { category: "Social", subCategory: "Community", stackKey: "social", value: 38 },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <GenericBarChart data={demoData} title="ESG Breakdown" formFactor="desktop" />
    </div>
  );
}
