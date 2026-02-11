import { GraduationCap, Users, MapPin } from "lucide-react"; // Standard icon library
import { ScheduleItem } from "@/types/schedule";

export default function ScheduleCard({ data }: { data: ScheduleItem }) {
    return (
        <div className="w-full max-w-[320px] overflow-hidden rounded-2xl shadow-xl flex flex-col bg-white border border-slate-100">
            <div className="bg-[#7c3aed] px-5 py-4 flex items-center gap-3">
                <GraduationCap className="text-white w-6 h-6" />
                <h2 className="text-white text-lg font-semibold">
                    {data.Class.Name} клас
                </h2>
            </div>

            <div className="p-7 space-y-5">
                <h3 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">
                    {data.Subject.Name}
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Users className="w-5 h-5 opacity-70" />
                        <span className="text-xl font-medium">{data.Teacher.Name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                        <MapPin className="w-5 h-5 opacity-70" />
                        <span className="text-xl font-medium">
              Стая {data.Class.Room.Name}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}