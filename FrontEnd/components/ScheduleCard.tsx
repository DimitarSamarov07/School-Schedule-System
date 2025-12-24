import {ScheduleItem} from "@/types/schedule";

export default function ScheduleCard({ data }: { data: ScheduleItem }) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-4xl shadow-lg flex flex-col bg-white">
      {/* Upper Section: Class Name */}
      <div className="px-7 py-6">
        <h2 className="text-3xl font-bold text-slate-900">
          {data.Class.Name} клас
        </h2>
      </div>

      {/* Lower Section: Course Details */}
      <div className="bg-primary p-7 grow flex flex-col justify-between min-h-57.5">
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white leading-tight">
            {data.Course.Name}
          </h3>
        </div>
        <div className="space-y-1">
          <p className="text-xl text-white/80">
            {data.Course.Teacher.FirstName} {data.Course.Teacher.LastName}
          </p>
          <p className="text-xl text-white/80">Стая {data.Course.Room.Name}</p>
        </div>
      </div>
    </div>
  );
}
