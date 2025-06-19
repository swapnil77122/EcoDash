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
    pdf.setFontSize(14);
    pdf.text('Global Sea Level Rise - Raw Data Report', 14, 20);

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
    <div className="p-2 space-y-2 bg-white text-black text-xs">
      <Card>
        <h1 className="text-sm font-semibold text-black">🌊 Global Sea Level Rise</h1>
        <p className="text-gray-700 text-xs">
          Observe sea level changes over time from NOAA data.
        </p>
      </Card>

      <div className="flex justify-end items-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
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
