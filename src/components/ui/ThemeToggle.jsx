import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { dark, setDark } = useTheme();

  return (
    <button
      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
      onClick={() => setDark(!dark)}
    >
      {dark ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
