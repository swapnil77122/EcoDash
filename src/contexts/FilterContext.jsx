import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [selectedYear, setSelectedYear] = useState("2023");

  return (
    <FilterContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
