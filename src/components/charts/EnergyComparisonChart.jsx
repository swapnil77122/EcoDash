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

const EnergyComparisonChart = forwardRef(({ refData }, ) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCSVs = async () => {
      const renewableRes = await fetch("/data/1.csv");
      const renewableText = await renewableRes.text();

      const nonrenewableRes = await fetch("/data/2.csv");
      const nonrenewableText = await nonrenewableRes.text();

      const parsedRenewable = Papa.parse(renewableText, {
        header: true,
        dynamicTyping: true,
      }).data.filter((d) => d.Mode !== "Total");

      const parsedNonrenewable = Papa.parse(nonrenewableText, {
        header: true,
        dynamicTyping: true,
      }).data.filter((d) => d.Mode !== "Total");

      const allModes = [...new Set([...parsedRenewable, ...parsedNonrenewable].map(d => d['Mode of Generation']?.trim()))];

      const combined = allModes.map((mode) => {
        const ren = parsedRenewable.find(d => d['Mode of Generation']?.trim() === mode);
        const non = parsedNonrenewable.find(d => d['Mode of Generation']?.trim() === mode);
        return {
          mode,
          Renewable: ren?.['Contribution (TWh)'] || 0,
          NonRenewable: non?.['Contribution (TWh)'] || 0,
        };
      });

      setData(combined);
    };

    fetchCSVs();
  }, []);

  useImperativeHandle(refData, () => data, [data]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-4 ">
        🔋 Renewable vs Non-Renewable Energy (TWh)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
  dataKey="mode"
  angle={-40}
  textAnchor="end"
  height={100}
  tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} // darker, bolder labels
/>
<YAxis
  tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} // darker, bolder labels
/>

          <Tooltip />
          <Legend />
          <Bar dataKey="Renewable" fill="#22c55e" />
          <Bar dataKey="NonRenewable" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EnergyComparisonChart;
