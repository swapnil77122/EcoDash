import { useEffect, useState } from "react";
import Papa from "papaparse";

const useCountryCoords = () => {
  const [coordsMap, setCoordsMap] = useState({});

  useEffect(() => {
    Papa.parse("/data/country_coords.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const map = {};
        result.data.forEach(({ Country, Latitude, Longitude }) => {
          if (Country && Latitude && Longitude) {
            map[Country.trim()] = {
              lat: parseFloat(Latitude),
              lng: parseFloat(Longitude),
            };
          }
        });
        setCoordsMap(map);
      },
    });
  }, []);

  return coordsMap;
};

export default useCountryCoords;
