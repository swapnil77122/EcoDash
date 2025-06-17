import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const ForestLoss = () => {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/glad_alerts_loss.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GeoJSON');
        return res.json();
      })
      .then((data) => setGeoData(data))
      .catch((err) => setError(err.message));
  }, []);

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;

    const defaultStyle = {
      color: 'red',
      weight: 1,
      fillOpacity: 0.3,
    };

    const highlightStyle = {
      color: 'orange',
      weight: 2,
      fillOpacity: 0.6,
    };

    layer.setStyle(defaultStyle);

    layer.on({
      mouseover: (e) => {
        e.target.setStyle(highlightStyle);
        e.target.openTooltip();
        e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(defaultStyle);
        e.target.closeTooltip();
      },
    });

    // Attach a tooltip to each layer
    const tooltipContent = `
      <div style="font-size: 12px;">
        <strong>🌲 Forest Alert Region</strong><br/>
        <ul style="padding-left: 1rem; margin: 0;">
          <li>📅 2015: <a href="${props.data_2015}" target="_blank">View</a></li>
          <li>📅 2016: <a href="${props.data_2016}" target="_blank">View</a></li>
          <li>📅 2017: <a href="${props.data_2017}" target="_blank">View</a></li>
          <li>📅 2018: <a href="${props.data_2018}" target="_blank">View</a></li>
        </ul>
      </div>
    `;
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: 'top',
      opacity: 0.9,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl text-white font-bold mb-4">🌲 Forest Loss (GLAD Alerts)</h2>

      {error && (
        <div className="text-red-600 font-semibold mb-2">
          Error loading map: {error}
        </div>
      )}

      <div className="mb-4 bg-white text-sm p-3 rounded shadow max-w-xl">
        <strong>Legend:</strong>
        <ul className="list-disc pl-5">
          <li><span className="text-red-600 font-bold">Red areas</span> indicate forest loss alerts.</li>
          <li>Hover to view info and dataset links (2015–2018).</li>
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
            <GeoJSON data={geoData} onEachFeature={onEachFeature} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ForestLoss;
