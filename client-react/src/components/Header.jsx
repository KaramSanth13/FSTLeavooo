import React, { useContext, useEffect, useState } from 'react';
import { Moon, Sun, User, Bell, ExternalLink, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Your leave for Mar 30 has been approved.', time: '2 mins ago', read: false },
    { id: 2, text: 'New policy update: Medical certificate required for 3+ days.', time: '1 hour ago', read: true },
    { id: 3, text: 'Welcome to Leavooo!', time: '1 day ago', read: true }
  ]);

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
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Leavooo Logo" className="w-8 h-8 text-indigo-600" />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Leavooo</h2>
        </div>
        {(user?.role === 'Admin' || user?.role === 'HOD') && (
          <a 
            href="http://localhost:4200" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-xs font-medium bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
          >
            <ExternalLink size={14} className="mr-1.5" />
            Approver Portal
          </a>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                <span className="text-xs text-indigo-600 font-medium cursor-pointer">Mark all as read</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition flex items-start space-x-3 ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-slate-300 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100 dark:border-slate-700">
                <button className="text-xs text-gray-500 hover:text-indigo-600 font-medium">View all activity</button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link to="/profile" className="flex items-center space-x-3 border-l border-gray-300 dark:border-slate-600 pl-4 hover:opacity-80 transition">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <User size={18} />
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
