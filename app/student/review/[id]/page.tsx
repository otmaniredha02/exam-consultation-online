"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOBILE_BREAKPOINT = 768;

export default function ReviewSession() {
	const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

	useEffect(() => {
		const handleResize = () =>
			setIsDesktop(window.innerWidth > MOBILE_BREAKPOINT);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (isDesktop === null) return null;

	return (
		<>
			{isDesktop ? (
				<div style={{ display: "flex", gap: "1rem" }}>
					<div style={{ width: "100%" }}>
						<h1>exam correction</h1>
						<iframe
							src="https://www.reqview.com/papers/ReqView-Example_Software_Requirements_Specification_SRS_Document.pdf"
							width="98%"
							height="420px"
						></iframe>
					</div>

					<div style={{ width: "100%" }}>
						<h1>your exam sheet</h1>
						<iframe
							src="https://www.reqview.com/papers/ReqView-Example_Software_Requirements_Specification_SRS_Document.pdf"
							width="98%"
							height="420px"
						></iframe>
					</div>
				</div>
			) : (
				<div className="mobile-pdf-page">
					<Tabs defaultValue="account" className="w-[100%] mobile-pdf-tabs">
						<TabsList>
							<TabsTrigger value="account">exam correction</TabsTrigger>
							<TabsTrigger value="password">your exam sheet</TabsTrigger>
						</TabsList>
						<TabsContent className="mobile-pdf-viewport" value="account">
							<iframe
								className="mobile-pdf-frame"
								src="https://www.reqview.com/papers/ReqView-Example_Software_Requirements_Specification_SRS_Document.pdf"
							></iframe>
						</TabsContent>
						<TabsContent className="mobile-pdf-viewport" value="password">
							<iframe
								className="mobile-pdf-frame"
								src="https://www.reqview.com/papers/ReqView-Example_Software_Requirements_Specification_SRS_Document.pdf"
							></iframe>
						</TabsContent>
					</Tabs>
				</div>
			)}
		</>
	);
}
