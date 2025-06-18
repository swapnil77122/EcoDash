import { useState, useEffect } from "react";
import GlobalTempChart from "../components/charts/GlobalTempChart";
import CO2BarChart from "../components/charts/CO2BarChart";
import CO2Map from "../components/maps/CO2Map";
import { fetchAQIByCity } from "../services/waqi";
import { Card, CardContent } from "../components/ui/Card";
import useCO2GeoData from "../hooks/useCO2GeoData";

const CardSection = ({ title, children }) => (
  <div className="border border-blue-200">
    <div className="bg-blue-700 text-white text-center text-sm font-medium py-1">
      {title}
    </div>
    <Card className="!border-none !rounded-none">
      <CardContent className="p-2">{children}</CardContent>
    </Card>
  </div>
);

const Overview = () => {
  const [city, setCity] = useState("Delhi");
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState("");

  const { geoData, loading } = useCO2GeoData();

  const [latestCO2, setLatestCO2] = useState(null);
  const [globalTemp, setGlobalTemp] = useState(null);

  const fetchAQI = async (cityName) => {
    try {
      const data = await fetchAQIByCity(cityName);
      setAqiData(data);
      setError("");
    } catch (err) {
      console.error("AQI fetch error:", err);
      setError("Unable to fetch AQI data for that city.");
      setAqiData(null);
    }
  };

  useEffect(() => {
    fetchAQI("Delhi");

    // CO2
    fetch("https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");
        const co2Index = headers.indexOf("co2");
        const locationIndex = headers.indexOf("country");

        for (let i = lines.length - 1; i > 0; i--) {
          const row = lines[i].split(",");
          if (row[locationIndex] === "World" && row[co2Index]) {
            setLatestCO2(parseFloat(row[co2Index]).toFixed(1));
            break;
          }
        }
      });

    // Global temperature (Berkeley Earth dataset)
      fetch("https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Global%20temperature%20anomaly%20-%20Met%20Office%20(HadCRUT4)/Global%20temperature%20anomaly%20-%20Met%20Office%20(HadCRUT4).csv")
    .then((res) => res.text())
    .then((csvText) => {
      const rows = csvText.trim().split("\n");
      const headers = rows[0].split(",");
      const anomalyIndex = headers.indexOf("Median temperature anomaly from 1961-1990 average");

      if (rows.length > 1) {
        for (let i = rows.length - 1; i > 0; i--) {
          const row = rows[i].split(",");
          const anomaly = row[anomalyIndex];
          if (anomaly) {
            setGlobalTemp(parseFloat(anomaly).toFixed(2));
            break;
          }
        }
      }
    });
}, []);

  const handleAQISearch = () => {
    if (city.trim()) fetchAQI(city);
  };

  return (
    <div className="p-4 space-y-4 bg-white text-black">
      <div className="bg-blue-700 text-white text-center text-xl md:text-2xl font-bold py-4 px-2 rounded shadow">
  🌍 Global Climate Insights Dashboard
</div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
        <Card className="p-2 text-center">
          🔺 Avg Temp: {globalTemp ? `${globalTemp}°C ↑` : "Loading..."}
        </Card>
        <Card className="p-2 text-center">
          🟢 CO2: {latestCO2 ? `${latestCO2} ppm ↑` : "Loading..."}
        </Card>
        <Card className="p-2 text-center">
          🟡 AQI: {aqiData ? aqiData.category : "Loading..."}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSection title="📈 Global Temperature Over Time">
          <div className="w-full h-[500px]">
            <GlobalTempChart />
          </div>
        </CardSection>

        <CardSection title="🌍 Top Emitters">
          <div className="w-full h-[450px]">
            <CO2BarChart />
          </div>
        </CardSection>

        <CardSection title="🗘️ CO2 Emissions by Country in Map">
          <div className="w-full h-[500px]">
            {loading ? (
              <p className="text-gray-700 text-sm">Loading CO₂ map data...</p>
            ) : geoData ? (
              <CO2Map data={geoData} />
            ) : (
              <p className="text-red-600 text-sm">Failed to load CO₂ map data.</p>
            )}
          </div>
        </CardSection>

        <CardSection title="🌫️ Live AQI by City">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="border border-gray-400 px-3 py-1 rounded-md w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
            />
            <button
              onClick={handleAQISearch}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 w-full md:w-auto text-sm"
            >
              Get AQI
            </button>
          </div>

          {aqiData && (
            <div className="bg-green-50 p-2 rounded text-green-800 shadow-inner max-h-[600px] overflow-auto text-sm space-y-1">
              <p>
                <strong>City:</strong> {aqiData.city}
              </p>
              <p>
                <strong>AQI:</strong> {aqiData.aqi}
              </p>
              <p>
                <strong>Main Pollutant:</strong>{" "}
                {aqiData.category?.toUpperCase() ?? "N/A"}
              </p>
              <p>
                <strong>Coordinates:</strong> Lat {aqiData.coords[0]}, Lon{" "}
                {aqiData.coords[1]}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(aqiData.updated).toLocaleString()}
              </p>
              <hr className="my-1 border-green-300" />
              <p className="font-semibold text-green-900">
                🌫️ Pollutant Concentrations:
              </p>
              <ul className="list-disc ml-5">
                {aqiData.iaqi.pm25 && (
                  <li>PM2.5: {aqiData.iaqi.pm25.v} µg/m³</li>
                )}
                {aqiData.iaqi.pm10 && (
                  <li>PM10: {aqiData.iaqi.pm10.v} µg/m³</li>
                )}
                {aqiData.iaqi.o3 && (
                  <li>Ozone (O₃): {aqiData.iaqi.o3.v} µg/m³</li>
                )}
                {aqiData.iaqi.no2 && (
                  <li>Nitrogen Dioxide (NO₂): {aqiData.iaqi.no2.v} µg/m³</li>
                )}
                {aqiData.iaqi.so2 && (
                  <li>Sulfur Dioxide (SO₂): {aqiData.iaqi.so2.v} µg/m³</li>
                )}
                {aqiData.iaqi.co && (
                  <li>Carbon Monoxide (CO): {aqiData.iaqi.co.v} µg/m³</li>
                )}
              </ul>
              <hr className="my-1 border-green-300" />
              <p className="font-semibold text-green-900">🌦️ Weather Info:</p>
              <ul className="list-disc ml-5">
                {aqiData.iaqi.t && (
                  <li>Temperature: {aqiData.iaqi.t.v} °C</li>
                )}
                {aqiData.iaqi.h && <li>Humidity: {aqiData.iaqi.h.v} %</li>}
                {aqiData.iaqi.w && (
                  <li>Wind Speed: {aqiData.iaqi.w.v} m/s</li>
                )}
              </ul>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </CardSection>
      </div>
    </div>
  );
};

export default Overview;
