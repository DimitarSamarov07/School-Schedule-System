import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useSchoolUser } from "@/hooks/use-school-user"; // Adjust path as needed
import UserCard from "@/components/cards/UserCard";

interface PromotionMenuProps {
    schoolId: number;
}

export default function PromotionMenu({ schoolId }: PromotionMenuProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const { users, loading, error, handlePromote, handleDemote } = useSchoolUser(schoolId);

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} onPromote={handlePromote} onDemote={handleDemote} />
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
