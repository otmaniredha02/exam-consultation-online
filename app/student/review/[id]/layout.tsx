"use client";

import { useEffect, useState } from "react";
import "./layout.css";

// TODO: replace with real auth/session check
function useIsProfessor() {
	return true;
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<section>{children}</section>
		</div>
	);
}
