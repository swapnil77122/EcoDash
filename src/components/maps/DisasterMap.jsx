import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
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

const ZoomLevelDisplay = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map]);

  return (
    <div
      className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded text-xs shadow"
      style={{ zIndex: 1000 }}
    >
      🔍 Zoom: {zoom}
    </div>
  );
};

const DisasterMap = () => {
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: 'All', region: 'All' });
  const [hoveredDisaster, setHoveredDisaster] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef();

  useEffect(() => {
    fetch('/data/disasters.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setDisasters(parsed.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const years = [...new Set(disasters.map((d) => d['Start Year']))].filter(Boolean);
  const regions = [...new Set(disasters.map((d) => d['Region']))].filter(Boolean);

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
      {/* Zoom Style */}
      <style>
        {`
          .leaflet-control-zoom {
            transform: scale(0.7);
            transform-origin: bottom left;
          }
        `}
      </style>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-4 text-black">
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

        <div className="flex items-center gap-2">
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

      {/* Error / Loading */}
      {error && <div className="text-red-500">Error: {error}</div>}
      {loading && (
        <div className="text-center text-lg font-semibold text-gray-700 my-4">
          Loading disaster data...
        </div>
      )}

      {/* Map */}
      {!loading && (
        <div ref={mapRef}>
          <MapContainer
            center={[10, 0]}
            zoom={2}
            scrollWheelZoom
            className="h-[70vh] w-full rounded shadow relative"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RegionFlyTo region={filters.region} />
            <ZoomLevelDisplay />

            {filteredDisasters.map((disaster, idx) => {
              const lat = parseFloat(disaster['Latitude']);
              const lon = parseFloat(disaster['Longitude']);
              if (!lat || !lon) return null;

              return (
                <CircleMarker
                  key={idx}
                  center={[lat, lon]}
                  radius={6}
                  pathOptions={{
                    color: '#ff0000',
                    fillColor: '#ff4d4d',
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{
                    mouseover: (e) => {
                      setHoveredDisaster(disaster);
                      setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
                    },
                    mousemove: (e) => {
                      setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
                    },
                    mouseout: () => setHoveredDisaster(null),
                  }}
                />
              );
            })}
          </MapContainer>
        </div>
      )}

      {/* Styled Table Tooltip */}
      {hoveredDisaster && (
        <div
          className="fixed bg-white text-xs border border-gray-400 rounded shadow-lg z-[1000]"
          style={{
            top: `${mousePos.y + 12}px`,
            left: `${mousePos.x + 12}px`,
            pointerEvents: 'none',
          }}
        >
          <table className="table-fixed border-collapse border border-gray-400 w-max text-[11px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1">Field</th>
                <th className="border border-gray-400 px-2 py-1">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Disaster</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Disaster Type']}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Country</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Country']}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Region</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Region']}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Year</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Start Year']}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Affected</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Total Affected'] || 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">Deaths</td>
                <td className="border border-gray-300 px-2 py-1">{hoveredDisaster['Total Deaths'] || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="text-sm text-red-600 font-semibold mt-4">
        <span
          className="inline-block mr-2 rounded-full"
          style={{
            width: '14px',
            height: '14px',
            backgroundColor: '#ff4d4d',
            border: '2px solid #ff0000',
            display: 'inline-block',
          }}
        ></span>
        Disaster Locations (hover for details)
      </div>
    </div>
  );
};

export default DisasterMap;
