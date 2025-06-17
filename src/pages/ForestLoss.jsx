import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const years = Array.from({ length: 11 }, (_, i) => 2010 + i); // [2010, ..., 2020]

const ForestLoss = () => {
  const [allData, setAllData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/data/forest_loss_all.csv');
      const csvText = await res.text();
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

      const cleaned = parsed
        .map(row => {
          const entry = {
            country: row.country?.trim(),
            threshold: row.threshold?.trim(),
          };
          for (let year of years) {
            const key = `tc_loss_ha_${year}`;
            entry[year] = parseFloat(row[key]?.trim()) || 0;
          }
          return entry;
        })
        .filter(d => d.threshold === '30');

      setAllData(cleaned);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      const filtered = allData
        .map(row => ({
          country: row.country,
          loss: row[selectedYear],
        }))
        .filter(d => !isNaN(d.loss))
        .sort((a, b) => b.loss - a.loss)
        .slice(0, 20);

      setChartData(filtered);
    }
  }, [allData, selectedYear]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">
        🌳 Forest Area Loss ({selectedYear})
      </h2>

      <div className="mb-4">
        <label className="text-white font-medium mr-2">Select Year:</label>
        <select
          className="p-2 rounded shadow"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {chartData.length === 0 ? (
        <p className="text-white">Loading or no valid data found...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
  <CartesianGrid strokeDasharray="3 3" />

  <XAxis
    type="number"
    label={{ value: 'Loss (ha)', position: 'insideBottom', offset: -5 }}
    tick={{ fill: '#000', fontWeight: 'bold' }} // <-- Make X-axis ticks bold and black
  />

  <YAxis
    type="category"
    dataKey="country"
    tick={{ fill: '#000', fontWeight: 'bold' }} // <-- Make Y-axis ticks bold and black
  />

  <Tooltip />
  <Legend />
  <Bar dataKey="loss" fill="#228B22" />
</BarChart>

          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ForestLoss;
