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
import Papa from "papaparse";

const SeaLevelLineChart = forwardRef(({ refData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/datasets/sea-level-rise/master/data/epa-sea-level.csv";

    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        const cleaned = results.data
          .filter(
            (row) =>
              row.Year &&
              row["NOAA Adjusted Sea Level"] &&
              !isNaN(parseFloat(row["NOAA Adjusted Sea Level"])) &&
              parseInt(row.Year) >= 1970
          )
          .map((row) => ({
            year: parseInt(row.Year),
            level: parseFloat(row["NOAA Adjusted Sea Level"]),
          }));

        setData(cleaned);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        setLoading(false);
      },
    });
  }, []);

  useImperativeHandle(refData, () => data, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow text-black text-sm">
      <h3 className="text-base font-semibold mb-1">
        🌊 Sea Level Rise 
      </h3>
      <p className="text-xs text-gray-600 mb-3">
        Data source:{" "}
        <a
          href="https://raw.githubusercontent.com/datasets/sea-level-rise/master/data/epa-sea-level.csv"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          NOAA Data
        </a>
      </p>

      {loading ? (
        <p className="text-blue-600 text-xs italic">Loading sea level data...</p>
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
              formatter={(value) => `${value.toFixed(2)} mm`}
              labelFormatter={(label) => `Year: ${label}`}
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
