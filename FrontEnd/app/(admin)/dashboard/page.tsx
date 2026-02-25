'use client';

import { useEffect, useState } from 'react';
import PeriodTable from '@/components/containers/ScheduleTable';
import { transformSchedule, PeriodSection } from '@/utils/scheduleParse';
import { ScheduleEntry } from '@/types/schedule';

export default function TimetablePage() {
    const [sections, setSections] = useState<PeriodSection[]>([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        fetch('http://localhost:1343/schedule/betweenDates?schoolId=1&startDate=2026-02-17&endDate=2026-02-19', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then((data: ScheduleEntry[]) => setSections(transformSchedule(data)))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6 text-gray-400">Loading timetable…</p>;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {sections.map(s => (
                <PeriodTable key={s.id} name={s.name} time={s.time} rows={s.rows} />
            ))}
        </div>
    );
}
