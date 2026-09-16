"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import styles from "./StudentSelectedClaims.module.css";

export function ClaimItem({ exercice, question, points, note }: any) {
	const [isgradeupdate, setIsgradeupdate] = useState<boolean>(false);
	const [isreject, setIsreject] = useState<boolean>(false);

	return (
		<Collapsible className={styles.claimCard}>
			<CollapsibleTrigger className={styles.claimTrigger}>
				<Badge className={styles.claimBadge}>{exercice}</Badge>
				<Badge className={styles.claimBadge}>{question}</Badge>
				<Badge className={styles.claimBadge}>{points} pts</Badge>
			</CollapsibleTrigger>
			<CollapsibleContent className={styles.claimContent}>
				<h1>Note</h1>
				<p className={styles.claimNote}>{note}</p>
				<br />
				<div className={styles.claimActions}>
					<Button
						variant={"secondary"}
						onClick={() => {
							setIsreject(false);
							setIsgradeupdate(!isgradeupdate);
						}}
					>
						accept
					</Button>
					<Button
						variant={"destructive"}
						onClick={() => {
							setIsgradeupdate(false);
							setIsreject(!isreject);
						}}
					>
						reject
					</Button>
				</div>
				{isgradeupdate ? <UpdateGrade /> : <></>}
				{isreject ? <RejectMessage /> : <></>}
			</CollapsibleContent>
		</Collapsible>
	);
}

function UpdateGrade() {
	return (
		<div className={styles.updateGradeForm}>
			<Input placeholder="new grade" />
			<Button>update</Button>
		</div>
	);
}

function RejectMessage() {
	return (
		<div className={styles.rejectForm}>
			<h1>Why:</h1>
			<Input placeholder="write something" />
			<Button>send</Button>
		</div>
	);
}
