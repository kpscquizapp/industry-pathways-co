import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileMenu from "../ProfileMenu";
import { useLocation } from "react-router-dom";

const EmployerHeader = () => {
  const location = useLocation();
  const isVisibilitySettings = location.pathname === "/bench-dashboard/visibility-settings";
  const isDashboard = location.pathname === "/bench-dashboard" || location.pathname === "/bench-dashboard/";
  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-40 ml-7 rounded-lg">
      {/* Search */}
      {/* {!isVisibilitySettings && (
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search candidates, jobs..."
              className="pl-10 bg-neutral-50 border-neutral-200 focus:bg-white"
            />

          </div>

        </div>
      )} */}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}


        {/* Settings
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-neutral-600" />
        </Button> */}

        {/* User Menu */}

        {/* {isDashboard && (
          <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm rounded-xl h-10 px-5 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        )} */}

      </div>
    </header>



  );
};

export default EmployerHeader;




//         </div>
//  <Button className="bg-teal-500 hover:bg-teal-600 text-white shadow-sm rounded-xl h-10 px-5 text-sm">
// <FileText className="h-4 w-4 mr-2" />
// Generate Report
// </Button>



//  <ProfileMenu
// btnClass="flex items-center gap-2 px-2 bg-transparent hover:bg-gray-100 hover:text-black"
// avatarFallback="bg-navy-800 text-white"
// />


