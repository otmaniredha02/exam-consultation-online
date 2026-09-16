"use client";
import { useAtom } from "jotai";
import { selectedStudent } from "@/app/context/claim";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, gradeStatusColor } from "@/lib/utils";
import { ClaimItem } from "./ClaimItem";
import styles from "./StudentSelectedClaims.module.css";

export function StudentSelectedClaims() {
	const [selectedstudent, setSelectedStudent] = useAtom(selectedStudent);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Avatar>
					<AvatarImage
						src={selectedstudent.profile}
						alt={selectedstudent.full_name}
					/>
					<AvatarFallback>
						{getInitials(selectedstudent.full_name)}
					</AvatarFallback>
				</Avatar>
				<h1>{selectedstudent.full_name}</h1>
				<Badge
					style={{ backgroundColor: gradeStatusColor(selectedstudent.grade) }}
				>
					{selectedstudent.grade}
				</Badge>
			</div>
			<div className={styles.claimsList}>
				{selectedstudent.messages.map((message, index) => (
					<ClaimItem
						key={index}
						exercice={message.exercice}
						question={message.question}
						points={message.points}
						note={message.note}
					/>
				))}
			</div>
		</div>
	);
}
