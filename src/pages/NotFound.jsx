const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-2">Oops! Page not found.</p>
      <p className="text-sm text-gray-500">Check the URL or go back to the dashboard.</p>
    </div>
  );
};

export default NotFound;
