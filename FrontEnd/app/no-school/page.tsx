"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, AlertCircle, RefreshCw, LogOut, Loader2, GraduationCap } from 'lucide-react';
import { logout } from "@/lib/api/auth";
import {performTokenRefresh} from "@/lib/api/auth";

export default function NoSchoolWarningPage() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Handler to refresh the page/check status again
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await performTokenRefresh()
        window.location.reload();
    };

    // Handler to log the user out safely
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-slate-900">

                <Link href="/" className="flex items-center justify-center gap-3 text-white mb-4 group">
                    <GraduationCap className="w-10 h-10 transition-transform group-hover:scale-110"/>
                    <span className="font-bold text-3xl tracking-tight">EduSchedule</span>
                </Link>

                {/* ── Main Card ── */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-10 relative">

                    <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500" />

                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-purple-600" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <AlertCircle className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* ── Text Content ── */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Профилът ви чака одобрение
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        Успешно влязохте в профила си, но все още не сте добавени към нито едно училище. <br/><br/>
                        <strong className="text-gray-700">Моля, свържете се с администратора на вашето училище</strong>, за да ви изпрати покана или да ви добави ръчно в системата.
                    </p>

                    {/* ── Actions ── */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing || isLoggingOut}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-purple-400"
                        >
                            {isRefreshing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <RefreshCw className="w-5 h-5" />
                            )}
                            Провери отново
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={isRefreshing || isLoggingOut}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            ) : (
                                <LogOut className="w-5 h-5" />
                            )}
                            Изход от профила
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}