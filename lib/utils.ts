import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function gradeStatusColor(grade: string) {
	const grd = Number.parseInt(grade.split("/")[0]);
	if (grd >= 14) return "green";
	if (grd >= 10) return "orange";
	return "red";
}
