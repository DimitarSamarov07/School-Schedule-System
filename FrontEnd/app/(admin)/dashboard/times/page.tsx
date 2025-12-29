"use client";

import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import {useTimesManager} from "@/hooks/use-times-manager";
import TimeListContainer from "@/components/containers/TimeListContainer";

export default function TimesPage() {
    const manager = useTimesManager();

    return (
        <div className="max-w-9xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Times</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure and organize your times.</p>
                </div>

                {!manager.isLoading && manager.timeList.length > 0 && (
                    <button
                        onClick={() => manager.setActiveModal('add')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/> Add time
                    </button>
                )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
                <TimeListContainer manager={manager} />
            </Suspense>
        </div>
    );
}