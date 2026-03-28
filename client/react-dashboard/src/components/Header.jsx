import React, { useContext, useEffect, useState } from 'react';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

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
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">Student Portal</h2>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-300 dark:border-slate-600 pl-6">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
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
