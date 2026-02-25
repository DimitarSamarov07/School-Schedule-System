import { ScheduleEntry } from '@/types/schedule';
import { PeriodRow } from '@/components/containers/ScheduleTable';

export type PeriodSection = {
    id:   number;
    name: string;
    time: string;
    rows: PeriodRow[];
};

// Add/extend as your subjects grow
const SUBJECT_COLORS: Record<string, string> = {
    'English':         '#3b82f6',
    'History23':       '#ea580c',
    'Woodworking':     '#ca8a04',
    'P.E.':            '#e11d48',
    'Music':           '#0891b2',
    'Quantum Physics': '#7c3aed',
    'Mathematics':     '#16a34a',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_BY_INDEX = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toHHMM(time: string) {
    return time.slice(0, 5); // "10:30:00" → "10:30"
}

function dateToDayName(dateStr: string): string {
    // Append T00:00:00 to avoid UTC offset shifting the date
    return DAY_BY_INDEX[new Date(`${dateStr}T00:00:00`).getDay()];
}

export function transformSchedule(entries: ScheduleEntry[]): PeriodSection[] {
    const periodsMap = new Map<number, ScheduleEntry['Period']>();
    entries.forEach(e => {
        if (!periodsMap.has(e.Period.Id)) periodsMap.set(e.Period.Id, e.Period);
    });
    const periods = [...periodsMap.values()].sort((a, b) =>
        a.Start.localeCompare(b.Start)
    );

    const classesMap = new Map<number, string>();
    entries.forEach(e => {
        if (!classesMap.has(e.Class.Id)) classesMap.set(e.Class.Id, e.Class.Name);
    });
    const classes = [...classesMap.entries()].sort((a, b) => a[0] - b[0]);

    return periods.map(period => {
        const rows: PeriodRow[] = classes
            .map(([classId, className]) => {
                const dayMap: Record<string, ReturnType<typeof makeCard>> = {
                    Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null,
                };

                entries
                    .filter(e => e.Period.Id === period.Id && e.Class.Id === classId)
                    .forEach(e => {
                        const day = dateToDayName(e.Date);
                        if (DAYS.includes(day)) {
                            dayMap[day] = makeCard(e);
                        }
                    });

                return { grade: className, classes: dayMap };
            })
            .filter(row => Object.values(row.classes).some(Boolean));

        return {
            id:   period.Id,
            name: period.Name,
            time: `${toHHMM(period.Start)} - ${toHHMM(period.End)}`,
            rows,
        };
    })
        .filter(p => p.rows.length > 0);
}

function makeCard(e: ScheduleEntry) {
    return {
        className: e.Subject.Name,
        subject:   e.Subject.Name,
        teacher:   e.Teacher.Name,
        room:      e.Room.Name,
        color:     SUBJECT_COLORS[e.Subject.Name] ?? '#6b7280',
    };
}
