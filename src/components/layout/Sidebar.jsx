import { NavLink } from "react-router-dom";
import {
  Info, Leaf, Cloud, Waves, TreePine, AlertTriangle, Zap, Snowflake, Wind
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "Overview", path: "/", icon: <Leaf size={18} /> },
    { name: "Emissions", path: "/emissions", icon: <Cloud size={18} /> },
    { name: "Air Quality", path: "/air-quality", icon: <Wind size={18} /> },
    { name: "Sea Level", path: "/sea-level", icon: <Waves size={18} /> },
    { name: "Forest Loss", path: "/forest-loss", icon: <TreePine size={18} /> },
    { name: "Ice Level", path: "/ice-level", icon: <Snowflake size={18} /> },
    { name: "Disasters", path: "/disasters", icon: <AlertTriangle size={18} /> },
    { name: "Energy", path: "/energy", icon: <Zap size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block
      `}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-gray-700 md:hidden"
            >
              ☰
            </button>
            <h2 className="text-2xl font-extrabold text-blue-600">EcoDash</h2>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-bold transition ${
                  isActive
                    ? "bg-blue-800 text-white hover:bg-blue-800"
                    : "text-black hover:bg-blue-500"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {icon}
              {name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
