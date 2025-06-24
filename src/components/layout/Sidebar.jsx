import { NavLink } from "react-router-dom";
import {
  Info, Leaf, Cloud, Waves, TreePine, AlertTriangle, Zap, Snowflake, Wind
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "Overview", path: "/", icon: <Leaf size={16} /> },
    { name: "Emissions", path: "/emissions", icon: <Cloud size={16} /> },
    { name: "Air Quality", path: "/air-quality", icon: <Wind size={16} /> },
    { name: "Sea Level", path: "/sea-level", icon: <Waves size={16} /> },
    { name: "Forest Loss", path: "/forest-loss", icon: <TreePine size={16} /> },
    { name: "Ice Level", path: "/ice-level", icon: <Snowflake size={16} /> },
    { name: "Disasters", path: "/disasters", icon: <AlertTriangle size={16} /> },
    { name: "Energy", path: "/energy", icon: <Zap size={16} /> },
    { name: "About", path: "/about", icon: <Info size={16} /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block
      `}
    >
      <div className="p-4">
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-base font-semibold text-blue-700">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* EcoDash Title (left-aligned and bigger) */}
        <h1 className="text-2xl font-extrabold text-blue-700 mb-6">
          🌍 EcoDash
        </h1>

        {/* Navigation Links */}
        <nav className="space-y-1 mt-4">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-blue-800 text-white hover:bg-blue-800"
                    : "text-black hover:bg-blue-500 hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {icon}
              <span className="font-bold">{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
