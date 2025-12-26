
export default function DashboardOverview() {
    return (
        <div className="space-y-6 text-slate-900">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Overview</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold mb-4">Upcoming Classes (Today)</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span>09:00 AM - Mathematics</span>
                            <span className="text-purple-600 font-medium">Room 102</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition">
                            + Add Teacher
                        </button>
                        <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                            + New Subject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}