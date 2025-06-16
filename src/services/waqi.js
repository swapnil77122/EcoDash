const TOKEN = "ebbf5d4cf5041fd3c9048681f86b3c6478e6368e";

export const fetchAQIByCity = async (city) => {
  const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${TOKEN}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Network error");

  const json = await res.json();
  if (json.status !== "ok") throw new Error("Invalid city or API limit reached");

  return {
    aqi: json.data.aqi,
    city: json.data.city.name,
    category: json.data.dominentpol,
    updated: json.data.time.iso,
    coords: json.data.city.geo, // [lat, lon]
  };
};
