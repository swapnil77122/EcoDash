import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar visible by default

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="px-4 py-3 shadow bg-white sticky top-0 z-40">
          <h1 className="text-xl font-bold text-blue-700">
            🌍 EcoDash - Climate Dashboard
          </h1>
        </header>

        {/* Routed content */}
        <main className="p-4 bg-white text-black flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
