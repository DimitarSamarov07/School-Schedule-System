// app/timetable/layout.tsx

export default function TimetableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="timetable-wrapper">
      <main>{children}</main>
    </section>
  );
}