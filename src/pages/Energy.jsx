import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import EnergyComparisonChart from "../components/charts/EnergyComparisonChart";

const Energy = () => {
  const chartRef = useRef();
  const dataRef = useRef();

  const handleDownloadPDF = async () => {
    const chartElement = chartRef.current;
    const data = dataRef.current;

    if (!Array.isArray(data)) return;

    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text("⚡ Energy Overview Report", 14, 20);

    // 🖼️ Snapshot
    const canvas = await html2canvas(chartElement, {
      useCORS: true,
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 30, 270, 80);

    // 📊 Raw Data Table
    const rows = data.map((d) => [
      d.mode,
      d.Renewable,
      d.NonRenewable,
    ]);

    autoTable(pdf, {
      head: [["Mode", "Renewable (TWh)", "Non-Renewable (TWh)"]],
      body: rows,
      startY: 115,
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

      <div ref={chartRef}>
        <EnergyComparisonChart refData={dataRef} />
      </div>
    </div>
  );
};

export default Energy;
