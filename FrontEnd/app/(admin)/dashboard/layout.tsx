"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StatsSummary from "@/components/StatsSummary";
import {
    Calendar,
    Users,
    BookOpen,
    GraduationCap,
    DoorOpen,
    Timer,
    RefreshCw
} from "lucide-react";
import { useRoomsManager } from "@/hooks/use-rooms-manager";
import {useSubjectsManager} from "@/hooks/use-subjects-manager";
import {useTeacherManager} from "@/hooks/use-teachers-manager";
import {useGradesManager} from "@/hooks/use-grades-manager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const { roomsList, isLoading } = useRoomsManager();
    const { subjectList } = useSubjectsManager();
    const { teacherList } = useTeacherManager();
    const { gradeList } = useGradesManager();

    const isActive = (path: string) => pathname === path;

    const tabBaseStyles = "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-normal transition-all rounded-md ";
    const activeStyles = "bg-white text-black font-bold shadow-sm";
    const inactiveStyles = "text-slate-500 hover:text-slate-700 hover:bg-slate-100";

    const navItems = [
        { name: "Timetable", href: "/dashboard", icon: Calendar },
        { name: "Teachers", href: "/dashboard/teachers", icon: Users },
        { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
        { name: "Grades", href: "/dashboard/grades", icon: GraduationCap },
        { name: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
        { name: "Times", href: "/dashboard/times", icon: Timer },
    ];

    return (
        <div className="flex h-screen text-slate-900 bg-slate-50">
            <main className="flex-1 overflow-y-auto">
                {/* Header Section */}
                <header className="py-10 px-8 bg-white border-b border-slate-200 relative">
                    <div className="absolute top-4 left-4">
                        <Sidebar />
                    </div>
                    <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
                </header>

                <div className="px-8 mt-8">

                    {/* Stats Summary - Hydrates automatically when roomsList changes */}
                    <StatsSummary
                        counts={{
                            rooms: roomsList.length,
                            teachers: teacherList.length,
                            classes: 40,
                            subjects: subjectList.length,
                            grades: gradeList.length,
                        }}
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="mt-8 mb-4 w-[95%] mx-auto bg-slate-200/50 border border-slate-200 rounded-xl overflow-hidden p-1">
                    <nav className="flex w-full gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${tabBaseStyles} ${
                                    isActive(item.href) ? activeStyles : inactiveStyles
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <section className="px-8 py-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm min-h-[400px] border border-slate-200">
                        {isLoading && roomsList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                <p>Loading Dashboard Data...</p>
                            </div>
                        ) : (
                            children
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}