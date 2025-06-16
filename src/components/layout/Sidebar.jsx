// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Emissions", path: "/emissions" },
    { name: "Air Quality", path: "/air-quality" },
    { name: "Sea Level", path: "/sea-level" },
    { name: "Forest Loss", path: "/forest-loss" },
    { name: "Disasters", path: "/disasters" },
    { name: "Energy", path: "/energy" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow h-screen p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">EcoDash</h2>
      <nav className="space-y-2">
        {navItems.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
