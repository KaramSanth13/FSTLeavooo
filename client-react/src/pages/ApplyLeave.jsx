import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaveContext } from '../context/LeaveContext';
import { AlertCircle, CheckCircle2, FileText, Upload, Send } from 'lucide-react';

const ApplyLeave = () => {
  const { applyLeaveForm } = useContext(LeaveContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    medicalCertificate: false
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const getDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  const days = getDays();

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
    if (days > 3 && !formData.medicalCertificate) {
      return "Medical certificate is required for leaves longer than 3 days.";
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
      await applyLeaveForm({ ...formData, file });
      setSuccess('Leave application submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
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
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-indigo-500" /> Reason for Leave
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                placeholder="Briefly explain your reason..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            {days > 3 && (
              <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 text-sm font-medium">
                  <AlertCircle size={16} />
                  <span>Medical Certificate Required (Leave {">"} 3 days)</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="medCert"
                    checked={formData.medicalCertificate}
                    onChange={(e) => setFormData({...formData, medicalCertificate: e.target.checked})}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="medCert" className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer">
                    I have attached a medical certificate
                  </label>
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="flex items-center justify-center p-3 border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-lg cursor-pointer hover:bg-amber-100/50 transition-colors"
                  >
                    <Upload size={18} className="mr-2 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {file ? file.name : "Select PDF/Image"}
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
