"use client";

import "./StudentDashboard.css";
import { ConsultationCard } from "./consultationCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/database/pocketdb";

const STUDENT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@stu\.univ-saida\.dz$/;

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(()=>{
        const record = pb.authStore.record;
        const email = record?.email;

        if(!record || !email) {
            router.push("/login")
        } else if(!STUDENT_EMAIL_REGEX.test(email))  {
            router.push("/professor");
        }
    },[router]);

  return (
    <>
      {/* Dashboard content */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      </div>
    </>
  );
}