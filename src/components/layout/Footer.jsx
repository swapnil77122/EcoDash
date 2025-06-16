import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center text-gray-700 dark:text-gray-300 py-4 mt-auto">
      <p>© {new Date().getFullYear()} Global Climate Insights Dashboard</p>
    </footer>
  );
};

export default Footer;
