import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  score: number;
}

const COLORS = ["#6366f1", "#93c5fd", "#fde68a", "#fca5a5"];

export function ESGScoreDonut({ score }: Props) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <p className="text-sm font-medium text-gray-600 mb-2">Enhanced ESG Score</p>

      <div className="h-56 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={COLORS[0]} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
    </div>
  );
}
