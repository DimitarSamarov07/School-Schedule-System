import {Calendar, Users, Book, DoorOpen, GraduationCap} from 'lucide-react';
import {StatsSummaryProps} from "@/components/admin/interfaces/StatsSummaryInterfaces";

export default function StatsSummary({ counts }: StatsSummaryProps) {
    const stats = [
        { label: 'Total Classes', value: counts.classes ?? 0, color: 'bg-purple-600', icon: Calendar },
        { label: 'Класове', value: counts.grades ?? 0, color: 'bg-red-500', icon: GraduationCap },
        { label: 'Учители', value: counts.teachers ?? 0, color: 'bg-green-500', icon: Users },
        { label: 'Предмети', value: counts.subjects ?? 0, color: 'bg-blue-400', icon: Book },
        { label: 'Стаи', value: counts.rooms ?? 0, color: 'bg-orange-500', icon: DoorOpen },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.label} className={`${stat.color} p-6 rounded-xl text-white shadow-md flex justify-between items-center`}>
                    <div>
                        <p className="text-l  font-bold opacity-90">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon size={40} className="opacity-80" />
                </div>
            ))}
        </div>
    );
}