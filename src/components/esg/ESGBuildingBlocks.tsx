import { Treemap, ResponsiveContainer } from "recharts";
import { ESGBlock } from "@/types/esg.types";

interface Props {
  data: ESGBlock[];
}

export function ESGBuildingBlocks({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <p className="text-sm font-medium text-gray-600 mb-4">
        Building Blocks of the Pillar
      </p>

      <div className="h-96">
        <ResponsiveContainer>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#fff"
            fill="#6366f1"
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
