"use client";

import React, { useState } from 'react';
import {GraduationCap, Palette, Shield,  Users} from "lucide-react";
import PromotionMenu from "@/components/settings/PromotionMenu";
import SecurityMenu from "@/components/settings/SecurityMenu";

const tabs = [
    { icon: Users, label: 'Потребители', id: 'users' },
    { icon: Shield, label: 'Сигурност', id: 'security' },
    { icon: GraduationCap, label: 'Курсове', id: 'courses' },
    { icon: Palette, label: 'Настройки', id: 'settings' },
];

const tabContent = {
    security: <SecurityMenu/>,
    users: <PromotionMenu schoolId={1}/>,
    courses: <div className="p-6 "><h3>Курсове</h3><p>Списък с курсове...</p></div>,
    settings: <div className="p-6"><h3>Настройки</h3><p>Конфигурация...</p></div>,
};
interface SidebarProps {
    totalUsers: number;
    totalAdmin: number;
}

export default function SettingsSidebar({ totalUsers, totalAdmin } :SidebarProps) {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="flex h-auto">
            <div className="w-64 bg-gradient-to-b from-purple-50/80 to-indigo-50/80 border-r border-purple-200/50 p-4 flex flex-col min-h-full">
                {tabs.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
                        </button>
                    );
                })}
                <div className="mt-auto space-y-2">
                    <div className="p-3 bg-white/50 rounded-2xl border border-slate-200/50">
                        <p className="text-xs text-slate-500 mb-1">Администратори</p>
                        <p className="text-xl font-bold text-slate-900">{totalAdmin}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/50">
                        <p className="text-xs text-emerald-600 mb-1">Обичайни</p>
                        <p className="text-xl font-bold text-slate-900">{totalUsers}</p>
                    </div>
                </div>
            </div>
            {/* Tab content area */}
            <div className="flex-1 bg-white border-t border-slate-200">
                {tabContent[activeTab]}
            </div>
        </div>
    );
}
