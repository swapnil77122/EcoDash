const CORS_PROXY = "https://corsproxy.io/?";
const BASE_URL = "https://api.openaq.org/v2/latest";

export const fetchAQIByCity = async (city) => {
  const url = `${CORS_PROXY}${BASE_URL}?city=${encodeURIComponent(city)}`;

  const response = await fetch(url);
  const result = await response.json();

  if (result.results && result.results.length > 0) {
    const measurement = result.results[0].measurements[0];
    return {
      aqi: measurement.value,
      category: measurement.parameter.toUpperCase()
    };
  } else {
    throw new Error("No AQI data found.");
  }
};
