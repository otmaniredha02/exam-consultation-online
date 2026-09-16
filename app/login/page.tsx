"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import "./login.css";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "@/components/ui/toast";
import { pb } from "@/lib/database/pocketdb";

const STUDENT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@stu\.univ-saida\.dz$/;
const STAFF_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@univ-saida\.dz$/;

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (password.length < 8) {
			toast.add({ description: "Password is too short.", type: "warning" });
			return;
		}

		let collection: string;
		let redirectPath: string;

		if (STUDENT_EMAIL_REGEX.test(email)) {
			collection = "students";
			redirectPath = "/student";
		} else if (STAFF_EMAIL_REGEX.test(email)) {
			collection = "professor";
			redirectPath = "/professor";
		} else {
			toast.add({ description: "Invalid email.", type: "warning" });
			return;
		}

		try {
			// TODO: store auth details / logs on server
			await pb.collection(collection).authWithPassword(email, password);
			router.push(redirectPath);
		} catch (error: any) {
			toast.add({ description: error.message, type: "warning" });
		}
	};

	return (
		<Card className="logincard">
			<form onSubmit={handleLogin}>
				<img
					className="logo"
					width={100}
					height={100}
					src="exam_review.png"
					alt="exam_review"
				/>

				<FieldLabel htmlFor="email">Email</FieldLabel>
				<Input placeholder="email" name="email" type="email" />

				<FieldLabel htmlFor="password">Password</FieldLabel>
				<div className="logincardpassinput">
					<Input
						name="password"
						placeholder="password"
						type={showPassword ? "text" : "password"}
					/>
					<Button
						type="button"
						variant="ghost"
						onClick={() => setShowPassword((prev) => !prev)}
					>
						👁
					</Button>
				</div>

				<Button type="submit">Login</Button>
			</form>

			<Toaster />
		</Card>
	);
}
