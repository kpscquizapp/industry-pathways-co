import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HrSidebar from "./HrSidebar";
import EmployerHeader from "./EmployerHeader";
import { cn } from "@/lib/utils";

const HrLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <HrSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64",
        )}
      >
        <EmployerHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HrLayout;
