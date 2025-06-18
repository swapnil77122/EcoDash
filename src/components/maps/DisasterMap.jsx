import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';

// Mapping of region names to coordinates
const regionCoords = {
  Africa: [1, 17],
  Asia: [34, 100],
  Europe: [54, 15],
  'North America': [45, -100],
  'South America': [-15, -60],
  Oceania: [-22, 130],
  'Central America': [15, -85],
  Caribbean: [18, -66],
  'Middle East': [30, 45],
};

const RegionFlyTo = ({ region }) => {
  const map = useMap();

  useEffect(() => {
    if (region !== 'All' && regionCoords[region]) {
      map.flyTo(regionCoords[region], 4, { duration: 1.5 });
    } else {
      map.flyTo([10, 0], 2, { duration: 1.5 });
    }
  }, [region, map]);

  return null;
};

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

  return (
    <div>
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-6 mb-4 text-black">
        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Year</span>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="text-black px-3 py-1 rounded border border-black"
          >
            <option value="All">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 text-black">
          <span className="font-semibold">Region</span>
          <select
            name="region"
            value={filters.region}
            onChange={handleChange}
            className="text-black px-3 py-1 rounded border border-black"
          >
            <option value="All">All</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500">Error loading data: {error}</div>}

      {/* Map */}
      <div ref={mapRef}>
        <MapContainer
          center={[10, 0]}
          zoom={2}
          scrollWheelZoom
          className="h-[80vh] w-full rounded shadow"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RegionFlyTo region={filters.region} />

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

      {/* Legend */}
      {/* Legend */}
<div className="text-sm text-red-600 font-semibold mt-4">
  <p>
    <span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2"></span>
    Disaster Locations (hover for details)
  </p>
</div>

    </div>
  );
};

export default DisasterMap;
