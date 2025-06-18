import { useRef, useState } from "react";
import EnergyComparisonChart from "../components/charts/EnergyComparisonChart";

const Energy = () => {
  const chartRef = useRef();
  const dataRef = useRef();
  const [analysis, setAnalysis] = useState("");

  const handleDataReady = (data) => {
    if (!Array.isArray(data)) return;

    const renewable = data.find(d => d.type === "Renewable")?.value || 0;
    const nonRenewable = data.find(d => d.type === "Non-Renewable")?.value || 0;
    const total = renewable + nonRenewable;
    if (total === 0) return;

    const renewablePct = ((renewable / total) * 100).toFixed(1);
    const nonRenewablePct = ((nonRenewable / total) * 100).toFixed(1);

    const message =
      `The global energy production is currently dominated by non-renewable sources, which account for ${nonRenewablePct}% of the total output. ` +
      `Renewable energy sources contribute only ${renewablePct}%, highlighting a significant reliance on fossil fuels. ` +
      `This imbalance emphasizes the urgent need for investments in renewable technologies to achieve sustainable energy goals.`;

    setAnalysis(message);
  };

  return (
    <div className="p-4 space-y-6 bg-white text-black text-sm min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold">⚡ Energy Overview</h2>
      </div>

      <div ref={chartRef}>
        <EnergyComparisonChart refData={dataRef} onDataReady={handleDataReady} />
      </div>

      <div className="bg-gray-100 p-4 rounded shadow text-sm">
        <h4 className="text-base font-semibold mb-2">🔍 Analysis</h4>
        <p>{analysis || "Loading analysis based on current data..."}</p>
      </div>
    </div>
  );
};

export default Energy;
