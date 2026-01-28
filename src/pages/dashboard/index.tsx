import React, { useState } from "react";
import { GenericBarChart } from "../../components/charts/GenericBarChart";
import { ESGDonutChart } from "../../components/charts/ESGDonutChart";
import { ESGTreeMap } from "../../components/charts/ESGTreeMap";
import { BarChartDatum } from "../../components/charts/barChart.types";

const demoData: BarChartDatum[] = [
  { category: "Environment", subCategory: "Scope 1", stackKey: "environment", value: 15 },
  { category: "Environment", subCategory: "Scope 2", stackKey: "environment", value: 12 },
  { category: "Environment", subCategory: "Scope 3", stackKey: "environment", value: 15 },
  { category: "Social", subCategory: "Employees", stackKey: "social", value: 30 },
  { category: "Social", subCategory: "Community", stackKey: "social", value: 38 },
  { category: "Governance", subCategory: "Board", stackKey: "governance", value: 20 },
  { category: "Governance", subCategory: "Ethics", stackKey: "governance", value: 18 },
  { category: "Financed Emissions", subCategory: "Portfolio 1", stackKey: "environment", value: 35 },
  { category: "Financed Emissions", subCategory: "Portfolio 2", stackKey: "environment", value: 34 },
  { category: "Physical Risks", subCategory: "Climate", stackKey: "environment", value: 19 },
  { category: "Physical Risks", subCategory: "Location", stackKey: "environment", value: 19 },
  { category: "Transition Risks", subCategory: "Policy", stackKey: "governance", value: 11 },
  { category: "Transition Risks", subCategory: "Technology", stackKey: "governance", value: 10 },
];

export default function DashboardPage() {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [drillDownData, setDrillDownData] = useState<BarChartDatum[] | null>(null);

  const handleBarDrillDown = (category: string, data: BarChartDatum[]) => {
    setSelectedView(`bar-${category}`);
    setDrillDownData(data);
  };

  const handleDonutDrillDown = (segment: string) => {
    setSelectedView(`donut-${segment}`);
    const filteredData = demoData.filter((d) => d.stackKey === segment);
    setDrillDownData(filteredData);
  };

  const resetView = () => {
    setSelectedView(null);
    setDrillDownData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Corporate/MSME</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                ESG
              </span>
            </div>
            <h2 className="text-lg text-gray-600 mt-1">
              Borrower: UltraTech Cement Limited
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            Last Updated: 12:34 pm 21/12/25
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {[
            "ESG Scorecard",
            "Financed Emissions",
            "Physical Risk",
            "Transition Risk",
            "Nature & Biodiversity Risk",
            "Climate Stress Testing",
          ].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                tab === "ESG Scorecard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Breadcrumb */}
        {selectedView && (
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button
              onClick={resetView}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ESG Scorecard
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {selectedView.split("-")[1]}
            </span>
          </div>
        )}

        {!selectedView ? (
          <>
            {/* Title with Download Button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">ESG Scorecard</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Report
              </button>
            </div>

            {/* Top Row - Donut and Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <ESGDonutChart score={49} onDrillDown={handleDonutDrillDown} />
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
                <GenericBarChart
                  data={demoData}
                  title="Pillars"
                  formFactor="desktop"
                  onDrillDown={handleBarDrillDown}
                />
              </div>
            </div>

            {/* Tree Map */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <ESGTreeMap />
            </div>

            {/* Indicators Table */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Indicators to the Enhanced ESG Score
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors">
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
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Indicator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        category: "Greenhouse Gas Emissions",
                        indicator: "Scope 1 GHG Emissions Intensity (MTCO2e per million INR)",
                        value: "23",
                        unit: "MTCO2e Per Million",
                        score: 88,
                      },
                      {
                        category: "Greenhouse Gas Emissions",
                        indicator: "Absolute GHG Emissions (Scope 1 &2) Reduction 3Y",
                        value: "0.5",
                        unit: "Percentage",
                        score: 77,
                      },
                      {
                        category: "Air Emissions",
                        indicator: "Nox Emission Intensity (Tons per Million INR)",
                        value: "80",
                        unit: "Tons per Million INR",
                        score: 89,
                      },
                      {
                        category: "Workplace Accessibility",
                        indicator: "Equal Opportunity Policy Compliance (RPWD Act 2016)",
                        value: "Yes",
                        unit: "Yes/No",
                        score: 80,
                      },
                    ].map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {row.indicator}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {row.value}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {row.unit}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {row.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                <span>Rows per page: 50</span>
                <span>Showing 1-50 of 250</span>
              </div>
            </div>
          </>
        ) : (
          // Drill-down view
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedView.split("-")[1]} Details
              </h2>
              <button
                onClick={resetView}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Overview
              </button>
            </div>

            {drillDownData && (
              <div className="space-y-4">
                {drillDownData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.subCategory}
                      </div>
                      <div className="text-sm text-gray-600">
                        Category: {item.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}