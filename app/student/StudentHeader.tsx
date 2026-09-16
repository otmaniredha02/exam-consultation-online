"use client";

import {
	Bell,
	ChevronDown,
	CircleUserRound,
	List,
	LogOut,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StudentNotificationItem } from "@/app/components/student-notification-menu/student-notification-item";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pb } from "@/lib/database/pocketdb";
import "./studentDashboard.css";
import { StudentList } from "../professor/review/components/StudentList";
import { ExerciceItem } from "./components/ExerciceItem";

export default function StudentHeader() {
	const username =
		pb.authStore.record?.username.split("_").join(" ") != undefined
			? pb.authStore.record?.username.split("_").join(" ")
			: "user not found!";

	const router = useRouter();

	const [profileOpen, setProfileOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [claimsOpen, setClaimsOpen] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	function handleProfileOpenChange(open: boolean) {
		setProfileOpen(open);

		if (open) {
			setNotificationOpen(false);
		}
	}

	function handleNotificationOpenChange(open: boolean) {
		setNotificationOpen(open);

		if (open) {
			setProfileOpen(false);
		}
	}

	function openLogoutDialog() {
		setProfileOpen(false);

		requestAnimationFrame(() => {
			setLogoutDialogOpen(true);
		});
	}

	function handleLogout() {
		setLogoutDialogOpen(false);

		// TODO:
		// clear auth/session
		pb.authStore.clear();
		router.push("/login");
	}

	return (
		<>
			<header className="dashboard-header">
				{/* =========================== Profile =========================== */}

				<DropdownMenu open={profileOpen} onOpenChange={handleProfileOpenChange}>
					<DropdownMenuTrigger className="profile-button">
						<Link href="/student">
							<CircleUserRound size={42} strokeWidth={1.5} />
						</Link>

						<span>{username}</span>

						<ChevronDown size={18} className={profileOpen ? "rotate" : ""} />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						sideOffset={10}
						className="profile-dropdown-content"
					>
						<DropdownMenuItem onClick={() => router.push("student/profile")}>
							<User size={18} />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							className="logout-item"
							onClick={openLogoutDialog}
						>
							<LogOut size={18} />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* =========================== claims =========================== */}

				<Dialog open={claimsOpen} onOpenChange={setClaimsOpen}>
					<DialogTrigger
						render={
							<button type="button" className="claims-button">
								<List size={30} />
								<h1>claims</h1>
							</button>
						}
					/>

					<DialogContent className="claims-dialog-content">
						<DialogHeader>
							<DialogTitle>Your claims</DialogTitle>
							<DialogDescription>
								Review your exercises below and send a claim if you think a
								question was graded incorrectly.
							</DialogDescription>
						</DialogHeader>

						<div className="claims-list">
							<ExerciceItem />
							<ExerciceItem />
							<ExerciceItem />
						</div>
					</DialogContent>
				</Dialog>

				{/* =========================== Notifications =========================== */}

				<DropdownMenu
					open={notificationOpen}
					onOpenChange={handleNotificationOpenChange}
				>
					<DropdownMenuTrigger
						render={<button type="button" className="notification-button" />}
						className="notification-button"
					>
						<Bell />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						sideOffset={10}
						className="notification-dropdown-content"
					>
						<StudentNotificationItem />
						<StudentNotificationItem />
						<StudentNotificationItem />
						<StudentNotificationItem />
						<StudentNotificationItem />
						<StudentNotificationItem />
					</DropdownMenuContent>
				</DropdownMenu>
			</header>

			{/* ===========================
          Logout Dialog
      =========================== */}

			<Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Logout</DialogTitle>

						<DialogDescription>
							Are you sure you want to logout?
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setLogoutDialogOpen(false)}
						>
							Cancel
						</Button>

						<Button variant="destructive" onClick={handleLogout}>
							Logout
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
