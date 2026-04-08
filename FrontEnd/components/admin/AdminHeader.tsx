"use client";
import { GraduationCap, CalendarDays } from 'lucide-react';
import UserDropdown from './UserDropdown';
import Link from "next/link";

export default function AdminHeader() {
    return (
        <header className="relative flex items-center justify-between px-6 py-4 bg-[#0F172A] text-white z-20 shrink-0">
            <Link href={"/"}>
                <div className="flex items-center gap-2.5">
                    <GraduationCap size={40} />
                    <span className="text-xl font-bold tracking-tight">EduSchedule</span>
                </div>
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/timetable">
                    <div className="flex items-center gap-2 px-20 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-200 text-sm font-medium tracking-wide cursor-pointer select-none">
                        <CalendarDays size={24} />
                        <span>Табло</span>
                    </div>
                </Link>
            </div>

            <UserDropdown />
        </header>
    );
}