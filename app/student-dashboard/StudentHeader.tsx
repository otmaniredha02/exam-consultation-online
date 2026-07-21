"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { StudentNotificationItem } from "@/app/components/student-notification-menu/student-notification-item";

export default function StudentHeader() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  function openLogoutDialog() {
    requestAnimationFrame(() => {
      setLogoutDialogOpen(true);
    });
  }

  function handleLogout() {
    setLogoutDialogOpen(false);

    // TODO: Clear auth/session here

    router.push("/login");
  }

  return (
    <>
      <header className="dashboard-header">
        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="profile-button">
            <CircleUserRound size={42} strokeWidth={1.5} />
            <span>Otmani Redha</span>
            <ChevronDown size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => router.push("/student/profile")}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/student/settings")}
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={openLogoutDialog}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="notification-button" type="button">
              <BellIcon size={22} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="notification-menu-content"
          >
            <StudentNotificationItem />
            <StudentNotificationItem />
            <StudentNotificationItem />
            <StudentNotificationItem />
            <StudentNotificationItem />
            <StudentNotificationItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>

            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}