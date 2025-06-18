import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useCountryCoords from "../../hooks/useCountryCoords";
import useCO2EmissionData from "../../hooks/useCO2EmissionData";

const featuredCountries = [
  "Nepal", "North Korea", "Mongolia", "Morocco", "Malawi",
  "Kazakhstan", "Georgia", "Bhutan", "Ghana", "Honduras", "Romania", "Rwanda", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "Sri Lanka", "Sudan", "Suriname",
  "Syria", "Tajikistan", "Tanzania", "Togo", "Trinidad and Tobago",
  "Tunisia", "Turkmenistan", "Tuvalu", "Uganda", "United Arab Emirates"
];

const years = ["2015", "2016", "2017", "2018", "2019", "2020"];

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

// Component to zoom to selected country
const CountryZoom = ({ selectedCountry, coordsMap }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCountry && coordsMap[selectedCountry]) {
      const { lat, lng } = coordsMap[selectedCountry];
      map.flyTo([lat, lng], 5);
    } else {
      map.flyTo([20, 0], 2); // default global view
    }
  }, [selectedCountry, coordsMap, map]);

  return null;
};

const CO2Map = () => {
  const coordsMap = useCountryCoords();
  const emissions = useCO2EmissionData();

  const [selectedYear, setSelectedYear] = useState("2020");
  const [selectedCountry, setSelectedCountry] = useState("");

  const filteredEmissions = emissions.filter(
    (e) => e.Year === selectedYear
  );

  return (
    <div className="space-y-4">
      {/* Filters side by side */}
      {/* Filters side by side */}
<div className="flex flex-row flex-wrap gap-2 justify-start items-center text-sm">
  <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    className="px-2 py-1 border rounded-md shadow text-sm"
  >
    {years.map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>

  <select
    value={selectedCountry}
    onChange={(e) => setSelectedCountry(e.target.value)}
    className="px-2 py-1 border rounded-md shadow text-sm w-48"
  >
    <option value="">All</option>
    {featuredCountries.map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
</div>


      {/* Map */}
      <MapContainer
        key={`${selectedYear}-${selectedCountry}`}
        center={[20, 0]}
        zoom={2}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CountryZoom selectedCountry={selectedCountry} coordsMap={coordsMap} />

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
