import {CsrfProvider} from "@/providers/CSRFProvider";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <CsrfProvider>
        <section className="timetable-wrapper">
            <main>{children}</main>
        </section>
            </CsrfProvider>
    );
}