import { useRef, useState } from "react";
import EnergyComparisonChart from "../components/charts/EnergyComparisonChart";

const Energy = () => {
  const chartRef = useRef();
  const dataRef = useRef();
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleDataReady = (data) => {
    if (!Array.isArray(data)) return;
    setIsLoading(false); // ✅ Stop loading

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
    <div className="p-2 space-y-3 bg-white text-black text-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">⚡ Energy Overview</h2>
      </div>

      {isLoading && (
        <p className="text-blue-600 text-sm italic">Loading energy data...</p>
      )}

      <div ref={chartRef}>
        <EnergyComparisonChart refData={dataRef} onDataReady={handleDataReady} />
      </div>

      <div className="bg-gray-100 p-2 rounded shadow text-sm">
        <h4 className="text-sm font-semibold mb-1">🔍 Analysis</h4>
        <p>{isLoading ? "Loading analysis based on current data..." : analysis}</p>
      </div>
    </div>
  );
};

export default Energy;
