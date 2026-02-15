// components/EntityRow.tsx
import { Pencil, Trash2 } from "lucide-react";

interface Props<T = any> {
    item: T;
    columns: any[];
    manager: any;
    config: any;
}

export function EntityRow({ item, columns, manager, config }: Props) {
    const getNestedValue = (obj: any, path: string): any => {
        return path.split(".").reduce((o, p) => o?.[p], obj);
    };

    const openEdit = () => manager.openEditModal(item);
    const openDelete = () => manager.openDeleteModal(item);

    return (
        <tr className="hover:bg-gray-50/50 transition-colors group">
            {columns.map((column, colIndex) => (
                <td
                    key={colIndex}
                    className={`px-10 py-7 ${column.align === "right" ? "text-right" : ""}`}
                >
                    {column.render ? (
                        column.render(item)
                    ) : (
                        <span className="text-[#1A1A1A] font-bold text-xl">
              {getNestedValue(item, column.key) || ""}
            </span>
                    )}
                </td>
            ))}
            <td className="px-10 py-7">
                <div className="flex justify-end gap-3">
                    <button
                        onClick={openEdit}
                        className="p-3 text-[#7C5CFC] hover:bg-purple-50 rounded-2xl transition-all group-hover:scale-105"
                        disabled={!manager.isAdmin}
                    >
                        <Pencil className="w-6 h-6" />
                    </button>
                    <button
                        onClick={openDelete}
                        className="p-3 text-[#E74C3C] hover:bg-red-50 rounded-2xl transition-all group-hover:scale-105"
                        disabled={!manager.isAdmin}
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
