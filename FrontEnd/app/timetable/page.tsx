"use client";

import ScheduleCard from "@/components/ScheduleCard";
import {useEffect, useRef, useState} from "react";
import {GraduationCap, User} from "lucide-react";
import {ScheduleItem} from "@/types/schedule";
import {useRunningPeriod,useNextPeriod} from "@/hooks/use-running-time";
// import useSchedulesByDate from "@/hooks/use-schedules-by-date";
import {useAutoScroll} from "@/hooks/use-auto-scroll";
import {getFormattedScheduleStrings} from "@/lib/utils";
import Link from "next/link";
import useSchedulesByDateTimeAndSchool from "@/hooks/use-schedules-by-date";

export default function Timetable() {
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {timeData, timeError} = useRunningPeriod(1);
    const {nextTimeData, nextTimeError} = useNextPeriod(1);
    // Define your inputs
    const schoolId = 1;
    const date = "2023-10-16"; // Format: YYYY-MM-DD
    const time = "08:40:00";   // Format: HH:mm:ss

    // Call the hook
    const { scheduleData, scheduleError, isLoading } = useSchedulesByDateTimeAndSchool(
        schoolId,
        date,
        time
    );
    useAutoScroll({
        scrollRef,
        data: scheduleData,
        mounted,
        intervalMs: 7000,
    });

    if (!mounted) return <div className="p-8 color-red-400">Initializing...</div>;
     if (timeError || nextTimeError)
         return <div className="p-8 text-red-500">Error loading data.</div>;
     if (!timeData  || !nextTimeData)
         return <div className="p-8 text-slate-500">Loading schedule...</div>;

    const currPeriod = timeData;
    const nextPeriod = nextTimeData;


    return (
        <>
            <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
                {/* --- HERO SECTION --- */}
                <div
                    className="w-full bg-linear-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] text-white p-12 relative text-center">
                    <div className="absolute top-6 left-0 px-8 w-full flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="w-8 h-8"/>
                            <h1 className="text-xl font-bold tracking-tight">EduSchedule</h1>
                        </Link>
                        <User className="w-6 h-6"/>
                    </div>

                    <div className="mt-8 p-1">
                        <p className="text-purple-100 text-lg font-medium">В момента</p>
                        <h3 className="text-6xl font-extrabold my-2">
                            {currPeriod.label}
                        </h3>
                        <p className="text-xl text-purple-100/80">{currPeriod.startTime} - {currPeriod.endTime}</p>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="max-w-7xl mx-auto p-10">
                    <header className="mb-10 text-center">
                        <h2 className="text-4xl font-bold text-slate-900 pb-7">
                            Следващ час: {nextPeriod.label}
                        </h2>
                        <p className="text-4xl font-normal text-slate-400">{nextPeriod.startTime} - {nextPeriod.endTime}</p>
                    </header>
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 pb-4"
                    >
                        {scheduleData?.map((item: ScheduleItem, index: number) => (
                            <div
                                key={index}
                                className="flex-none w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] snap-start"
                            >
                                <ScheduleCard data={item}/>
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="bg-muted py-8 mt-auto text-slate-400">
                    <div className="container mx-auto px-4 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <GraduationCap className="w-5 h-5 "/>
                            <span className="font-semibold text-slate-400">EduSchedule</span>
                        </div>
                        <p className="text-sm">
                            © 2025 School Management System. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
