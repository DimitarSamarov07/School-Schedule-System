import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import {CsrfProvider} from "@/providers/CSRFProvider";
import {SchoolProvider} from "@/providers/SchoolProvider";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <SchoolProvider>
            <CsrfProvider>
                <div className="flex flex-col h-screen font-sans antialiased text-slate-900">
                    <AdminHeader/>
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar/>
                        <main className="flex-1 bg-white overflow-y-auto p-10">
                            <div className="max-w-8xl mx-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </CsrfProvider>
        </SchoolProvider>
    );
}