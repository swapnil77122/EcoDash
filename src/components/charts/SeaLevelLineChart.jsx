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

const SeaLevelLineChart = forwardRef(({ refData }, ) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const years = Array.from({ length: 50 }, (_, i) => 1970 + i);
    const fakeData = years.map((year, i) => ({
      year,
      level: parseFloat((i * 3.3 + Math.random()).toFixed(2)), // mm/year
    }));
    setData(fakeData);
  }, []);

  // Expose the data to parent via ref
  useImperativeHandle(refData, () => data, [data]);

  return (
    <div className="w-full h-80 mt-8">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
           <XAxis
            dataKey="year"
            tick={{ fill: "white", fontWeight: "bold" }}
          />
          <YAxis
            unit=" mm"
            tick={{ fill: "white", fontWeight: "bold" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SeaLevelLineChart;
