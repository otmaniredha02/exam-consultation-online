"use client";

import { pb } from "@/lib/database/pocketdb";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Professor() {
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

    return (
        <>
        professor something else 
        </>
    );
}