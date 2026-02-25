import TimetableCard from '../cards/TimetableCard';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type ClassInfo = {
    className: string;
    subject: string;
    teacher: string;
    room: string;
    color: string;
} | null;

export type PeriodRow = {
    grade: string;
    classes: Record<string, ClassInfo>;
};

export type PeriodTableProps = {
    name: string;
    time: string;
    rows: PeriodRow[];
};

export default function PeriodTable({ name, time, rows }: PeriodTableProps) {
    return (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">

            <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 to-purple-500 px-6 py-4">
                <span className="text-xl font-bold text-white">{name}</span>
                <span className="text-sm font-medium text-white/90">{time}</span>
            </div>

            <div className="grid bg-white border-b border-gray-200" style={{ gridTemplateColumns: '90px repeat(5, 1fr)' }}>
                <div className="px-4 py-3 text-sm font-medium text-gray-500">Grade</div>
                {DAYS.map((day) => (
                    <div key={day} className="px-3 py-3 text-sm font-semibold text-gray-800 text-center border-l border-gray-200">
                        {day}
                    </div>
                ))}
            </div>

            {rows.map((row) => (
                <div
                    key={row.grade}
                    className="grid border-b border-gray-100 last:border-0 bg-white"
                    style={{ gridTemplateColumns: '90px repeat(5, 1fr)' }}
                >
                    <div className="bg-purple-50 flex items-center justify-center p-3 border-r border-gray-100">
            <span className="bg-purple-100 text-purple-700 font-bold text-sm px-3 py-1.5 rounded-full">
              {row.grade}
            </span>
                    </div>
                    {DAYS.map((day) => (
                        <div key={day} className="p-2 border-l border-gray-100">
                            <TimetableCard info={row.classes[day] ?? null} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
