import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, ChevronDown, CircleUserRound } from "lucide-react";
import "./studentDashboard.css";
import { StudentNotificationItem } from "../components/backgrounds/student-notification-menu/student-notification-menu";

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
            <DropdownMenuItem className={"logout"}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="notification-button">
              <BellIcon size={22} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
          style={{width:'40vw',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}
           align="start">
              <StudentNotificationItem/>
              <StudentNotificationItem/>
              <StudentNotificationItem/>

          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="dashboard-content">
        {/* Dashboard content */}
      </main>
    </div>
  );
}