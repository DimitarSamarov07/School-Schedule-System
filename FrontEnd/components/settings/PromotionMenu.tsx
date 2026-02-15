import React from "react";
import {X} from "lucide-react";
import SettingsSidebar from "@/components/settings/Sidebar";


const users = [
    { id: 'nova-petрова', name: 'Нова Петрова', email: 'nova.petрова@school.bg', isAdmin: false, status: 'Активна' },
    { id: 'maria-ivanov', name: 'Мария Иванов', email: 'm.ivanov@school.bg', isAdmin: false, status: 'Активна' },
    { id: 'admin-user', name: 'Админ Потребител', email: 'admin@school.bg', isAdmin: true, status: 'Администратор' },
    { id: 'user3', name: 'Георги Димитров', email: 'g.dimitrov@school.bg', isAdmin: false, status: 'Активна' },
];
const handlePromote = async (userId) => {
    // Replace with your API call
    console.log('Promoting user to admin:', userId);
    setUsers(users.map(user =>
        user.id === userId
            ? { ...user, isAdmin: true, status: 'Администратор' }
            : user
    ));
    closeAll();
};

const handleDemote = async (userId) => {
    // Replace with your API call
    console.log('Demoting user from admin:', userId);
    // Update local state optimistically
    setUsers(users.map(user =>
        user.id === userId
            ? { ...user, isAdmin: false, status: 'Активна' }
            : user
    ));
};


export default function PromotionMenu() {


    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Търсене на потребители..."
                        className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${user.isAdmin ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                                                        <span className="text-2xl font-bold text-white">
                                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-slate-900 truncate">{user.name}</h3>
                                <p className="text-sm text-slate-500 mb-1">{user.email}</p>
                                <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-medium ${
                                    user.isAdmin
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${user.isAdmin ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                                    {user.status}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-slate-200/50">
                            {user.isAdmin ? (
                                <button
                                    onClick={() => handleDemote(user.id)}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all"
                                >
                                    Отнеми права
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePromote(user.id)}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg transition-all"
                                >
                                    Направи администратор
                                </button>
                            )}
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-all">
                                Прегледай
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
