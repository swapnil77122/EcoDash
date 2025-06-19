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

const SeaLevelLineChart = forwardRef(({ refData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const years = Array.from({ length: 50 }, (_, i) => 1970 + i);
    const fakeData = years.map((year, i) => ({
      year,
      level: parseFloat((i * 3.3 + Math.random()).toFixed(2)), // mm/year
    }));

    setTimeout(() => { // simulate slight delay for realism
      setData(fakeData);
      setLoading(false); // ✅ stop loading
    }, 500);
  }, []);

  useImperativeHandle(refData, () => data, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow text-black text-sm">
      <h3 className="text-base font-semibold mb-3">
        📈 Simulated Sea Level Rise (mm/year)
      </h3>

      {loading ? (
        <p className="text-blue-600 text-xs italic">Loading simulated sea level data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#000", fontWeight: 500, fontSize: 10 }}
            />
            <YAxis
              unit=" mm"
              tick={{ fill: "#000", fontWeight: 500, fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ fontSize: "10px" }}
              labelStyle={{ fontSize: "10px" }}
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
});

export default SeaLevelLineChart;
