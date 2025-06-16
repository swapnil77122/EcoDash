export const fetchCO2Data = async () => {
  const url = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv';

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch NOAA CO₂ CSV data');
  }

  const csvText = await res.text();

  // Parse CSV: skip comment lines starting with '#'
  const lines = csvText.split('\n').filter(line => line && !line.startsWith('#'));

  // CSV columns: year, month, decimal date, average, interpolated, trend, days
  const data = lines.slice(1).map(line => {
    const cols = line.split(',');
    return {
      year: cols[0],
      month: cols[1],
      decimalDate: parseFloat(cols[2]),
      average: parseFloat(cols[3]),
      interpolated: parseFloat(cols[4]),
      trend: parseFloat(cols[5]),
      days: cols[6]
    };
  });

  // Filter for January months (month === '1') to get yearly data
  const yearlyData = data.filter(d => d.month === '1');

  return {
    years: yearlyData.map(d => d.year),
    trend: yearlyData.map(d => d.trend)
  };
};
