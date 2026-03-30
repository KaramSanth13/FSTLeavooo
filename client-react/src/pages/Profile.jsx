import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [details, setDetails] = useState({ name: user?.name, email: user?.email });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ error: '', success: '' });
    try {
      await api.put('/auth/updatedetails', details);
      setStatus({ success: 'Profile updated successfully!', error: '' });
    } catch (err) {
      setStatus({ error: err.response?.data?.error || 'Update failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({ error: 'Passwords do not match', success: '' });
    }
    setLoading(true);
    setStatus({ error: '', success: '' });
    try {
      await api.put('/auth/updatepassword', passwords);
      setStatus({ success: 'Password updated successfully!', error: '' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ error: err.response?.data?.error || 'Password update failed', success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-slate-400">Manage your account information and security.</p>
      </div>

      {status.error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center">
          <AlertCircle size={18} className="mr-2" /> {status.error}
        </div>
      )}

      {status.success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-medium flex items-center">
          <CheckCircle2 size={18} className="mr-2" /> {status.success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <User size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>
          </div>
          <form onSubmit={handleUpdateDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase">Full Name</label>
              <input 
                type="text" 
                value={details.name} 
                onChange={(e) => setDetails({...details, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase">Email Address</label>
              <input 
                type="email" 
                value={details.email} 
                onChange={(e) => setDetails({...details, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              disabled={loading}
              className="flex items-center justify-center space-x-2 w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              <Save size={18} /> <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase">Current Password</label>
              <input 
                type="password" 
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase">New Password</label>
              <input 
                type="password" 
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase">Confirm New Password</label>
              <input 
                type="password" 
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-slate-800 dark:bg-indigo-600 text-white py-2.5 rounded-xl hover:opacity-90 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
