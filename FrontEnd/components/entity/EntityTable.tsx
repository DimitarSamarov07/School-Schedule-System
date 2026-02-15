// components/EntityTable.tsx
import React from "react";
import { EntityRow } from "./EntityRow";

interface Props<T = any> {
    list: T[];
    manager: any;
    config: any;
}

export function EntityTable({ list, manager, config }: Props) {
    if (!list || list.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-gray-400 font-medium text-xl italic">Няма намерени записи.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <TableHead columns={config.columns} />
                <tbody className="divide-y divide-gray-50">
                {list.map((item, index) => (
                    <EntityRow
                        key={item.id as string}
                        item={item}
                        columns={config.columns}
                        manager={manager}
                        config={config}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

function TableHead({ columns }: { columns: any[] }) {
    return (
        <thead className="bg-gray-100 border-b border-gray-100">
        <tr>
            {columns.map((column, index) => (
                <th
                    key={index}
                    className={`px-10 py-6 font-black uppercase tracking-widest text-xs text-gray-500 ${
                        column.align === "right" ? "text-right" : ""
                    }`}
                >
                    {column.label}
                </th>
            ))}
            <th className="px-10 py-6 font-black uppercase tracking-widest text-xs text-right text-gray-500">
                Действия
            </th>
        </tr>
        </thead>
    );
}
