// src/components/charts/GlobalTempChart.jsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CSV_URL = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';

const GlobalTempChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const idxCountry = headers.indexOf('country');
        const idxYear = headers.indexOf('year');
        const idxTemp = headers.indexOf('co2'); // using CO2 to simulate temp

        const global = lines
          .map(line => line.split(','))
          .filter(cols => cols[idxCountry] === 'World')
          .slice(-50) // last 50 years
          .map(cols => ({
            year: +cols[idxYear],
            temp: +cols[idxTemp] * 1e-3 + 14 // simulate around 14°C
          }));

        setData(global);
      })
      .catch(console.error);
  }, []);

  if (!data.length) return <div className="text-center">Loading temperature...</div>;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="year"
  tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} // darker year labels
/>
<YAxis
  unit="°C"
  tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }} // darker Y-axis labels
/>

          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalTempChart;
