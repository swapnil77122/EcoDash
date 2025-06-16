const GISTEMP_API = 'https://data.giss.nasa.gov/gistemp/graphs_v4.json';

export const fetchGlobalTempData = async () => {
  const response = await fetch(GISTEMP_API);
  if (!response.ok) throw new Error('Failed to fetch temperature data');
  return response.json();
};
