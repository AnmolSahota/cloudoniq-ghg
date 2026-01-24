import { ESGScoreDonut } from "@/components/esg/ESGScoreDonut";
import { ESGPillarBar } from "@/components/esg/ESGPillarBar";
import { ESGBuildingBlocks } from "@/components/esg/ESGBuildingBlocks";
import { ESGIndicatorsTable } from "@/components/esg/ESGIndicatorsTable";

export default function ESGDashboardPage() {
  const score = 49;

  const pillars = [
    { name: "Environment", score: 42, color: "#60a5fa" },
    { name: "Social", score: 68, color: "#fb923c" },
    { name: "Governance", score: 38, color: "#facc15" },
    { name: "Financed Emissions", score: 66, color: "#818cf8" },
    { name: "Physical Risks", score: 38, color: "#d946ef" },
    { name: "Transition Risks", score: 21, color: "#2563eb" },
  ];

  const blocks = [
    { name: "Financed Emissions - 1", value: 99.7, color: "#818cf8" },
    { name: "Financed Emissions - 2", value: 100, color: "#6366f1" },
    { name: "GHG Emissions", value: 75.9, color: "#fb923c" },
    { name: "Air Emissions", value: 48.5, color: "#f97316" },
    { name: "Wages & Salaries", value: 81.7, color: "#fde68a" },
    { name: "Child Labor", value: 75.5, color: "#fcd34d" },
  ];

  const indicators = [
    {
      category: "Greenhouse Gas",
      indicator: "Scope 1 GHG Emissions Intensity",
      value: 23,
      unit: "MTCO2e",
      score: 88,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">ESG Scorecard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ESGScoreDonut score={score} />
        <div className="lg:col-span-2">
          <ESGPillarBar data={pillars} />
        </div>
      </div>

      <ESGBuildingBlocks data={blocks} />

      <ESGIndicatorsTable data={indicators} />
    </div>
  );
}
