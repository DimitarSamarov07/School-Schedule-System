import React from "react";
import {UserCardProps} from "@/components/cards/interfaces/UserCardInterfaces";

export const UserCard: React.FC<UserCardProps> = ({ user, onPromote, onDemote }) => (
    <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
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
                    onClick={() => onDemote(user.id)}
                    className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all"
                >
                    Отнеми права
                </button>
            ) : (
                <button
                    onClick={() => onPromote(user.id)}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg transition-all"
                >
                    Направи администратор
                </button>
            )}
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-all">
                Прегледай
            </button>
        </div>
    </div>
);

export default UserCard;
