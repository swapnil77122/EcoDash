import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => (
  <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold text-blue-600 dark:text-white">🌎 Climate Dashboard</h1>
    <ThemeToggle />
  </nav>
);

export default Navbar;
