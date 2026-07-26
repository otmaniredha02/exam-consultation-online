"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  CircleUserRound,
  LogOut,
  SquarePlus,
  User,
} from "lucide-react";

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
import Link from "next/link";
import { pb } from "@/lib/database/pocketdb";
import "./ProfessorDashboard.css";
import { DialogTrigger } from "@/components/ui/dialog";


export default function ProfessorHeader() {
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  function handleProfileOpenChange(open: boolean) {
    setProfileOpen(open);

    if (open) {
      setNotificationOpen(false);
    }
  }

  function handleNotificationOpenChange(open: boolean) {
    setNotificationOpen(open);

    if (open) {
      setProfileOpen(false);
    }
  }

  function openLogoutDialog() {
    setProfileOpen(false);

    requestAnimationFrame(() => {
      setLogoutDialogOpen(true);
    });
  }

  function handleLogout() {
    setLogoutDialogOpen(false);

    // TODO:
    // clear auth/session
    pb.authStore.clear();
    router.push("/login");
  }

  return (
    <>
      <header className="dashboard-header">
        {/* ===========================
            Profile
        =========================== */}

        <DropdownMenu
          open={profileOpen}
          onOpenChange={handleProfileOpenChange}
        >
          <DropdownMenuTrigger className="profile-button">
           <Link href="/professor"> 
           
           <CircleUserRound size={42} strokeWidth={1.5} /></Link>

            <span>{pb.authStore.record?.username.split("_").join(" ")}</span>

            <ChevronDown
              size={18}
              className={profileOpen ? "rotate" : ""}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={10}
            className="profile-dropdown-content"
          >
            <DropdownMenuItem
              onClick={() => router.push("student/profile")}
            >
              <User size={18} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="logout-item"
              onClick={openLogoutDialog}
            >
              <LogOut size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ===========================
            schedule new consultation session
        =========================== */}
       <Dialog>
        <DialogTrigger>
          <div  className="consulation-button">
            <SquarePlus />
            <p>add new consultation</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          
        </DialogContent>
       </Dialog>
       
      </header>

      {/* ===========================
          Logout Dialog
      =========================== */}

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