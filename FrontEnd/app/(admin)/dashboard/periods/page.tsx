"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {usePeriodsManager} from "@/hooks/use-periods-manager";
import PeriodListContainer from "@/components/containers/PeriodListContainer";

export default function TimesPage() {
    const manager = usePeriodsManager();

    return (
        <div className="max-w-9xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Управлявайте вашите часове</h2>
                    <p className="text-sm text-gray-500 mt-1">Конфигурирайте и организирайте вашите часове.</p>
                </div>

                {!manager.isLoading && manager.timeList.length > 0 && (
                    <button
                        onClick={() => manager.setActiveModal('add')}
                        className="flex items-center gap-2 bg-purple-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/> Добавете час
                    </button>
                )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
                <PeriodListContainer manager={manager}/>
            </Suspense>
        </div>
    );
}