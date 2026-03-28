import React, { useContext } from 'react';
import { LeaveContext } from '../context/LeaveContext';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const History = () => {
  const { leaves } = useContext(LeaveContext);
  const { user } = useContext(AuthContext);

  // We show all leaves for demonstration of mock data (Karam & Shanjana)
  // Or just specifically user's leaves if preferred. 
  // Let's show all so the mocked names "Karam Santh N" and "Shanjana G" are visible in the table.
  const displayLeaves = leaves;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle2 size={12} className="mr-1" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle size={12} className="mr-1" /> Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave History</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Review your past and current leave applications.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {displayLeaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                    No leave history found.
                  </td>
                </tr>
              ) : (
                displayLeaves.map((leave, index) => (
                  <tr key={leave.id || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{leave.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-slate-300">
                        {formatDate(leave.startDate)} <span className="text-gray-400 dark:text-slate-500 mx-1">→</span> {formatDate(leave.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-slate-300 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
