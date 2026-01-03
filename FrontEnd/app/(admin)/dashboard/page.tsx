import Link from "next/link";


export default function DashboardOverview() {
    return (
        <div className="space-y-6 text-slate-900">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Overview</h2>
                <Link className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      href="/timetable">View timetable</Link>
            </div>
        </div>
    );
}