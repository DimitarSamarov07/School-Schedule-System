import {Calendar, Users, Book, DoorOpen} from 'lucide-react';

const stats = [
    { label: 'Total Classes', value: '40', color: 'bg-purple-600', icon: Calendar },
    { label: 'Teachers', value: '5', color: 'bg-green-500', icon: Users },
    { label: 'Subjects', value: '8', color: 'bg-blue-400', icon: Book },
    { label: 'Rooms', value: '8', color: 'bg-orange-500', icon: DoorOpen },
];

export default function StatsSummary() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.label} className={`${stat.color} p-6 rounded-xl text-white shadow-md flex justify-between items-center`}>
                    <div>
                        <p className="text-sm font-medium opacity-90">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="text-3xl ">
                        <stat.icon color="white" size={40} className="text-slate-900" ></stat.icon>
                    </div>
                </div>
            ))}
        </div>
    );
}