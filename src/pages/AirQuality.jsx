// src/pages/AirQuality.jsx
import { useState, useRef, useEffect } from "react";
import { fetchAQIByCity } from "../services/waqi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Suggestion List
const citySuggestions = [
 "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", 
  "Lucknow", "Kanpur", "Nagpur", "Bhopal",
  "Ludhiana", "Agra",
  "Coimbatore", "Chandigarh",

  // International - Major Cities
  "New York", "Los Angeles",  "San Francisco", "London",
  "Paris", "Berlin", "Tokyo", "Osaka", "Seoul",
  "Beijing", "Shanghai", "Hong Kong", "Dubai", "Singapore",
  "Bangkok", "Kuala Lumpur", "Toronto", "Vancouver", "Sydney",
  "Melbourne", "Mexico City", "Moscow", "Istanbul"
];

// Component to show zoom level
const ZoomLevelDisplay = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => map.off("zoomend", handleZoom);
  }, [map]);

  return (
    <div
      className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded text-xs shadow z-[1000]"
      style={{ fontSize: "12px" }}
    >
      🔍 Zoom: {zoom}
    </div>
  );
};

const AirQuality = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [position, setPosition] = useState([20, 0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const exportRef = useRef(null);

  const handleSearch = async (cityName = city) => {
    setLoading(true);
    setError("");
    setAqiData(null);
    setSuggestions([]);

    try {
      const data = await fetchAQIByCity(cityName);
      setAqiData(data);
      setPosition(data.coords);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (exportRef.current) {
      const canvas = await html2canvas(exportRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`${city}_AirQuality_Map.pdf`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.trim().length > 0) {
      const filtered = citySuggestions.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity(selectedCity);
    setSuggestions([]);
    handleSearch(selectedCity);
  };

  return (
    <div className="min-h-screen p-4 bg-white text-black text-sm">
      <h2 className="text-xl font-bold mb-4">🌍 Global Air Quality</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4 relative w-full md:w-[60%]">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded w-full text-sm"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 shadow text-sm max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-3 py-1 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm min-w-[100px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {aqiData ? (
        <>
          <div ref={exportRef} className="space-y-4 text-sm">
            <div className="bg-white p-4 rounded shadow border border-gray-200 text-sm">
              <p><strong>City:</strong> {aqiData.city}</p>
              <p><strong>AQI:</strong> {aqiData.aqi}</p>
              <p><strong>Main Pollutant:</strong> {aqiData.category}</p>
              <p><strong>Updated:</strong> {new Date(aqiData.updated).toLocaleString()}</p>
            </div>

            <MapContainer
              center={position}
              zoom={aqiData ? 10 : 2}
              scrollWheelZoom={true}
              className="relative"
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <div className="text-xs">
                    <strong>{aqiData.city}</strong><br />
                    AQI: {aqiData.aqi}<br />
                    Pollutant: {aqiData.category}
                  </div>
                </Popup>
              </Marker>

              {/* Zoom Level Display */}
              <ZoomLevelDisplay />

              {/* Zoom Control Scaling */}
              <style>
                {`
                  .leaflet-control-zoom {
                    transform: scale(0.7);
                    transform-origin: bottom left;
                  }
                `}
              </style>
            </MapContainer>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 text-sm"
          >
            📄 Download PDF
          </button>
        </>
      ) : (
        loading && (
          <p className="text-gray-600 italic mt-2">Fetching AQI data...</p>
        )
      )}
    </div>
  );
};

export default AirQuality;
