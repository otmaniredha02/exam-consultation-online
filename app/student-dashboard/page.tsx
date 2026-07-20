import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, ChevronDown, CircleUserRound } from "lucide-react";
import "./studentDashboard.css";

export default function StudentDashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <DropdownMenu>
          <DropdownMenuTrigger className="profile-button">
            <CircleUserRound size={42} strokeWidth={1.5} />
            <span>Otmani Redha</span>
            <ChevronDown size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="notification-button">
          <BellIcon size={22} />
        </button>
      </header>

      <main className="dashboard-content">
        {/* Dashboard content */}
      </main>
    </div>
  );
}