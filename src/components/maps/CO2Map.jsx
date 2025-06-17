import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useCountryCoords from "../../hooks/useCountryCoords";
import useCO2EmissionData from "../../hooks/useCO2EmissionData";

const CO2Map = () => {
  const coordsMap = useCountryCoords();
  const emissions = useCO2EmissionData();
  const [selectedYear, setSelectedYear] = useState("2020");

  const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

  const getColor = (co2) => {
    return co2 > 1000000000 ? "#800026" :
           co2 > 500000000  ? "#BD0026" :
           co2 > 200000000  ? "#E31A1C" :
           co2 > 100000000  ? "#FC4E2A" :
           co2 > 50000000   ? "#FD8D3C" :
           co2 > 20000000   ? "#FEB24C" :
           co2 > 10000000   ? "#FED976" :
                              "#FFEDA0";
  };

  const filteredEmissions = emissions.filter((e) => e.Year === selectedYear);

  return (
    <div className="space-y-4">
      {/* Dropdown Filter */}
      <div className="flex justify-end">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded-md shadow"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Map */}
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "450px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredEmissions.map((row, idx) => {
          const co2 = parseFloat(row["CO2 emission (Tons)"]);
          const coords = coordsMap[row.Country];
          if (!coords || isNaN(co2)) return null;

          return (
            <CircleMarker
              key={idx}
              center={[coords.lat, coords.lng]}
              radius={8}
              fillColor={getColor(co2)}
              color="#333"
              weight={0.5}
              fillOpacity={0.8}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <strong>{row.Country}</strong><br />
                  Year: {row.Year}<br />
                  CO₂: {Number(co2).toLocaleString()} Tons
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CO2Map;
