
export default function AuthLayout({
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