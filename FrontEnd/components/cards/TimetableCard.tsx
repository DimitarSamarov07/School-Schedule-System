import {Pencil, Trash2} from "lucide-react";

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
                Няма час
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
                    <Pencil size={15}></Pencil>
                </button>
                <button className="p-1 rounded-md bg-white/20 hover:bg-white/35 transition-colors">
                    <Trash2 size={15}></Trash2>
                </button>
            </div>
            <p className="font-bold text-sm pr-14 leading-tight">{info.className}</p>
            <p className="text-xs mt-1 opacity-80">{info.subject}</p>
            <p className="text-xs opacity-80">{info.teacher}</p>
            <p className="text-xs opacity-80">{info.room}</p>
        </div>
    );
}
