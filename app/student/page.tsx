"use client";

import "./studentDashboard.css";
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