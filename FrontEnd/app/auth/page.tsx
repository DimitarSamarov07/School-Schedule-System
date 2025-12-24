"use client";

import {useEffect, useRef, useState} from "react";
import {GraduationCap} from "lucide-react";
import {useRunningTime} from "@/hooks/use-running-time";
import useSchedulesByDate from "@/hooks/use-schedules-by-date";
import {useAutoScroll} from "@/hooks/use-auto-scroll";
import {getFormattedScheduleStrings} from "@/lib/utils";
import Link from "next/link";

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { timeData, timeError} = useRunningTime();
  const { scheduleData, scheduleError } = useSchedulesByDate("2025-07-07");
  useAutoScroll({
    scrollRef,
    data: scheduleData,
    mounted,
    intervalMs: 7000,
  });

  if (!mounted) return <div className="p-8 color-red-400">Initializing...</div>;
  if (timeError || scheduleError)
    return <div className="p-8 text-red-500">Error loading data.</div>;
  if (!timeData || !scheduleData)
    return <div className="p-8 text-slate-500">Loading schedule...</div>;

  const hour = timeData.currentHour.numberInSchedule;
  const startTime = timeData.currentHour.startTime;
  const endTime = timeData.currentHour.endTime;
  getFormattedScheduleStrings({
    hour: hour,
    startTime: startTime,
    endTime: endTime,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center ">
        <div className="absolute top-30 left-0 w-full flex items-center justify-center">

          <Link href="/" className="flex items-center gap-2">
                      <GraduationCap className="w-8 h-8" />
                      <h1 className="text-xl font-bold tracking-tight">EduSchedule</h1>
                    </Link>
                  </div>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10 text-slate-900 ">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8b5cf6] text-white py-2 px-4 rounded-md hover:bg-[#7c3aed] transition-colors font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
