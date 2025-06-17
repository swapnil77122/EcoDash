import { useEffect, useState } from "react";
import Papa from "papaparse";

const useCO2EmissionData = () => {
  const [emissions, setEmissions] = useState([]);

  useEffect(() => {
    Papa.parse("/data/co2_emissions.csv", {
      download: true,
      header: true,
      complete: ({ data }) => {
        const filtered = data.filter((row) => {
          const year = parseInt(row.Year);
          return year >= 2015 && year <= 2022;
        });
        setEmissions(filtered);
      },
    });
  }, []);

  return emissions;
};

export default useCO2EmissionData;
