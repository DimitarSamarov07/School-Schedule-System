"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from "@/config/adminConfig";
import StatCard from "@/components/cards/StatCard";
import { Users } from "lucide-react";
import { useSchoolUser } from "@/hooks/use-school-user";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export default function Sidebar() {
    const pathname = usePathname();

    // 1. Extract isLoading from the provider
    const { currentSchool, isSudo, isLoading } = useCurrentSchool();

    // 2. Safe hook call
    const { users } = useSchoolUser(currentSchool?.SchoolId);

    const visibleItems = menuItems.filter(item => !item.sudoOnly || isSudo);

    // 3. Prevent rendering if STILL loading, OR if there is no school
    // This stops it from flashing or crashing before the token is read
    if (isLoading || !currentSchool) {
        return null;
    }

    // 4. Safe array fallback
    const userCount = users ? users.length : 0;

    return (
        <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200 py-4 overflow-y-auto shrink-0 flex flex-col">
            <nav className="px-4 space-y-1.5">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-lg font-semibold transition-all duration-200 ${
                                isActive
                                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <item.icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? 'text-indigo-600' : 'text-slate-400'}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto px-3 border-t border-slate-200 pt-4">
                <StatCard label="Активни потребители" value={userCount} color="#4A6FA5" icon={Users} />
            </div>
        </aside>
    );
}