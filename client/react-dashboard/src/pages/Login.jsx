import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="p-8 pb-6 border-b border-gray-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800/50 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <CheckSquare size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">LeaveSync Portal</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 text-center mt-2">Sign in to manage your leaves</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-800/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:placeholder-slate-400 shadow-sm"
                placeholder="karam@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:placeholder-slate-400 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
            <p>Demo Credentials:</p>
            <p className="font-medium mt-1">karam@test.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
