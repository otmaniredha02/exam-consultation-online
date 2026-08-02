"use client";

import { pb } from "@/lib/database/pocketdb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Consultation } from "../types/types";
import { ConsultationCard } from "../student/consultationCard";

export default function Professor() {
    const [consulations,setConsultations] = useState<Consultation[]>();

    const router = useRouter();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@univ-saida\.dz$/;
    
    useEffect(()=>{
        const record = pb.authStore.record;
        const email = record?.email;
        if(!record || !email) {
            router.push("/login")
        } else if(!EMAIL_REGEX.test(email))  {
            router.push("/student");
        }
    },[router]);

    useEffect(()=>{
        pb.collection("consultation").getFullList({
            filter: `professor_id = "${pb.authStore.record?.id}"`
        })
        .then((consulations) => {
            setConsultations((prev) => {
                let temp : Consultation[] = [];
                consulations.map((consultation) => {
                    temp.push({
                        id: consultation.id,
                        course: consultation.course,
                        date : consultation.date,
                        duration: consultation.duration,
                        exam_correction_file : consultation.exam_correction_file,
                        gradings : consultation.gradings,
                        level: consultation.level,
                        professor_id : consultation.professor_id,
                        speciality: consultation.speciality
                    });
                })

                return temp;
            })
            console.log("consul")
            console.log(consulations)
        }).catch((e) => {
            console.log(e);
        });
    },[]);

    return (
        <div style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap'}}>
        {consulations?.map((e)=>{
            return <ConsultationCard key={e.id} consultationItem={e} action="UPDATE"/>
        })}
        </div>
    );
}