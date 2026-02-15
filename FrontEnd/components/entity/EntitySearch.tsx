import { Search } from "lucide-react";
import { useState } from "react";

export function EntitySearch() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <div className="mb-8 max-w-2xl">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7C5CFC] transition-colors" />
                <input
                    type="text"
                    placeholder="Търсене..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-sm outline-none focus:border-[#7C5CFC]/30 focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all text-lg font-medium text-gray-700"
                />
            </div>
        </div>
    );
}
