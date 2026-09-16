"use client";

import {
	ChevronDown,
	CircleUserRound,
	LogOut,
	SquarePlus,
	User,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pb } from "@/lib/database/pocketdb";
import "./ProfessorDashboard.css";
import { NewConsultationDialog } from "@/app/components/ConsultationCard/newConsultation";
import { DialogTrigger } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import type { Consultation } from "../types/types";
import { StudentList } from "./review/components/StudentList";

export default function ProfessorHeader() {
	const username =
		pb.authStore.record?.username.split("_").join(" ") ?? "user not found!";

	const router = useRouter();
	const pathname = usePathname();
	const [profileOpen, setProfileOpen] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const Consultation: Consultation = {
		course: "",
		date: new Date(),
		duration: 0,
		exam_correction_file: null,
		gradings: [],
		id: "",
		level: "",
		professor_id: "",
		speciality: "",
		isPublic: true,
	};

	function handleProfileOpenChange(open: boolean) {
		setProfileOpen(open);
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
				{/* ===========================
            Profile
        =========================== */}

				<DropdownMenu open={profileOpen} onOpenChange={handleProfileOpenChange}>
					<DropdownMenuTrigger className="profile-button">
						<Link href="/professor">
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
						<DropdownMenuItem onClick={() => router.push("professor/profile")}>
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

				{/* ===========================
            schedule new consultation session
        =========================== */}
				{pathname.includes("/review") ? (
					<div style={{ display: "flex", gap: "1rem" }}>
						<Dialog>
							<DialogTrigger>
								<Button
									style={{ backgroundColor: "white" }}
									variant={"destructive"}
								>
									end
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>Are sure want to end session ?</DialogHeader>
								<DialogFooter>
									<Button variant={"destructive"}>end session</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<Drawer>
							<DrawerTrigger render={<Button variant="outline" />}>
								<UserIcon />
								<p>students</p>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader></DrawerHeader>
								<div className="p-4">
									<StudentList />
								</div>
							</DrawerContent>
						</Drawer>
					</div>
				) : (
					<Dialog>
						<DialogTrigger>
							<div className="consulation-button">
								<SquarePlus />
								<p>consultation</p>
							</div>
						</DialogTrigger>
						<NewConsultationDialog
							consultationItem={Consultation}
							action="CREATE"
						/>
					</Dialog>
				)}
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
