import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Papa from 'papaparse';

const CSV_URL =
  'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Global%20temperature%20anomaly%20-%20Met%20Office%20(HadCRUT4)/Global%20temperature%20anomaly%20-%20Met%20Office%20(HadCRUT4).csv';

const GlobalTempChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true }).data;

        const anomalyKey = 'Median temperature anomaly from 1961-1990 average';

        const filtered = parsed
          .filter((row) => row.Year && row[anomalyKey])
          .slice(-50)
          .map((row) => ({
            year: +row.Year,
            temp: +(14 + parseFloat(row[anomalyKey])).toFixed(2),
          }));

        setData(filtered);
      })
      .catch(console.error);
  }, []);

  if (!data.length) {
    return (
      <div className="text-center text-black text-sm">Loading temperature data...</div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow text-black">
      <h3 className="text-base font-semibold mb-3">
        🌡️ Global Temperature Trend (Last 50 Years)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }}
          />
        <YAxis
  unit="°C"
  domain={[
    (dataMin) => Math.floor(dataMin - 0.2),
    (dataMax) => Math.ceil(dataMax + 0.2)
  ]}
  tick={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }}
/>


          <Tooltip />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalTempChart;
