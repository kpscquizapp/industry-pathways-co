import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileMenu from "../ProfileMenu";

const EmployerHeader = () => {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search candidates, jobs..."
            className="pl-10 bg-neutral-50 border-neutral-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-neutral-600" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Settings
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-neutral-600" />
        </Button> */}

        {/* User Menu */}
        <ProfileMenu
          btnClass="flex items-center gap-2 px-2"
          avatarFallback="bg-navy-800 text-white"
        />
      </div>
    </header>
  );
};

export default EmployerHeader;
