import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";

const IceLevelPage = () => {
  const [data, setData] = useState([]);
  const [filteredYear, setFilteredYear] = useState("All");

  useEffect(() => {
    fetch("/data/ice_level.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data;
        const cleaned = parsed.map((d) => ({
          ...d,
          Year: d.Day?.split("-")[2],
          CumulativeMassChange: parseFloat(d.CumulativeMassChange),
        }));
        setData(cleaned);
      });
  }, []);

  const years = Array.from(new Set(data.map((d) => d.Year))).sort();

  const filteredData =
    filteredYear === "All"
      ? data
      : data.filter((d) => d.Year === filteredYear);

  return (
    <div className="bg-white p-6 rounded-2xl shadow text-black mt-8">
      <h2 className="text-xl font-bold mb-4">🧊 Ice Sheet Mass Change (Antarctica)</h2>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Year:</label>
        <select
          value={filteredYear}
          onChange={(e) => setFilteredYear(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="All">All</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Day"
            tick={{ fill: "#000", fontSize: 12, fontWeight: "bold" }}
          />
          <YAxis
            unit=" Gt"
            tick={{ fill: "#000", fontSize: 12, fontWeight: "bold" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="CumulativeMassChange"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IceLevelPage;
