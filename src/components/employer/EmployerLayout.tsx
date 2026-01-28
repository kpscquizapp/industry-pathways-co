import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';
import EmployerHeader from './EmployerHeader';
import { cn } from '@/lib/utils';

const EmployerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen  bg-neutral-50 ">
      <div className="flex ">
      <EmployerSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
     <div className="flex flex-1 flex-col">
      <div 
        className={cn(
          "transition-all duration-300",
          // sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <EmployerHeader />
        <main className="p-6 ">
          <Outlet />
        </main>
      </div>
       </div>
       </div>
    </div>
  );
};

export default EmployerLayout;
