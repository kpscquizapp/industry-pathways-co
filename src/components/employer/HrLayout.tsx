import React, { Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HrSidebarContent from "./HrSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const HrLayout = () => {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/bench-dashboard/visibility-settings";
  const isDashboard =
    location.pathname === "/bench-dashboard" ||
    location.pathname === "/bench-dashboard/";

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <div className="min-h-screen flex w-full bg-neutral-50 font-sans">
        {/* Sidebar */}
        <HrSidebarContent />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {!hideHeader && (
            <header className="sticky top-0 z-40 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6">
              {/* Left: Hamburger + Search */}
              <div className="flex items-center gap-3">
                <SidebarTrigger
                  className="text-muted-foreground hover:bg-[#0b1221]/10"
                  title="Toggle Sidebar"
                />
                {/* {!hideHeader && (
                  <div className="relative max-w-xs w-full hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    <Input
                      placeholder="Search candidates, jobs..."
                      className="pl-10 h-9 bg-neutral-50 border-neutral-200 focus:bg-white w-64"
                    />
                  </div>
                )} */}
              </div>

              {/* Right: actions */}
              {/* <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  className="relative bg-transparent hover:bg-[#0b1221]/10 shadow-none"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>

                {isDashboard && (
                  <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm rounded-xl h-10 px-5 text-sm flex items-center gap-2 transition-all active:scale-[0.98]">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Generate Report</span>
                  </Button>
                )}
              </div> */}
            </header>
          )}

          {/* Page content */}
          <main
            className={`flex-1 overflow-auto ${hideHeader ? "p-0 bg-[#f0f2f5]" : "p-4 sm:p-6"
              }`}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-[#0eb5b9] rounded-full animate-loading-bar" />
                  </div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HrLayout;
