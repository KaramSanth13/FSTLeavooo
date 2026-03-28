import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          LeavePortal
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Dashboard</Link>
          <Link to="/apply" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Apply Leave</Link>
          <Link to="/history" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">History</Link>
          
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>
          
          <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
            <span className="font-medium">{user?.name}</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
