import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SeaLevelLineChart = forwardRef(({ refData }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const years = Array.from({ length: 50 }, (_, i) => 1970 + i);
    const fakeData = years.map((year, i) => ({
      year,
      level: parseFloat((i * 3.3 + Math.random()).toFixed(2)), // mm/year
    }));
    setData(fakeData);
  }, []);

  useImperativeHandle(refData, () => data, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow text-black">
      <h3 className="text-lg font-bold mb-4">📈 Simulated Sea Level Rise (mm/year)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#000", fontWeight: "bold", fontSize: 12 }}
          />
          <YAxis
            unit=" mm"
            tick={{ fill: "#000", fontWeight: "bold", fontSize: 12 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SeaLevelLineChart;
