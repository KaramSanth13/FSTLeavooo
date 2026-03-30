import React, { useContext, useEffect, useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, 
  ChevronRight, Download, Printer, Edit3, Loader2, Info, CalendarRange
} from 'lucide-react';
import { LeaveContext } from '../context/LeaveContext';
import { AuthContext } from '../context/AuthContext';

const CircularProgress = ({ value, max, label, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-100 dark:text-slate-700"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease' }}
          className={color}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-gray-800 dark:text-white">{value}</span>
        <p className="text-[10px] text-gray-500 uppercase font-medium">{label}</p>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded-2xl w-full"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { leaves, loading, fetchLeaves, modifyEndDate } = useContext(LeaveContext);
  const { user } = useContext(AuthContext);

  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const [newEndDates, setNewEndDates] = useState({});
  const [modError, setModError] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    if (status === 'Final_Approved' || status === 'HOD_Approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 size={14} className="mr-1" /> {status.replace('_', ' ')}
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle size={14} className="mr-1" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <Clock size={14} className="mr-1" /> Pending
      </span>
    );
  };

  const renderTimeline = (status) => {
    const stages = ['Applied', 'HOD_Approved', 'Final_Approved'];
    let currentStageIndex = 0;
    if (status === 'HOD_Approved') currentStageIndex = 1;
    if (status === 'Final_Approved') currentStageIndex = 2;
    if (status === 'Rejected') currentStageIndex = -1;

    return (
      <div className="flex items-center justify-between mt-4 relative no-print">
        <div className="absolute top-3 w-full h-1 bg-gray-200 dark:bg-slate-700 left-0 right-0 z-0 rounded"></div>
        
        {['Applied', 'HOD Review', 'Admin Final'].map((label, idx) => {
          let dotColor = 'bg-gray-300 dark:bg-slate-600';
          let textColor = 'text-gray-400 dark:text-slate-500';

          if (status === 'Rejected') {
             dotColor = idx === 0 ? 'bg-indigo-500' : 'bg-red-500';
             textColor = idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : (idx === 1 ? 'text-red-600 dark:text-red-400' : 'text-gray-400');
          } else if (idx <= currentStageIndex) {
            dotColor = 'bg-indigo-600';
            textColor = 'text-indigo-600 dark:text-indigo-400 font-medium';
          }

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${dotColor}`}></div>
              <span className={`text-[10px] mt-1 ${textColor}`}>{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleModify = async (id, currentStartDate) => {
    setModError('');
    const newDate = newEndDates[id];
    if (!newDate) return;
    try {
      if (new Date(newDate) < new Date(currentStartDate)) {
        setModError('End Date cannot be before Start Date');
        return;
      }
      await modifyEndDate(id, newDate);
      setEditingLeaveId(null);
    } catch (err) {
      setModError(err.response?.data?.error || 'Error modifying date');
    }
  };

  const isActive = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    return end >= today;
  };

  if (loading) return <div className="max-w-7xl mx-auto p-6"><Skeleton /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard & Leave History</h1>
        <p className="text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">View your timeline, modify active leaves, or print gate passes.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Available Balance</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.leaveBalance} Days</h3>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <Info size={12} className="mr-1" /> Reset annually
            </p>
          </div>
          <CircularProgress value={user?.leaveBalance || 0} max={10} label="Left" color="text-indigo-600" />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Used Leaves</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{10 - (user?.leaveBalance || 0)} Days</h3>
          </div>
          <CircularProgress value={10 - (user?.leaveBalance || 0)} max={10} label="Used" color="text-amber-500" />
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
          <div>
             <p className="text-indigo-100 text-sm font-medium mb-1">Active Status</p>
             <h3 className="text-xl font-bold">
               {leaves.length > 0 ? (leaves[0].status.replace('_', ' ')) : 'No Recent Leaves'}
             </h3>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-100 bg-white/10 w-fit px-2 py-1 rounded-md">
            <Clock size={12} className="mr-1" /> Next reset in 240 days
          </div>
        </div>
      </div>

      {leaves.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 no-print">
          <p className="text-gray-500 dark:text-slate-400">No leave history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leaves.map((leave) => {
            const isLeaveActive = isActive(leave.endDate) && (leave.status === 'Pending' || leave.status === 'HOD_Approved' || leave.status === 'Final_Approved');
            
            return (
              <div key={leave._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                
                <div className="hidden print-only text-center border-2 border-black p-8 m-8 rounded-lg mt-12 mb-12 page-break-after">
                   <h1 className="text-3xl font-bold mb-4">Gate Pass / Leave Approval</h1>
                   <h2 className="text-xl mb-6">College Leave Administration</h2>
                   <div className="text-left space-y-4 text-lg">
                      <p><strong>Student Name:</strong> {user?.name}</p>
                      <p><strong>Period:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                      <p><strong>Reason:</strong> {leave.reason}</p>
                      <p><strong>Approval Status:</strong> <span className="uppercase font-bold text-green-700 bg-green-100 px-2 py-1">{leave.status}</span></p>
                      <p className="mt-12"><strong>Authorized Signature:</strong> _____________________</p>
                   </div>
                </div>

                {/* Normal UI */}
                <div className="flex justify-between items-start no-print">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                       <span className="text-sm font-bold text-gray-500 dark:text-slate-400">
                         {new Date(leave.startDate).toLocaleDateString()}  →  
                       </span>
                       {editingLeaveId === leave._id ? (
                         <div className="flex items-center space-x-2">
                           <input 
                             type="date" 
                             className="text-sm border rounded px-2 py-1 dark:bg-slate-700 dark:text-white"
                             value={newEndDates[leave._id] || leave.endDate.split('T')[0]}
                             onChange={(e) => setNewEndDates({...newEndDates, [leave._id]: e.target.value})}
                           />
                           <button onClick={() => handleModify(leave._id, leave.startDate)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Save</button>
                           <button onClick={() => {setEditingLeaveId(null); setModError('');}} className="text-xs bg-gray-300 text-black px-2 py-1 rounded">Cancel</button>
                         </div>
                       ) : (
                         <span className="text-sm font-bold text-gray-500 dark:text-slate-400">
                           {new Date(leave.endDate).toLocaleDateString()}
                         </span>
                       )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">{leave.reason}</p>
                    
                    {modError && editingLeaveId === leave._id && (
                       <p className="text-xs text-red-500 mb-2">{modError}</p>
                    )}

                    <div className="flex items-center space-x-4">
                      {getStatusBadge(leave.status)}
                      
                      {isLeaveActive && leave.status !== 'Rejected' && editingLeaveId !== leave._id && (
                        <button onClick={() => setEditingLeaveId(leave._id)} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 flex items-center">
                          <CalendarRange size={14} className="mr-1"/> Extend/Modify End Date
                        </button>
                      )}

                      {leave.status === 'Final_Approved' && (
                        <button onClick={handlePrint} className="text-xs bg-gray-500 text-white px-3 py-1 rounded shadow-sm hover:bg-gray-600 font-semibold flex items-center">
                          <Printer size={14} className="mr-1" /> Download Pass
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {renderTimeline(leave.status)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
