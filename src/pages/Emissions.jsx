import { useEffect, useRef, useState } from 'react';
import CO2BarChart from '../components/charts/CO2BarChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

const CSV_URL = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';
const TARGET_COUNTRIES = [
  'China', 'United States', 'India', 'Russia', 'Japan', 'Germany', 'Iran',
  'South Korea', 'Indonesia', 'Saudi Arabia', 'Canada', 'Mexico', 'Brazil',
  'South Africa', 'Australia', 'United Kingdom', 'Turkey', 'Italy', 'France', 'Thailand'
];

export default function Emissions() {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [year] = useState('2021'); // year state still used
  const [error, setError] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const idxCountry = headers.indexOf('country');
        const idxYear = headers.indexOf('year');
        const idxCo2 = headers.indexOf('co2');

        const allData = lines.slice(1).map(line => {
          const cols = line.split(',');
          return {
            country: cols[idxCountry],
            year: cols[idxYear],
            co2: parseFloat(cols[idxCo2]) || 0,
          };
        });

        setRawData(allData);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load CO₂ data.');
      });
  }, []);

  useEffect(() => {
    const filtered = rawData
      .filter(row => row.year === year && TARGET_COUNTRIES.includes(row.country))
      .map(row => ({ country: row.country, co2: row.co2 }));

    setData(filtered);
  }, [year, rawData]);

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
    pdf.text(`Global CO2 Emitters – ${year}`, 14, 20);
    pdf.addImage(imgData, 'PNG', 10, 25, 270, 90);

    pdf.setFontSize(12);
    pdf.text('Top CO2 Emissions by Country (in Mt):', 14, 125);

    const rows = data.map((item) => [
      item.country ?? 'N/A',
      item.co2?.toFixed(2) ?? 'N/A',
    ]);

    autoTable(pdf, {
      startY: 130,
      head: [['Country', 'CO₂ (Mt)']],
      body: rows.slice(0, 25),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    pdf.save(`CO2_Emissions_Report_${year}.pdf`);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] p-8 bg-white text-black text-sm">
      <h2 className="text-lg font-semibold mb-4">🌍 Global CO₂ Level</h2>

      {error && <p className="text-red-600">{error}</p>}
      {!rawData.length && !error && <p>Loading...</p>}

      <div ref={chartRef} className="mb-6">
        {data.length > 0 && <CO2BarChart data={data} year={year} />}
      </div>

      {data.length > 0 && (
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          📄 Download PDF Report
        </button>
      )}
    </div>
  );
}
