import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Papa from "papaparse";
import {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

// Tooltip Component
const ManualTooltip = ({ hoverData, position }) => {
  if (!hoverData || !position) return null;
  const style = {
    position: "fixed",
    left: position.x + 10,
    top: position.y + 10,
    background: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "12px",
    pointerEvents: "none",
    zIndex: 1000,
  };
  return (
    <div style={style}>
      <strong>{hoverData.type}</strong>: {hoverData.value} TWh
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
      onMouseMove={(e) => {
        onHover(payload, { x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => onHover(null, null)}
    />
  );
};

// Main Chart
const EnergyComparisonChart = forwardRef(({ refData, onDataReady }, ref) => {
  const [chartData, setChartData] = useState([]);
  const [hoverData, setHoverData] = useState(null);
  const [mousePos, setMousePos] = useState(null);

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
      if (refData) refData.current = combined;
      if (typeof onDataReady === "function") onDataReady(combined); // ✅ Important!
    };

    fetchData();
  }, []);

  useImperativeHandle(ref, () => chartData, [chartData]);

  return (
    <div className="relative bg-white p-4 rounded-xl shadow text-black text-sm" style={{ userSelect: "none" }}>
      <h3 className="text-base font-semibold mb-3">🔋 Total Renewable vs Non-Renewable Energy (TWh)</h3>
      <ManualTooltip hoverData={hoverData} position={mousePos} />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="type" tick={{ fill: "#000", fontSize: 10, fontWeight: 500 }} />
          <YAxis tick={{ fill: "#000", fontSize: 10, fontWeight: 500 }} />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            shape={(props) => (
              <CustomBar
                {...props}
                onHover={(data, pos) => {
                  setHoverData(data);
                  setMousePos(pos);
                }}
              />
            )}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EnergyComparisonChart;
