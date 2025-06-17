import { useEffect, useRef, useState } from 'react';
import { fetchCO2Data } from '../services/noaa';
import CO2BarChart from '../components/charts/CO2BarChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

export default function Emissions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    fetchCO2Data()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError('Failed to load CO₂ data.');
      });
  }, []);

  const handleDownloadPDF = async () => {
    const chartElement = chartRef.current;
    if (!chartElement || !Array.isArray(data)) return;

    const canvas = await html2canvas(chartElement, {
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    pdf.setFontSize(18);
    pdf.text('Global CO₂ Levels', 14, 20);

    pdf.addImage(imgData, 'PNG', 10, 25, 270, 90);

    pdf.setFontSize(12);
    pdf.text('Year-wise CO₂ Readings (ppm):', 14, 125);

    const rows = data.map((item) => [
      item.year?.toString() ?? 'N/A',
      item.value?.toFixed(2) ?? 'N/A',
    ]);

    autoTable(pdf, {
      startY: 130,
      head: [['Year', 'CO₂ (ppm)']],
      body: rows.slice(0, 25),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    pdf.save('CO2_Emissions_Report.pdf');
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] p-8 bg-white text-black">
      <h2 className="text-2xl font-semibold mb-4">🌍 Global CO₂ Levels</h2>

      {error && <p className="text-red-600">{error}</p>}
      {!data && !error && <p>Loading...</p>}

      <div ref={chartRef} className="mb-6">
        {data && <CO2BarChart data={data} />}
      </div>

      {data && (
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📄 Download PDF Report
        </button>
      )}
    </div>
  );
}
