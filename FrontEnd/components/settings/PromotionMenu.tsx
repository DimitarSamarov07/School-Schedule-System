import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getAllSchoolUsers, demoteUser, promoteUser } from "@/lib/api/schoolUser";
import {User,ApiUser} from "@/types/schoolUser";


interface PromotionMenuProps {
    schoolId:number;
}

export default function PromotionMenu({ schoolId }: PromotionMenuProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllSchoolUsers(schoolId);

                const transformedUsers: User[] = data.map((user: ApiUser) => ({
                    id: user.Id,
                    name: user.Username,
                    email: user.Email,
                    isAdmin: user.IsAdmin === 1,
                    status: user.IsAdmin === 1 ? 'Администратор' : 'Активна'
                }));

                setUsers(transformedUsers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        if (schoolId) {
            fetchUsers();
        }
    }, [schoolId]);

    const handlePromote = async (userId: number) => {
        try {
            await promoteUser(schoolId, userId);
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isAdmin: true, status: 'Администратор' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to promote user:', err);
        }
    };

    const handleDemote = async (userId: number) => {
        try {
            await demoteUser(schoolId, userId);
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isAdmin: false, status: 'Активна' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to demote user:', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
                <div className="text-lg text-slate-500">Зареждане...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
                <div className="text-lg text-red-500">Грешка: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={32} color="#ffffff" />
                    </div>
                    <input
                        type="text"
                        placeholder="Търсене на потребители..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg text-black"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            <X size={20} className="text-slate-400 hover:text-slate-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${user.isAdmin ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                                <span className="text-2xl font-bold text-white">
                                    {user.name.split(/[\s,_\s]/).map(n => n[0]).join('').toUpperCase()}
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

            {filteredUsers.length === 0 && searchTerm && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="w-16 h-16 text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Няма намерени потребители</h3>
                    <p className="text-slate-500">Опитайте с различно търсене</p>
                </div>
            )}
        </div>
    );
}
