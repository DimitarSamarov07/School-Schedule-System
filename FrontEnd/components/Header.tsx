"use client";
import { GraduationCap } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-[#0F172A] text-white z-20 shrink-0">
            <div className="flex items-center gap-2.5">
                    <GraduationCap size={40} />
                <span className="text-xl font-bold tracking-tight">EduSchedule</span>
            </div>

            <UserDropdown />
        </header>
    );
}