import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const CSV_URL = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';
const TARGET_COUNTRIES = [
  'China', 'United States', 'India', 'Russia', 'Japan', 'Germany', 'Iran',
  'South Korea', 'Indonesia', 'Saudi Arabia', 'Canada', 'Mexico', 'Brazil',
  'South Africa', 'Australia', 'United Kingdom', 'Turkey', 'Italy', 'France', 'Thailand'
];
const AVAILABLE_YEARS = ['2021', '2020', '2019', '2018', '2017'];

const CO2BarChart = () => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [year, setYear] = useState('2021');

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const idxCountry = headers.indexOf('country');
        const idxYear = headers.indexOf('year');
        const idxCo2 = headers.indexOf('co2');

        const allData = lines.slice(1).map(line => {
          const cols = line.split(',');
          return {
            country: cols[idxCountry],
            year: cols[idxYear],
            co2: parseFloat(cols[idxCo2]) || 0,
          };
        });

        setRawData(allData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = rawData
      .filter(row => row.year === year && TARGET_COUNTRIES.includes(row.country))
      .map(row => ({ country: row.country, co2: row.co2 }));

    setData(filtered);
  }, [year, rawData]);

  return (
    <div className="w-full mt-8 bg-white p-4 rounded shadow text-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Top CO₂ Emitters in {year}</h2>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {AVAILABLE_YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-gray-600">Loading data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }}
            />
            <YAxis
              unit=" Mt"
              tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }}
            />
            <Tooltip />
            <Bar dataKey="co2" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CO2BarChart;
