import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

const EnergyComparisonChart = forwardRef(({ refData }, ref) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const renewableRes = await fetch("/data/1.csv");
      const renewableText = await renewableRes.text();

      const nonrenewableRes = await fetch("/data/2.csv");
      const nonrenewableText = await nonrenewableRes.text();

      const parsedRenewable = Papa.parse(renewableText, {
        header: true,
        dynamicTyping: true,
      }).data;

      const parsedNonrenewable = Papa.parse(nonrenewableText, {
        header: true,
        dynamicTyping: true,
      }).data;

      const totalRenewable = parsedRenewable
        .filter((d) => d["Mode of Generation"] !== "Total")
        .reduce((sum, d) => sum + (d["Contribution (TWh)"] || 0), 0);

      const totalNonRenewable = parsedNonrenewable
        .filter((d) => d["Mode of Generation"] !== "Total")
        .reduce((sum, d) => sum + (d["Contribution (TWh)"] || 0), 0);

      const combined = [
        { type: "Renewable", value: totalRenewable },
        { type: "Non-Renewable", value: totalNonRenewable },
      ];

      setChartData(combined);
    };

    fetchData();
  }, []);

  useImperativeHandle(refData, () => chartData, [chartData]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-4">
        🔋 Total Renewable vs Non-Renewable Energy (TWh)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="type"
            tick={{ fill: "#000", fontSize: 14, fontWeight: "bold" }}
          />
          <YAxis
            tick={{ fill: "#000", fontSize: 12, fontWeight: "bold" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EnergyComparisonChart;
