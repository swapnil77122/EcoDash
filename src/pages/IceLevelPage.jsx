import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Papa from "papaparse";

const IceLevelPage = () => {
  const [data, setData] = useState([]);
  const [filteredYear, setFilteredYear] = useState("All");

  useEffect(() => {
    fetch("/data/ice_level.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true }).data;
        const dataMap = {};

        parsed.forEach((d) => {
          const day = d.Day;
          const entity = d.Entity;
          const value = parseFloat(
            d["Cumulative change in mass in the ice sheets, according to NASA/JPL"]
          );
          const year = day?.split("-")[0];

          if (!day || !entity || isNaN(value)) return;

          if (!dataMap[day]) {
            dataMap[day] = { Day: day, Year: year };
          }
          dataMap[day][entity] = value;
        });

        const mergedData = Object.values(dataMap).sort(
          (a, b) => new Date(a.Day) - new Date(b.Day)
        );

        setData(mergedData);
      });
  }, []);

  const years = Array.from(new Set(data.map((d) => d.Year))).sort();

  const filteredData =
    filteredYear === "All"
      ? data
      : data.filter((d) => d.Year === filteredYear);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow text-black text-xs">
          <p className="font-semibold">📅 Date: {label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} Gt
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-white text-black p-3 text-xs">
      <h2 className="text-sm font-semibold mb-3 text-black">
        🧊 Ice Sheet Mass Change
      </h2>

      <div className="mb-3">
        <label className="font-medium mr-2 text-black">Filter by Year:</label>
        <select
          value={filteredYear}
          onChange={(e) => setFilteredYear(e.target.value)}
          className="text-black border border-black px-2 py-1 rounded text-xs"
        >
          <option value="All">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[65vh] bg-gray-100 rounded shadow p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Day"
              stroke="#000"
              tick={{ fontSize: 9 }}
            />
            <YAxis
              unit=" Gt"
              stroke="#000"
              tick={{ fontSize: 9 }}
              label={{
                value: "Mass Change (Gt)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                fill: "#000",
                fontSize: 9,
                fontWeight: "bold"
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 9 }} />
            <Line
              type="monotone"
              dataKey="Antarctica"
              name="Antarctica"
              stroke="#3b82f6"
              strokeWidth={1.8}
              dot={{ r: 1.5 }}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Greenland"
              name="Greenland"
              stroke="#10b981"
              strokeWidth={1.8}
              dot={{ r: 1.5 }}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IceLevelPage;
