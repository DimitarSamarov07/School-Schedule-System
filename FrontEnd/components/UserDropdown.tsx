"use client";

import React, { useState } from 'react';
import { User, ChevronDown, LogOut, Settings } from 'lucide-react';
import {useCurrentSchool} from "@/providers/SchoolProvider";
import {logout} from "@/lib/api/user";
import {useRouter} from "next/navigation";


export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { username,email } = useCurrentSchool();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs text-slate-400 leading-none mb-1">Добре дошли,</p>
                    <p className="text-sm font-medium leading-none text-white">{username}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 text-slate-700 animate-in fade-in zoom-in duration-150">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                            <p className="text-sm font-semibold text-slate-900">{username}</p>
                            <p className="text-xs text-slate-500">{email}</p>
                        </div>
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm transition-colors">
                            <User size={16} className="text-slate-400" /> Моят профил
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm transition-colors">
                            <Settings size={16} className="text-slate-400" /> Настройки
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium transition-colors" onClick={handleLogout}>
                            <LogOut size={16} /> Изход
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}