import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className={`min-w-[38px] min-h-[38px] p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer border shadow-xs active:scale-95 ${
        theme === 'dark'
          ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-zinc-700'
          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
