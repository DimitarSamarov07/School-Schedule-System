import moment from 'moment';
import { ApiEntry, GradeRow, PeriodSection } from '@/types/schedule';

export function transformSchedule(
    entries:    ApiEntry[],
    allPeriods: Array<{ id: number; Name: string; Start: string; End: string }>,
    allClasses: Array<{ id: number; Name: string }>,
): PeriodSection[] {
    const lookup = new Map<number, Map<number, Map<number, ApiEntry>>>();

    for (const e of entries) {
        const dow = moment(e.Date).isoWeekday() - 1;
        if (dow < 0 || dow > 4) continue;
        if (!lookup.has(e.Period.Id))  lookup.set(e.Period.Id, new Map());
        const byClass = lookup.get(e.Period.Id)!;
        if (!byClass.has(e.Class.Id)) byClass.set(e.Class.Id, new Map());
        byClass.get(e.Class.Id)!.set(dow, e);
    }

    const sortedPeriods = [...allPeriods].sort((a, b) =>
        (a.Start ?? '').localeCompare(b.Start ?? '')
    );

    return sortedPeriods.map(period => {
        const byClass = lookup.get(period.id) ?? new Map();
        const rows: GradeRow[] = allClasses.map(cls => ({
            gradeId:   cls.id,
            gradeName: cls.Name,
            cells: [0, 1, 2, 3, 4].map(day => byClass.get(cls.id)?.get(day) ?? null),
        }));
        return {
            id:   period.id,
            name: period.Name,
            time: `${(period.Start ?? '').slice(0, 5)} – ${(period.End ?? '').slice(0, 5)}`,
            rows,
        };
    });
}