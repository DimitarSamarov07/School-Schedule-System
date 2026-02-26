'use client';

import {useEffect, useState} from 'react';
import PeriodTable from '@/components/containers/ScheduleTable';
import {PeriodSection, transformSchedule} from '@/utils/scheduleParse';
import {ScheduleEntry} from '@/types/schedule';
import StatCard from "@/components/cards/StatCard";
import {Calendar, GraduationCap, Users} from "lucide-react";
import {getScheduleBetweenDates} from "@/lib/api/schedule";
import {useCurrentSchool} from "@/providers/SchoolProvider";
import moment from "moment";

export default function TimetablePage() {

    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const startDate = moment().startOf('week').format('YYYY-MM-DD');
    const endDate = moment().endOf('week').format('YYYY-MM-DD');
    const isAdmin = currentSchool?.IsAdmin === 1;
    const [sections, setSections] = useState<PeriodSection[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getScheduleBetweenDates(schoolId, startDate, endDate)
            .then((data: ScheduleEntry[]) => setSections(transformSchedule(data)))
            .catch(err => console.error('Failed to load schedule:', err))
            .finally(() => setLoading(false));
    }, [endDate, schoolId, startDate]);


    if (loading) return <p className="p-6 text-gray-400">Loading timetable…</p>;

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Timetable</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Teachers" value='12' color="#10b981" icon={GraduationCap}/>
                <StatCard label="Total Classes" value={12} color="#6366f1" icon={Calendar}/>
                <StatCard label="Teachers" value={5} color="#10b981" icon={Users}/>
                <StatCard label="Teachers" value={5} color="#10b981" icon={Users}/>
                <StatCard label="Teachers" value={5} color="#10b981" icon={Users}/>
            </div>
            <div className="pt-10 space-y-6 max-w-9xl ">
                {sections.map(s => (
                    <PeriodTable key={s.id} name={s.name} time={s.time} rows={s.rows}/>
                ))}
            </div>
        </>
    );
}
