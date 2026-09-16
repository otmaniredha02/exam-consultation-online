"use client";

import { Button } from "@/components/ui/button";
import "./ConsulationCard.css";
import {
	BookOpen,
	CalendarDays,
	Edit,
	GraduationCap,
	Layers3,
	Timer,
	Trash,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { pb } from "@/lib/database/pocketdb";
import { NewConsultationDialog } from "../components/ConsultationCard/newConsultation";
import type { ConsultationCardProps } from "../types/types";

export function ConsultationCard({ consultationItem }: ConsultationCardProps) {
	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@univ-saida\.dz$/;

	const deleteConsultation = () => {
		const id = consultationItem.id;
		if (id != undefined) {
			// remove by id
			if (id !== undefined) {
				pb.collection("consultation").delete(consultationItem.id);
			}
		}
	};
	return (
		<Card className="consultation-card">
			<div>
				<Dialog>
					{EMAIL_REGEX.test(pb.authStore.record?.email) ? (
						<DialogTrigger>
							<Edit
								className="hover:bg-blue-400"
								style={{
									transform: "translate(1020%,-1rem)",
									position: "absolute",
								}}
							/>
						</DialogTrigger>
					) : (
						<></>
					)}
					<NewConsultationDialog
						consultationItem={consultationItem}
						action="UPDATE"
					/>
				</Dialog>

				{/* delete button */}

				<Dialog>
					{EMAIL_REGEX.test(pb.authStore.record?.email) ? (
						<DialogTrigger>
							<Trash color="red"></Trash>
						</DialogTrigger>
					) : (
						<></>
					)}
					<DialogContent>
						Are you sure want to delete ?
						<Button variant="destructive" onClick={deleteConsultation}>
							delete
						</Button>
					</DialogContent>
				</Dialog>
			</div>
			<h1>
				<BookOpen size={20} />
				{consultationItem.course}
			</h1>

			<p>
				<CalendarDays size={16} />
				Date: {consultationItem.date.toString()}
			</p>

			<p>
				<Timer />
				Duration: {consultationItem.duration} min
			</p>

			<p>
				<GraduationCap size={16} />
				Level: {consultationItem.level}
			</p>

			<p>
				<Layers3 size={16} />
				Speciality: {consultationItem.speciality}
			</p>
			<Button>Join</Button>
		</Card>
	);
}
