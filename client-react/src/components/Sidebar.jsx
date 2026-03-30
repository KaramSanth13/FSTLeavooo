import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, CheckSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Apply Leave', path: '/apply', icon: <FileText size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-colors no-print">
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <CheckSquare className="text-indigo-500 mr-3" size={24} />
        <h1 className="text-xl font-bold tracking-wider">Leavooo</h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 shadow-md text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
