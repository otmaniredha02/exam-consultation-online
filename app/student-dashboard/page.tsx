"use client";

import { useState } from "react";
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
import { StudentNotificationItem } from "../components/student-notification-menu/student-notification-item";
import "./studentDashboard.css";
import { useRouter } from "next/navigation";
import { ConsultationCard } from "./consultationCard";

export default function StudentDashboard() {

   return (
    <>
      {/* Dashboard content */}
      
     <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',justifyContent:'center'}}>
       {Array.from({ length : 15}, () => {
        return <ConsultationCard/>
      })}
     </div>
    </>
  );
}