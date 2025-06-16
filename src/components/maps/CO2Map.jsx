import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // ✅ Leaflet import for L.control and L.DomUtil

const CO2Map = ({ data }) => {
  const [minCO2, setMinCO2] = useState(0);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (!data) return;

    const filtered = {
      ...data,
      features: data.features.filter((f) => (f.properties.co2 || 0) >= minCO2),
    };

    setFilteredData(filtered);
    console.log(`🔎 Filtered: ${filtered.features.length} countries >= ${minCO2} Mt`);
  }, [data, minCO2]);

  const getColor = (d) => {
    return d > 1000 ? "#800026" :
           d > 500  ? "#BD0026" :
           d > 200  ? "#E31A1C" :
           d > 100  ? "#FC4E2A" :
           d > 50   ? "#FD8D3C" :
           d > 20   ? "#FEB24C" :
           d > 10   ? "#FED976" :
                      "#FFEDA0";
  };

  const onEachCountry = (feature, layer) => {
    const country = feature.properties.ADMIN || feature.properties.name || "Unknown";
    const co2 = feature.properties.co2 || 0;

    console.log(`🌐 ${country}: ${co2} Mt`);

    layer.bindPopup(`<strong>${country}</strong><br/>CO₂: ${co2.toFixed(2)} Mt`);
    layer.setStyle({
      fillColor: getColor(co2),
      fillOpacity: 0.7,
      color: "#333",
      weight: 0.8,
    });
  };

  const Legend = () => {
    const map = useMap();

    useEffect(() => {
      const legend = L.control({ position: "bottomright" });

      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000];

        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            `<i style="background:${getColor(grades[i] + 1)}"></i> ` +
            `${grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}<br>` : "+"}`;
        }
        return div;
      };

      legend.addTo(map);
      return () => map.removeControl(legend);
    }, [map]);

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="minCO2" className="text-sm font-medium">Min CO₂ (Mt):</label>
        <input
          id="minCO2"
          type="range"
          min="0"
          max="1000"
          step="50"
          value={minCO2}
          onChange={(e) => setMinCO2(Number(e.target.value))}
          className="w-full max-w-xs"
        />
        <span className="text-sm">{minCO2} Mt</span>
      </div>

      <MapContainer center={[20, 0]} zoom={2} style={{ height: "450px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredData && (
          <GeoJSON
            key={minCO2}
            data={filteredData}
            onEachFeature={onEachCountry}
          />
        )}
        <Legend />
      </MapContainer>
    </div>
  );
};

export default CO2Map;
