import ProfessorHeader from "./ProfessorHeader";
import "./ProfessorDashboard.css";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="dashboard">
      <ProfessorHeader />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}