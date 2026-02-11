"use client";

import { useEffect, useState } from "react";
import { GraduationCap, User, Coffee } from "lucide-react";
import Link from "next/link";
import { useRunningPeriod, useNextPeriod } from "@/hooks/use-running-time";
import useSchedulesByDateTimeAndSchool from "@/hooks/use-schedules-by-date";

export default function Timetable() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // API Hooks
    // Using IDs and static strings as per your original snippet
    const { timeData, timeError } = useRunningPeriod(1);
    const { nextTimeData, nextTimeError } = useNextPeriod(1);

    const schoolId = 1;
    const date = "2023-10-16";
    const time = "08:40:00";

    const { scheduleData, isLoading } = useSchedulesByDateTimeAndSchool(
        schoolId,
        date,
        time
    );

    // 1. Loading & Error States
    if (!mounted) return <div className="p-8 text-slate-400">Initializing...</div>;
    if (timeError || nextTimeError) return <div className="p-8 text-red-500 text-center">Грешка при зареждане.</div>;
    if (isLoading) return <div className="p-8 text-slate-500 text-center">Зареждане...</div>;

    // 2. Non-Study Day Logic
    // Triggers if no current period exists or the schedule array is empty/null
    const isNonStudyDay = !timeData || !scheduleData || scheduleData.length === 0;

    if (isNonStudyDay) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-lg border border-slate-100">
                    <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Coffee className="w-12 h-12 text-purple-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Неучебен ден</h2>
                    <p className="text-slate-500 text-xl leading-relaxed">
                        В момента няма планирани учебни занятия. <br />
                        Платформата ще се актуализира автоматично при следващ час.
                    </p>
                    <Link href="/" className="mt-10 inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors">
                        Към началната страница
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden flex flex-col">
            <div className="w-full bg-linear-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] text-white p-12 relative text-center rounded-b-[3rem] shadow-xl">
                <div className="absolute top-6 left-0 px-8 w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8" />
                        <h1 className="text-xl font-bold tracking-tight">EduSchedule</h1>
                    </Link>
                    <User className="w-6 h-6" />
                </div>

                <div className="mt-8 p-1">
                    <p className="text-purple-100 text-lg font-medium opacity-90">В момента</p>
                    <h3 className="text-6xl font-extrabold my-2 tracking-tight">
                        {timeData.label}
                    </h3>
                    <p className="text-xl text-purple-100/80 font-medium">
                        {timeData.startTime} - {timeData.endTime}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-10 w-full grow flex flex-col items-center justify-center">
                <header className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 pb-3">
                        Следващ час: {nextTimeData?.label || "Край на програмата"}
                    </h2>
                    <p className="text-3xl font-normal text-slate-400">
                        {nextTimeData?.startTime && nextTimeData?.endTime
                            ? `${nextTimeData.startTime} - ${nextTimeData.endTime}`
                            : "Няма повече часове за днес"}
                    </p>
                </header>

                {/* You can place your external ScheduleCard list component here
            or any other content you wish to display when school is in session.
        */}
            </main>

            <footer className="bg-white border-t border-slate-100 py-10 mt-auto text-slate-400">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                        <span className="font-bold text-slate-600">EduSchedule</span>
                    </div>
                    <p className="text-sm">
                        © 2026 School Management System. Всички права запазени.
                    </p>
                </div>
            </footer>
        </div>
    );
}