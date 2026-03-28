import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaveContext } from '../context/LeaveContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ApplyLeave = () => {
  const { applyLeaveForm } = useContext(LeaveContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.startDate || !formData.endDate) {
      return "Please select both start and end dates.";
    }
    if (start < today) {
      return "Start date cannot be in the past.";
    }
    if (end < start) {
      return "End date cannot be before the start date.";
    }
    if (!formData.reason.trim() || formData.reason.length < 5) {
      return "Please provide a valid reason (min 5 characters).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await applyLeaveForm(formData);
      setSuccess('Leave application submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      // Backend handles lockout rule check and will return 403 error string here.
      setError(err.response?.data?.error || 'Error applying for leave.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Leave</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Fill out the form below to request time off.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden w-full">
        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center">
              <AlertCircle size={18} className="mr-2 min-w-[18px]" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center">
              <CheckCircle2 size={18} className="mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed reason..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none dark:placeholder-slate-400"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
