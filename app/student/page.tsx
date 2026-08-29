"use client";

import "./studentDashboard.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pb } from "@/lib/database/pocketdb";
import type { Consultation } from "../types/types";
import { ConsultationCard } from "./consultationCard";

const STUDENT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@stu\.univ-saida\.dz$/;

export default function StudentDashboard() {
	const router = useRouter();
	const [consulations, setConsultations] = useState<Consultation[]>();
	useEffect(() => {
		const record = pb.authStore.record;
		const email = record?.email;

		if (!record || !email) {
			router.push("/login");
		} else if (!STUDENT_EMAIL_REGEX.test(email)) {
			router.push("/professor");
		}
	}, [router]);

	useEffect(() => {
		pb.collection("consultation")
			.getFullList({
				filter: pb.filter(
					"isPublic = true && level = {:level} && speciality = {:speciality}",
					{
						level: pb.authStore.record?.level,
						speciality: pb.authStore.record?.speciality,
					},
				),
			})
			.then((consulations) => {
				console.log(consulations);
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
						isPublic: true,
					})),
				);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	return (
		<>
			{/* Dashboard content */}
			<div
				style={{
					display: "flex",
					gap: "2rem",
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				{consulations?.map((e) => (
					<ConsultationCard key={e.id} consultationItem={e} action="UPDATE" />
				))}
			</div>
		</>
	);
}
