"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "../[id]/layout.css";
import { useAtom } from "jotai";
import { claims, selectedStudent } from "@/app/context/claim";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { getInitials, gradeStatusColor } from "@/lib/utils";
import styles from "./StudentList.module.css";

export function StudentList() {
	// Tap-to-expand on mobile, since :hover doesn't fire on touch devices
	const [expanded, setExpanded] = useState(false);
	const studentslist = useAtom(claims)[0];

	return (
		<section
			className={`div3 ${styles.studentsSection}${expanded ? " expanded" : ""}`}
			onClick={() => setExpanded((prev) => !prev)}
		>
			<h1>Students Joined ({studentslist.length})</h1>
			<div className={styles.scrollArea}>
				{studentslist.length === 0 ? (
					<p className={styles.emptyState}>No students yet.</p>
				) : (
					studentslist.map((student, index) => (
						<StudentListItem
							key={index}
							id={index}
							avatar={student.profile}
							grade={student.grade}
							name={student.full_name}
						/>
					))
				)}
			</div>
		</section>
	);
}

function StudentListItem({ id, avatar, name, grade }: any) {
	const studentslist = useAtom(claims)[0];
	const [selectedstudent, setSelectedStudent] = useAtom(selectedStudent);

	return (
		<Item
			onClick={() => {
				setSelectedStudent(() => studentslist[id]);
			}}
			className={styles.studentItem}
			variant="outline"
		>
			<ItemMedia variant="icon">
				<Avatar>
					<AvatarImage src={avatar} alt={name} />
					<AvatarFallback>{getInitials(name)}</AvatarFallback>
				</Avatar>
			</ItemMedia>
			<ItemContent>
				<ItemTitle className={styles.studentItemTitle}>
					{name}
					<Badge style={{ backgroundColor: gradeStatusColor(grade) }}>
						{grade}
					</Badge>
				</ItemTitle>
			</ItemContent>
		</Item>
	);
}
