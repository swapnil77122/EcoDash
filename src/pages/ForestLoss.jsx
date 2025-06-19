import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const years = Array.from({ length: 11 }, (_, i) => 2010 + i);

// Manual Tooltip
const ManualTooltip = ({ hoverData, position }) => {
  if (!hoverData || !position) return null;

  const style = {
    position: 'fixed',
    left: position.x + 10,
    top: position.y + 10,
    background: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '11px',
    pointerEvents: 'none',
    zIndex: 1000,
  };

  return (
    <div style={style}>
      <strong>{hoverData.country}</strong>: {hoverData.loss.toLocaleString()} ha
    </div>
  );
};

// Custom Bar
const CustomBar = ({ x, y, width, height, fill, payload, onHover }) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}
    onMouseMove={(e) => onHover(payload, { x: e.clientX, y: e.clientY })}
    onMouseLeave={() => onHover(null, null)}
  />
);

const ForestLoss = () => {
  const [allData, setAllData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [chartData, setChartData] = useState([]);
  const [hoverData, setHoverData] = useState(null);
  const [mousePos, setMousePos] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/data/forest_loss_all.csv');
      const csvText = await res.text();
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      const cleaned = parsed
        .map((row) => {
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
        .filter((d) => d.threshold === '30');

      setAllData(cleaned);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      const filtered = allData
        .map((row) => ({
          country: row.country,
          loss: row[selectedYear],
        }))
        .filter((d) => !isNaN(d.loss))
        .sort((a, b) => b.loss - a.loss)
        .slice(0, 20);

      setChartData(filtered);
    }
  }, [allData, selectedYear]);

  return (
    <div className="p-2 bg-white text-black text-xs min-h-[400px]">
      <h2 className="text-sm font-semibold mb-2">
        🌳 Forest Area Loss ({selectedYear})
      </h2>

      <div className="mb-2">
        <label className="mr-2 font-medium">Year:</label>
        <select
          className="p-1 rounded border border-gray-400 text-xs"
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

      <ManualTooltip hoverData={hoverData} position={mousePos} />

      {chartData.length === 0 ? (
        <p className="text-xs text-gray-500">Loading or no valid data found...</p>
      ) : (
        <div className="bg-white p-2 rounded border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="country"
                tick={{
                  fill: '#000',
                  fontSize: 9,
                  angle: -30,
                  textAnchor: 'end',
                }}
                interval={0}
                height={60}
              />
              <YAxis
                tick={{ fill: '#000', fontSize: 9 }}
                label={{
                  value: 'Loss (ha)',
                  angle: -90,
                  position: 'insideLeft',
                  dx: -10,
                  fontSize: 10,
                  fill: '#000',
                  fontWeight: 'bold',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar
                dataKey="loss"
                fill="#228B22"
                shape={(props) => (
                  <CustomBar
                    {...props}
                    onHover={(d, pos) => {
                      setHoverData(d);
                      setMousePos(pos);
                    }}
                  />
                )}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ForestLoss;
