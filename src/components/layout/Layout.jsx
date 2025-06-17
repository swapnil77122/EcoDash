import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 overflow-y-auto">
        <main className="p-4 bg-white text-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
