import { Flag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import styles from "./exerciceitem.module.css";

interface Question {
	question: string;
	points: number;
}

interface Exercice {
	name: string;
	questions: Question[];
}

export function ExerciceItem() {
	const [exercice] = useState<Exercice>({
		name: "exo1",
		questions: [
			{ question: "question 1", points: 3.5 },
			{ question: "question 2", points: 2 },
			{ question: "question 3", points: 4.5 },
		],
	});

	const [claims, setClaims] = useState<Record<number, string>>({});
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const totalPoints = exercice.questions.reduce((sum, q) => sum + q.points, 0);

	const handleClaimChange = (index: number, value: string) => {
		setClaims((prev) => ({ ...prev, [index]: value }));
	};

	const handleSubmitClaim = (index: number) => {
		const text = claims[index]?.trim();
		if (!text) return;
		// TODO: wire up to actual submit endpoint
		console.log(`Claim for question ${index + 1}:`, text);
		setOpenIndex(null);
	};

	return (
		<details className={styles.exerciceCard}>
			<summary className={styles.exerciceSummary}>
				<span className={styles.exerciceName}>{exercice.name}</span>
				<span className={styles.exerciceMeta}>
					<span className={styles.questionCount}>
						{exercice.questions.length} question
						{exercice.questions.length > 1 ? "s" : ""}
					</span>
					<span className={styles.totalBadge}>{totalPoints} pts</span>
					<svg
						className={styles.chevron}
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</span>
			</summary>

			<ul className={styles.questionList}>
				{exercice.questions.map((question, index) => (
					<li key={index} className={styles.questionItem}>
						<span className={styles.questionIndex}>{index + 1}</span>
						<p className={styles.questionText}>{question.question}</p>
						<span className={styles.pointsBadge}>{question.points} pts</span>

						<Dialog
							open={openIndex === index}
							onOpenChange={(open) => setOpenIndex(open ? index : null)}
						>
							<DialogTrigger
								render={
									<button
										type="button"
										className={styles.claimTrigger}
										aria-label="Send a claim for this question"
									>
										<Flag size={15} />
										<span className={styles.claimTriggerLabel}>Claim</span>
									</button>
								}
							/>

							<DialogContent className={styles.claimDialog}>
								<DialogHeader>
									<DialogTitle className={styles.claimDialogTitle}>
										Send a claim
									</DialogTitle>
									<p className={styles.claimDialogSubtitle}>
										{exercice.name} — question {index + 1}
									</p>
								</DialogHeader>

								<Textarea
									className={styles.claimTextarea}
									placeholder="Explain why you're contesting this question's grading..."
									value={claims[index] ?? ""}
									onChange={(e) => handleClaimChange(index, e.target.value)}
									rows={5}
									autoFocus
								/>

								<DialogFooter className={styles.claimDialogFooter}>
									<DialogClose
										render={
											<Button variant="outline" type="button">
												Cancel
											</Button>
										}
									/>
									<Button
										type="button"
										onClick={() => handleSubmitClaim(index)}
										disabled={!claims[index]?.trim()}
									>
										Send
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</li>
				))}
			</ul>
		</details>
	);
}
