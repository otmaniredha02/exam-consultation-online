"use client";

import "./studentDashboard.css";
import { ConsultationCard } from "./consultationCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/database/pocketdb";

export default function StudentDashboard() {
   const router = useRouter();
    useEffect( ()=>{
      console.log("auth");
      console.log(pb.authStore.record);
      if(pb.authStore.record == null) {
        router.push("/login");
      }
    })
    
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