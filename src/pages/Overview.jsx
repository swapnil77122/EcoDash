import { useState } from "react";
import GlobalTempChart from "../components/charts/GlobalTempChart";
import CO2BarChart from "../components/charts/CO2BarChart";
import CO2Map from "../components/maps/CO2Map";
import { fetchAQIByCity } from "../services/waqi";
import { Card } from "../components/ui/Card";
import useCO2GeoData from "../hooks/useCO2GeoData";

const Overview = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState("");

  const { geoData, loading } = useCO2GeoData();

  const handleAQISearch = async () => {
    try {
      const data = await fetchAQIByCity(city);
      setAqiData(data);
      setError("");
    } catch (err) {
      console.error("AQI fetch error:", err);
      setError("Unable to fetch AQI data for that city.");
      setAqiData(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white text-black">
      {/* 🔹 Header */}
      <Card>
        <h1 className="text-2xl font-bold mb-2 text-black">🌍 Global Climate Insights Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <p>🔺 Avg Temp: 1.1°C ↑</p>
          <p>🟢 CO2: 417 ppm ↑</p>
          <p>🟡 AQI: Moderate</p>
        </div>
      </Card>

      {/* 🔹 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-black">📈 Global Temperature Over Time</h2>
          <GlobalTempChart />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-black">🌍 Top Emitters</h2>
          <CO2BarChart />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-black">🗺️ CO2 Emissions by Country in Map</h2>
          {loading ? (
            <p className="text-gray-700">Loading CO₂ map data...</p>
          ) : geoData ? (
            <CO2Map data={geoData} />
          ) : (
            <p className="text-red-600">Failed to load CO₂ map data.</p>
          )}
        </Card>

        {/* AQI Search */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-black">🌫️ Live AQI by City</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="border border-gray-400 px-4 py-2 rounded-md w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              onClick={handleAQISearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto"
            >
              Get AQI
            </button>
          </div>

          {aqiData && (
            <div className="bg-green-50 p-4 rounded text-sm text-green-800 shadow-inner space-y-1">
              <p><strong>City:</strong> {aqiData.city}</p>
              <p><strong>AQI:</strong> {aqiData.aqi}</p>
              <p><strong>Main Pollutant:</strong> {aqiData.category?.toUpperCase() ?? 'N/A'}</p>
              <p><strong>Coordinates:</strong> Lat {aqiData.coords[0]}, Lon {aqiData.coords[1]}</p>
              <p><strong>Last Updated:</strong> {new Date(aqiData.updated).toLocaleString()}</p>

              <hr className="my-2 border-green-300" />

              <p className="font-semibold text-green-900">🌫️ Pollutant Concentrations:</p>
              <ul className="list-disc ml-5">
                {aqiData.iaqi.pm25 && <li>PM2.5: {aqiData.iaqi.pm25.v} µg/m³</li>}
                {aqiData.iaqi.pm10 && <li>PM10: {aqiData.iaqi.pm10.v} µg/m³</li>}
                {aqiData.iaqi.o3 && <li>Ozone (O₃): {aqiData.iaqi.o3.v} µg/m³</li>}
                {aqiData.iaqi.no2 && <li>Nitrogen Dioxide (NO₂): {aqiData.iaqi.no2.v} µg/m³</li>}
                {aqiData.iaqi.so2 && <li>Sulfur Dioxide (SO₂): {aqiData.iaqi.so2.v} µg/m³</li>}
                {aqiData.iaqi.co && <li>Carbon Monoxide (CO): {aqiData.iaqi.co.v} µg/m³</li>}
              </ul>

              <hr className="my-2 border-green-300" />

              <p className="font-semibold text-green-900">🌦️ Weather Info:</p>
              <ul className="list-disc ml-5">
                {aqiData.iaqi.t && <li>Temperature: {aqiData.iaqi.t.v} °C</li>}
                {aqiData.iaqi.h && <li>Humidity: {aqiData.iaqi.h.v} %</li>}
                {aqiData.iaqi.w && <li>Wind Speed: {aqiData.iaqi.w.v} m/s</li>}
              </ul>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </Card>
      </div>
    </div>
  );
};

export default Overview;
