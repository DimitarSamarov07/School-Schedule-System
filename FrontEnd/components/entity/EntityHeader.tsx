import { Plus } from "lucide-react";
import {HeaderProps} from "@/components/entity/Interfaces/HeaderInterfaces";



export function EntityHeader({ manager, config }: HeaderProps) {
    const setActiveModal = manager.setActiveModal;
    return (
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">
                    {config.title}
                </h1>
                <p className="text-gray-500 font-medium">
                    Управлявайте вашите {config.title.toLowerCase()}
                </p>
            </div>
            <button
                onClick={() => setActiveModal("add")}
                className="bg-[#7C5CFC] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#6b4de0] transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center gap-3"
                disabled={!manager.isAdmin}
            >
                <Plus size={20} />
                Добави {config.singular}
            </button>
        </div>
    );
}
