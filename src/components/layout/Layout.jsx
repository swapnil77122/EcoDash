import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area without header */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-4 bg-white text-black flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
