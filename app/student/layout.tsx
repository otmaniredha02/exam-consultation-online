import StudentHeader from "./StudentHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="dashboard">
      <StudentHeader />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}