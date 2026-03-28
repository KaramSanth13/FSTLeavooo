import React, { useContext, useEffect, useState } from 'react';
import { LeaveContext } from '../context/LeaveContext';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle2, XCircle, Printer, CalendarRange } from 'lucide-react';

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
    // Pipeline: Applied -> HOD -> Admin
    const stages = ['Applied', 'HOD_Approved', 'Final_Approved'];
    let currentStageIndex = 0;
    if (status === 'HOD_Approved') currentStageIndex = 1;
    if (status === 'Final_Approved') currentStageIndex = 2;
    if (status === 'Rejected') currentStageIndex = -1; // special case handled via color

    return (
      <div className="flex items-center justify-between mt-4 relative no-print">
        {/* Connection Line */}
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard & Leave History</h1>
        <p className="text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">View your timeline, modify active leaves, or print gate passes.</p>
      </div>

      {loading ? (
        <div className="space-y-4 no-print">
           {[1, 2, 3].map(i => (
             <div key={i} className="animate-pulse flex flex-col bg-white dark:bg-slate-800 p-6 rounded-2xl w-full h-32 border border-slate-200 dark:border-slate-700">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
             </div>
           ))}
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 no-print">
          <p className="text-gray-500 dark:text-slate-400">No leave history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leaves.map((leave) => {
            const isLeaveActive = isActive(leave.endDate) && (leave.status === 'Pending' || leave.status === 'HOD_Approved' || leave.status === 'Final_Approved');
            
            return (
              <div key={leave._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                
                {/* Print Context (Hidden on web, visible on print) */}
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
