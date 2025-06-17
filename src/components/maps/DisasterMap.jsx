import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DisasterMap = () => {
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: 'All',
    region: 'All',
  });
  const mapRef = useRef();

  const years = [...new Set(disasters.map((d) => d['Start Year']))].filter(Boolean);
  const regions = [...new Set(disasters.map((d) => d['Region']))].filter(Boolean);

  useEffect(() => {
    fetch('/data/disasters.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setDisasters(parsed.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredDisasters = disasters.filter((d) => {
    return (
      (filters.year === 'All' || d['Start Year'] === filters.year) &&
      (filters.region === 'All' || d['Region'] === filters.region)
    );
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDownloadPDF = async () => {
    const mapElement = mapRef.current;

    if (!mapElement) return;

    const pdf = new jsPDF('landscape', 'mm', 'a4');

    pdf.setFontSize(18);
    pdf.setFontSize(12);
    pdf.text('Plotted Disaster Locations:', 135);

    const rows = filteredDisasters
      .filter((d) => d.Latitude && d.Longitude)
      .slice(0, 20)
      .map((d) => [
        d['Disaster Type'] || 'N/A',
        d.Country || 'N/A',
        d.Region || 'N/A',
        d['Start Year'] || 'N/A',
        d['Total Affected'] || 'N/A',
        d['Total Deaths'] || 'N/A',
      ]);

    if (rows.length > 0) {
      autoTable(pdf, {
        head: [['Type', 'Country', 'Region', 'Year', 'Affected', 'Deaths']],
        body: rows,
        startY: 140,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
      });
    } else {
      pdf.text('No data available for selected filters.', 14, 145);
    }

    pdf.save('DisasterMap.pdf');
  };

  return (
    <div>
      <div className="flex flex-wrap  mb-4 text-white">
        <div>
          <label className="mr-2">Year:</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded border border-black"
          >
            <option value="All">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2">Region:</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleChange}
            className="text-black px-2 py-1 rounded border border-black"
          >
            <option value="All">All</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          📄 Download PDF
        </button>
      </div>

      {error && <div className="text-red-500">Error loading data: {error}</div>}

      <div ref={mapRef}>
        <MapContainer
          center={[10, 0]}
          zoom={2}
          scrollWheelZoom
          className="h-[80vh] w-full rounded shadow"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredDisasters.map((disaster, idx) => {
            const lat = parseFloat(disaster['Latitude']);
            const lon = parseFloat(disaster['Longitude']);
            if (!lat || !lon) return null;

            return (
              <CircleMarker
                key={idx}
                center={[lat, lon]}
                radius={6}
                pathOptions={{ color: 'red', fillOpacity: 0.6 }}
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                }}
              >
                <Popup>
                  <strong>{disaster['Disaster Type']}</strong>
                  <br />
                  {disaster.Country}, {disaster.Region}
                  <br />
                  {disaster['Start Year']}
                  <br />
                  Affected: {disaster['Total Affected'] || 'N/A'}
                  <br />
                  Deaths: {disaster['Total Deaths'] || 'N/A'}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="text-sm text-white mt-4">
        <p>
          <span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2"></span>
          Disaster Locations (hover for details)
        </p>
      </div>
    </div>
  );
};

export default DisasterMap;
