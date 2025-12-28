"use client";

import { useState } from "react";
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
    User,
    Menu,
    X
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Timetable", href: "/dashboard/timetable", icon: Calendar },
    { name: "Teachers", href: "/dashboard/teachers", icon: Users },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Grades", href: "/dashboard/grades", icon: GraduationCap },
    { name: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="absolute top-4 left-4 z-50 p-2 bg-transparent text-black rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
            >
                {isOpen ? <></> : <Menu size={24} />}
            </button>

            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-[#7C3AED] text-white flex flex-col p-4 transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center gap-2 mb-8 px-2 mt-12">
                    <GraduationCap size={32} />
                    <h1 className="text-xl font-bold">EduSchedule</h1>
                </div>

                <Link
                    className="flex items-center justify-between bg-white/10 rounded-xl p-4 mb-8 hover:bg-white/20 transition-colors"
                    href="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                >
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
                                onClick={() => setIsOpen(false)}
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
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}