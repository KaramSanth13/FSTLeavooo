import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LeaveContext } from '../context/LeaveContext';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { leaveBalance, leaves } = useContext(LeaveContext);

  const getMyLeaves = () => {
    return leaves.filter(leave => leave.studentName === user?.name);
  };

  const myLeaves = getMyLeaves();
  const approvedLeaves = myLeaves.filter(l => l.status === 'Approved').length;
  const pendingLeaves = myLeaves.filter(l => l.status === 'Pending').length;
  const rejectedLeaves = myLeaves.filter(l => l.status === 'Rejected').length;

  // Recharts Data
  const chartData = [
    { name: 'Jan', Balance: 2, Taken: 1 },
    { name: 'Feb', Balance: 2, Taken: 0 },
    { name: 'Mar', Balance: 2, Taken: 2 },
    { name: 'Apr', Balance: 2, Taken: 0 },
    { name: 'May', Balance: 2, Taken: 1 },
    { name: 'Jun', Balance: 2, Taken: 1 },
    { name: 'Jul', Balance: 2, Taken: 0 },
    { name: 'Aug', Balance: 2, Taken: 2 },
    { name: 'Sep', Balance: 2, Taken: 0 },
    { name: 'Oct', Balance: 2, Taken: 0 },
    { name: 'Nov', Balance: 2, Taken: 1 },
    { name: 'Dec', Balance: 2, Taken: 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Here is your leave summary and statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{leaveBalance.total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Approved Leaves</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{approvedLeaves}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingLeaves}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Rejected Leaves</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{rejectedLeaves}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 w-full">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Leaves Taken vs. Monthly Balance</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="Balance" fill="#94a3b8" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Taken" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
