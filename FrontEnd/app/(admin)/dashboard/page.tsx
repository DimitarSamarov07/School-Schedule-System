'use client';

import {useEffect, useState} from 'react';
import PeriodTable from '@/components/containers/ScheduleTable';
import {PeriodSection, transformSchedule} from '@/utils/scheduleParse';
import {ScheduleEntry} from '@/types/schedule';
import StatCard from "@/components/cards/StatCard";
import {Building, Clock, GraduationCap, Palette, Users} from "lucide-react";
import {getScheduleBetweenDates} from "@/lib/api/schedule";
import {useCurrentSchool} from "@/providers/SchoolProvider";
import moment from "moment";
import {useRoomsManager} from "@/hooks/use-rooms-manager";
import {useGradesManager} from "@/hooks/use-grades-manager";
import {useTeacherManager} from "@/hooks/use-teachers-manager";
import {useSubjectsManager} from "@/hooks/use-subjects-manager";
import {usePeriodsManager} from "@/hooks/use-periods-manager";

export default function TimetablePage() {

    const { currentSchool } = useCurrentSchool();
    const {roomsList} = useRoomsManager();
    const {gradeList} = useGradesManager();
    const {teacherList} = useTeacherManager();
    const {subjectList} = useSubjectsManager();
    const {timeList} = usePeriodsManager();
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
                <StatCard label="Учители" value={teacherList.length} color="#3B5BDB" icon={GraduationCap}/>
                <StatCard label="Класове" value={gradeList.length} color="#0F9B8E" icon={Users}/>
                <StatCard label="Стаи" value={roomsList.length} color="#7C5CFC" icon={Building}/>
                <StatCard label="Предмети" value={subjectList.length} color="#E05C8A" icon={Palette}/>
                <StatCard label="Часове" value={timeList.length} color="#E8703A" icon={Clock}/>
            </div>
            <div className="pt-10 space-y-6 max-w-9xl ">
                {sections.map(s => (
                    <PeriodTable key={s.id} name={s.name} time={s.time} rows={s.rows}/>
                ))}
            </div>
        </>
    );
}
