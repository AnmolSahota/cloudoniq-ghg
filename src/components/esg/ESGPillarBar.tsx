import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ESGPillarScore } from "@/types/esg.types";

interface Props {
  data: ESGPillarScore[];
}

export function ESGPillarBar({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <p className="text-sm font-medium text-gray-600 mb-4">Pillars</p>

      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score">
              {data.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
