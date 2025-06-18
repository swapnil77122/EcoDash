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

// Manual Tooltip Component
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
    fontSize: '12px',
    pointerEvents: 'none',
    zIndex: 1000,
  };

  return (
    <div style={style}>
      <strong>{hoverData.country}</strong>: {hoverData.loss.toLocaleString()} ha
    </div>
  );
};

// Custom Bar Shape
const CustomBar = ({ x, y, width, height, fill, payload, onHover }) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      onMouseMove={(e) =>
        onHover(payload, { x: e.clientX, y: e.clientY })
      }
      onMouseLeave={() => onHover(null, null)}
    />
  );
};

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
    <div className="p-4 bg-white text-black text-sm min-h-screen">
      <h2 className="text-base font-semibold mb-4">
        🌳 Forest Area Loss ({selectedYear})
      </h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Year:</label>
        <select
          className="p-1 rounded shadow border border-black text-sm"
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
        <p>Loading or no valid data found...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow text-sm">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="country"
                type="category"
                interval={0}
                tick={{
                  fill: '#000',
                  fontWeight: 'normal',
                  fontSize: 10,
                  angle: -35,
                  textAnchor: 'end',
                }}
                height={80}
              />
              <YAxis
                type="number"
                tick={{
                  fill: '#000',
                  fontWeight: 'normal',
                  fontSize: 10,
                }}
                label={{
                  value: 'Forest Loss (ha)',
                  angle: -90,
                  position: 'insideLeft',
                  dx: -40,
                  fill: '#000',
                  fontWeight: 'bold',
                  fontSize: 10,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
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
