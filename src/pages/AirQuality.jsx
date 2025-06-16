import { useState, useRef } from "react";
import { fetchAQIByCity } from "../services/waqi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const AirQuality = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [position, setPosition] = useState([20, 0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exportRef = useRef(null); // ⬅️ Wrap AQI info + Map

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setAqiData(null);

    try {
      const data = await fetchAQIByCity(city);
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
        useCORS: true, // helps with leaflet map tiles
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

  return (
    <div className="space-y-4">
      <h2 className="text-white bg-gray-800 text-2xl font-bold p-2 rounded">
        Global Air Quality
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city name (e.g., Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {aqiData && (
        <>
          {/* ⬇️ Container for PDF snapshot */}
          <div ref={exportRef} className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <p><strong>City:</strong> {aqiData.city}</p>
              <p><strong>AQI:</strong> {aqiData.aqi}</p>
              <p><strong>Main Pollutant:</strong> {aqiData.category}</p>
              <p><strong>Updated:</strong> {new Date(aqiData.updated).toLocaleString()}</p>
            </div>

            <MapContainer
              center={position}
              zoom={aqiData ? 10 : 2}
              scrollWheelZoom={true}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <div>
                    <strong>{aqiData.city}</strong><br />
                    AQI: {aqiData.aqi}<br />
                    Pollutant: {aqiData.category}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* ⬇️ Download button */}
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default AirQuality;
