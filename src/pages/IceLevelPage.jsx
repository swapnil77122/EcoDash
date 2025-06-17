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

  return (
    <div className="w-full min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        🧊 Ice Sheet Mass Change
      </h2>

      <div className="mb-6">
        <label className="font-medium mr-2 text-white">Filter by Year:</label>
        <select
          value={filteredYear}
          onChange={(e) => setFilteredYear(e.target.value)}
          className=" text-black border border-white px-2 py-1 rounded"
        >
          <option value="All">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[75vh] bg-white rounded-lg shadow-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Day" stroke="#000" />
            <YAxis unit=" Gt" stroke="#000" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Antarctica"
              name="Antarctica"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Greenland"
              name="Greenland"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IceLevelPage;
