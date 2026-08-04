"use client";

import { pb } from "@/lib/database/pocketdb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Consultation } from "../types/types";
import { ConsultationCard } from "../student/consultationCard";

export default function Professor() {
    const [consulations, setConsultations] = useState<Consultation[]>();
    const router = useRouter();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@univ-saida\.dz$/;

    useEffect(() => {
        const record = pb.authStore.record;
        const email = record?.email;
        if (!record || !email) {
            router.push("/login");
        } else if (!EMAIL_REGEX.test(email)) {
            router.push("/student");
        }
    }, [router]);

    useEffect(() => {
        pb.collection("consultation")
            .getFullList({
                filter: `professor_id = "${pb.authStore.record?.id}"`,
            })
            .then((consulations) => {
                setConsultations(
                    consulations.map((consultation) => ({
                        id: consultation.id,
                        course: consultation.course,
                        date: consultation.date,
                        duration: consultation.duration,
                        exam_correction_file: consultation.exam_correction_file,
                        gradings: consultation.gradings,
                        level: consultation.level,
                        professor_id: consultation.professor_id,
                        speciality: consultation.speciality,
                        isPublic : true
                    }))
                );
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        pb.collection("consultation").subscribe<Consultation>("*", (e) => {
            switch (e.action) {
                case "create":
                    setConsultations((prev) => (prev ? [...prev, e.record] : [e.record]));
                    break;
                case "update":
                    setConsultations((prev) =>
                        prev?.map((el) => (el.id === e.record.id ? e.record : el))
                    );
                    break;
                case "delete":
                    setConsultations((prev) => prev?.filter((c) => c.id !== e.record.id));
                    break;
            }
        });

        return () => {
            pb.collection("consultation").unsubscribe("*");
        };
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {consulations?.map((e) => (
                <ConsultationCard key={e.id} consultationItem={e} action="UPDATE" />
            ))}
        </div>
    );
}