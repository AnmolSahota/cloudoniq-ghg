import { ESGIndicator } from "@/types/esg.types";

interface Props {
  data: ESGIndicator[];
}

export function ESGIndicatorsTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left text-gray-600">
            <th className="py-2">Category</th>
            <th>Indicator</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b last:border-0">
              <td className="py-2">{row.category}</td>
              <td>{row.indicator}</td>
              <td>{row.value}</td>
              <td>{row.unit}</td>
              <td className="font-medium">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
