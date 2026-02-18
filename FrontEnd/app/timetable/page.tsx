"use client";

import {useEffect, useState, useRef} from "react";
import {Coffee, GraduationCap, User} from "lucide-react";
import Link from "next/link";
import {useNextPeriod, useRunningPeriod} from "@/hooks/use-running-time";
import useSchedulesByDateTimeAndSchool from "@/hooks/use-schedules-by-date";
import {useAutoScroll} from "@/hooks/use-auto-scroll"; // Add this import
import moment from "moment";
import ScheduleCard from "@/components/cards/ScheduleCard";

export default function Timetable() {
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null); // Add scroll ref

    useEffect(() => {
        setMounted(true);
    }, []);

    // @ts-ignore
    const {timeData, timeError} = useRunningPeriod(1);
    const {nextTimeData, nextTimeError} = useNextPeriod(1);

    const schoolId = 1;
    const date = moment().format("YYYY-MM-DD");
    const time = moment().format("HH:mm:ss");
    const {scheduleData, isLoading} = useSchedulesByDateTimeAndSchool(
        schoolId,
        date,
        time
    );
    console.log(scheduleData);

    // Auto-scroll hook - activates only when >4 cards
    useAutoScroll({
        scrollRef: scrollRef,
        data: scheduleData,
        mounted: mounted,
        intervalMs: 6000 // Scroll every 6 seconds
    });

    if (!mounted) return <div className="p-8 text-slate-400">Initializing...</div>;
    if (timeError || nextTimeError) return <div className="p-8 text-red-500 text-center">Грешка при зареждане.</div>;
    if (isLoading) return <div className="p-8 text-slate-500 text-center">Зареждане...</div>;

    const isNonStudyDay = !timeData || !scheduleData || scheduleData.length === 0;

    if (isNonStudyDay) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-lg border border-slate-100">
                    <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Coffee className="w-12 h-12 text-purple-600"/>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Неучебен ден</h2>
                    <p className="text-slate-500 text-xl leading-relaxed">
                        В момента няма планирани учебни занятия. <br/>
                        Платформата ще се актуализира автоматично при следващ час.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden flex flex-col">
            <div
                className="w-full bg-linear-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] text-white p-12 relative text-center rounded-b-[3rem] shadow-xl">
                <div className="absolute top-6 left-0 px-8 w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8"/>
                        <h1 className="text-xl font-bold tracking-tight">EduSchedule</h1>
                    </Link>
                    <User className="w-6 h-6"/>
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

                {/* Horizontal scrollable container with auto-scroll */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 w-full max-w-7xl"
                >
                    {scheduleData.map((schedule, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ScheduleCard data={schedule} />
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-white border-t border-slate-100 py-10 mt-auto text-slate-400">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-purple-500"/>
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
