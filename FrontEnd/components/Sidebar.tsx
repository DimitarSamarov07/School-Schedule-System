"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    BookOpen,
    GraduationCap,
    DoorOpen,
    LogOut,
    User
} from "lucide-react"; // Using Lucide for the icons in your screenshot

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Timetable", href: "/timetable", icon: Calendar },
    { name: "Teachers", href: "/dashboard/teachers", icon: Users },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Grades", href: "/dashboard/grades", icon: GraduationCap },
    { name: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-[#7C3AED] h-screen text-white flex flex-col p-4">
            <Link className="flex items-center gap-2 mb-8 px-2" href="/">
                <GraduationCap size={32} />
                <h1 className="text-xl font-bold">EduSchedule</h1>
            </Link>

            <Link className="flex items-center justify-between bg-white/10 rounded-xl p-4 mb-8" href="/dashboard/profile">
                <div>
                    <p className="font-semibold text-white">Admin User</p>
                    <p className="text-xs opacity-70 text-white">Administrator</p>
                </div>
                <User size={24} color="white" />
            </Link>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-white text-[#7C3AED] shadow-md"
                                    : "hover:bg-white/10 text-white"
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <button className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors mt-auto">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
}