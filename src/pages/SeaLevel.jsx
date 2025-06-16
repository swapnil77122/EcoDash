import { Card, CardContent } from "../components/ui/Card";
import SeaLevelLineChart from "../components/charts/SeaLevelLineChart";
import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SeaLevel = () => {
  const chartRef = useRef();

  const handleDownloadPDF = () => {
    const data = chartRef.current;
    if (!Array.isArray(data)) return;

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    pdf.setFontSize(16);
    pdf.text('🌊 Global Sea Level Rise - Raw Data Report', 14, 20);

    const rows = data.map(d => [d.year, d.level]);

    autoTable(pdf, {
      head: [['Year', 'Sea Level (mm)']],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }, // Tailwind blue-500
    });

    pdf.save('SeaLevel_RawData.pdf');
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-white">🌊 Global Sea Level Rise</h1>
        <p className="text-gray-600 text-sm">
          Observe sea level changes over time from NOAA data.
        </p>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">📉 Sea Level Trends</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded text-white"
        >
          📄 Download Raw Data
        </button>
      </div>

      <Card>
        <SeaLevelLineChart refData={chartRef} />
      </Card>
    </div>
  );
};

export default SeaLevel;
