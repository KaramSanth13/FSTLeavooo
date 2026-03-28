import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-200 w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden h-full">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 md:p-8 w-full h-full text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
