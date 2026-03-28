import React, { useContext, useEffect, useState } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 transition-colors no-print">
      <div><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Vidumurai Applicant Portal</h2></div>
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="flex items-center space-x-3 border-l border-gray-300 dark:border-slate-600 pl-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <User size={18} />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
