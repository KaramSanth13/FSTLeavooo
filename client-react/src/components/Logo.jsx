import React from 'react';

const Logo = ({ className = "w-8 h-8", textClassName = "text-xl font-bold" }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`${className} bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
          <path d="M7 14L10 17L17 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L4 7V12C4 17 12 21 12 21C12 21 20 17 20 12V7L12 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className={`${textClassName} text-slate-800 dark:text-white tracking-tight`}>Leavooo</span>
    </div>
  );
};

export default Logo;
