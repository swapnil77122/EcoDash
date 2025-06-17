import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import EnergyComparisonChart from "../components/charts/EnergyComparisonChart";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Energy = () => {
  const chartRef = useRef();
  const pcaChartRef = useRef();
  const dataRef = useRef();
  const [pcaData, setPcaData] = useState([]);

  useEffect(() => {
    fetch("/data/pca_energy.json")
      .then((res) => res.json())
      .then((data) => setPcaData(data));
  }, []);

  const handleDownloadPDF = async () => {
    const chartElement = chartRef.current;
    const pcaElement = pcaChartRef.current;
    const data = dataRef.current;

    if (!Array.isArray(data)) return;

    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text("⚡ Energy Overview Report", 14, 20);

    // 🖼️ Snapshot of bar chart
    const canvas = await html2canvas(chartElement, {
      useCORS: true,
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 30, 270, 80);

    // 📉 Snapshot of PCA chart
    if (pcaElement) {
      const canvas2 = await html2canvas(pcaElement, {
        useCORS: true,
        scale: 2,
      });
      const imgData2 = canvas2.toDataURL("image/png");
      pdf.addImage(imgData2, "PNG", 10, 115, 270, 80);
    }

    // 📊 Raw Data Table
    const rows = data.map((d) => [d.mode, d.Renewable, d.NonRenewable]);

    autoTable(pdf, {
      head: [["Mode", "Renewable (TWh)", "Non-Renewable (TWh)"]],
      body: rows,
      startY: 200,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    pdf.save("Energy_Overview_Report.pdf");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">⚡ Energy Overview</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📄 Download PDF
        </button>
      </div>

      {/* Bar Chart */}
      <div ref={chartRef}>
        <EnergyComparisonChart refData={dataRef} />
      </div>

      {/* PCA Chart */}
      <div ref={pcaChartRef} className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">
          📉 PCA Comparison: Renewable vs Non-Renewable
        </h3>
        {pcaData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <XAxis
                type="number"
                dataKey="PC1"
                name="Principal Component 1"
                tick={{ fill: "#000", fontSize: 12, fontWeight: "bold" }}
              />
              <YAxis
                type="number"
                dataKey="PC2"
                name="Principal Component 2"
                tick={{ fill: "#000", fontSize: 12, fontWeight: "bold" }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Renewable"
                data={pcaData.filter((d) => d.type === "Renewable")}
                fill="#22c55e"
              />
              <Scatter
                name="Non-Renewable"
                data={pcaData.filter((d) => d.type === "Non-Renewable")}
                fill="#ef4444"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Energy;
