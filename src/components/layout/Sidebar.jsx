import { NavLink } from "react-router-dom";
import { Info, Leaf, Cloud, Waves, Landmark, AlertTriangle, Zap, TreePine } from "lucide-react";


const Sidebar = () => {
  const navItems = [
    { name: "Overview", path: "/", icon: <Leaf size={18} /> },
    { name: "Emissions", path: "/emissions", icon: <Cloud size={18} /> },
    { name: "Air Quality", path: "/air-quality", icon: <Cloud size={18} /> },
    { name: "Sea Level", path: "/sea-level", icon: <Waves size={18} /> },
{ name: "Forest Loss", path: "/forest-loss", icon: <TreePine size={18} /> },
    { name: "Disasters", path: "/disasters", icon: <AlertTriangle size={18} /> },
    { name: "Energy", path: "/energy", icon: <Zap size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md h-screen p-5">
      <h2 className="text-2xl font-extrabold text-blue-600 mb-8">EcoDash</h2>
      <nav className="space-y-2">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            {icon}
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
