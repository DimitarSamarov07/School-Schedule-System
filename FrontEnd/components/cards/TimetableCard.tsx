type ClassInfo = {
    className: string;
    subject: string;
    teacher: string;
    room: string;
    color: string;
} | null;

export default function TimetableCard({ info }: { info: ClassInfo }) {
    if (!info) {
        return (
            <div className="flex items-center justify-center min-h-[90px] text-gray-400 text-sm">
                No class
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-3 text-white relative min-h-[90px]"
            style={{ backgroundColor: info.color }}
        >
            <div className="absolute top-2 right-2 flex gap-1">
                <button className="p-1 rounded-md bg-white/20 hover:bg-white/35 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </button>
                <button className="p-1 rounded-md bg-white/20 hover:bg-white/35 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                </button>
            </div>
            <p className="font-bold text-sm pr-14 leading-tight">{info.className}</p>
            <p className="text-xs mt-1 opacity-80">{info.subject}</p>
            <p className="text-xs opacity-80">{info.teacher}</p>
            <p className="text-xs opacity-80">{info.room}</p>
        </div>
    );
}
