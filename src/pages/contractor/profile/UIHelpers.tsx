import React from 'react';

export const DashCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}>
    {children}
  </div>
);

export const SectionTitle = ({ icon, title, action }: { icon: React.ReactNode, title: string, action?: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-[#4DD9E8]/10 text-[#4DD9E8] rounded-xl">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
    {action}
  </div>
);
