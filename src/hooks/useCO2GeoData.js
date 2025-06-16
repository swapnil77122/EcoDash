import { useEffect, useState } from "react";

const useCO2GeoData = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMerge = async () => {
      try {
        // ✅ Fetch from public/data folder
        const [geoRes, csvRes] = await Promise.all([
          fetch("/data/countries.geojson"),
          fetch("/data/co2.csv"),
        ]);

        const geoJSON = await geoRes.json();
        const csvText = await csvRes.text();

        // ✅ Parse CSV to CO2 map
        const rows = csvText.trim().split("\n").slice(1); // remove header
        const co2Map = {};
        for (let row of rows) {
          const cols = row.split(",");
          const code = cols[1]; // ISO3
          const year = cols[2];
          const co2 = cols[3];
          if (year === "2022" && code && co2) {
            co2Map[code.trim()] = parseFloat(co2);
          }
        }

        // ✅ Merge CO2 into geoJSON
        const mergedFeatures = geoJSON.features.map((feature) => {
          const iso_a3 =
            feature.properties.ISO_A3 ||
            feature.properties.ISO_A3_CODE ||
            feature.properties.iso_a3 ||
            feature.properties.ADMIN_CODE;

          const co2 = co2Map[iso_a3] || 0;

          return {
            ...feature,
            properties: {
              ...feature.properties,
              co2,
            },
          };
        });

        setGeoData({
          type: "FeatureCollection",
          features: mergedFeatures,
        });
      } catch (err) {
        console.error("❌ Failed to load CO2/GeoJSON data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMerge();
  }, []);

  return { geoData, loading };
};

export default useCO2GeoData;
