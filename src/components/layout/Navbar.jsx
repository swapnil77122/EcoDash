import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => (
  <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
    <ThemeToggle />
  </nav>
);

export default Navbar;
