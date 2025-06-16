import { useState } from "react";
import GlobalTempChart from "../components/charts/GlobalTempChart";
import CO2BarChart from "../components/charts/CO2BarChart";
import CO2Map from "../components/maps/CO2Map";
import { fetchAQIByCity } from "../services/waqi";
import { Card, CardContent } from "../components/ui/Card";
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
    <div className="p-6 space-y-6">
      {/* 🔹 Header */}
      <Card>
        <h1 className="text-2xl font-bold mb-2 text-white">🌍 Global Climate Insights Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <p className="text-white">🔺 Avg Temp: 1.1°C ↑</p>
          <p className="text-white ">🟢 CO2: 417 ppm ↑</p>
          <p className="text-white">🟡 AQI: Moderate</p>
        </div>
      </Card>

      {/* 🔹 2-Column Grid for Charts and Maps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🔸 Global Temperature Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-white">📈 Global Temperature Over Time</h2>
          <GlobalTempChart />
        </Card>

        {/* 🔸 CO2 Bar Chart */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-white">🌍 Top 10 Emitters (2024)</h2>
          <CO2BarChart />
        </Card>

        {/* 🔸 CO2 Map */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-white">🗺️ CO2 Emissions by Country</h2>
          {loading ? (
            <p className="text-gray-500 text-white">Loading CO₂ map data...</p>
          ) : geoData ? (
            <CO2Map data={geoData} />
          ) : (
            <p className="text-red-500 text-white">Failed to load CO₂ map data.</p>
          )}
        </Card>

        {/* 🔸 AQI Search */}
        <Card className="w-full min-h-fit">
  <h2 className="text-xl font-semibold mb-4 text-white">🌫️ Live AQI by City</h2>
  
  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
    <input
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      placeholder="Enter city name"
      className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      onClick={handleAQISearch}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto "
    >
      Get AQI
    </button>
  </div>

  {aqiData && (
    <div className="bg-green-50 p-4 rounded text-sm text-green-800 shadow-inner space-y-1">
      <p><strong>AQI:</strong> {aqiData.aqi}</p>
      <p><strong>Pollutant:</strong> {aqiData.category.toUpperCase()}</p>
      <p><strong>Last Update:</strong> {new Date(aqiData.updated).toLocaleString()}</p>
    </div>
  )}

  {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
</Card>

      </div>
    </div>
  );
};

export default Overview;
