import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const ForestLoss = () => {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/glad_alerts_loss.geojson')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load GeoJSON');
        }
        return res.json();
      })
      .then((data) => setGeoData(data))
      .catch((err) => setError(err.message));
  }, []);

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    const popupContent = `
      <strong>GLAD Alert Region</strong><br/>
      <ul style="padding-left: 1rem">
        <li>2015: <a href="${props.data_2015}" target="_blank" rel="noopener noreferrer">View</a></li>
        <li>2016: <a href="${props.data_2016}" target="_blank" rel="noopener noreferrer">View</a></li>
        <li>2017: <a href="${props.data_2017}" target="_blank" rel="noopener noreferrer">View</a></li>
        <li>2018: <a href="${props.data_2018}" target="_blank" rel="noopener noreferrer">View</a></li>
      </ul>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-white font-bold mb-4">
        🌲 Forest Loss (GLAD Alerts)
      </h2>

      {error && (
        <div className="text-red-600 font-semibold mb-2">
          Error loading map: {error}
        </div>
      )}

      <div className="mb-4 bg-white text-sm p-3 rounded shadow max-w-xl">
        <strong>Legend:</strong>
        <ul className="list-disc pl-5">
          <li><span className="text-red-600 font-bold">Red highlighted regions</span> indicate areas with tree cover loss alerts.</li>
          <li>Click on any region to see data links for each year (2015–2018).</li>
          <li>Links open remote GLAD alert datasets hosted on <a href="https://globalforestwatch.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Global Forest Watch</a>.</li>
        </ul>
      </div>

      <div className="h-[80vh] w-full rounded overflow-hidden shadow">
        <MapContainer
          center={[0, 20]}
          zoom={3}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geoData && (
            <GeoJSON
              data={geoData}
              style={() => ({
                color: 'red',
                weight: 1,
                fillOpacity: 0.3,
              })}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ForestLoss;
