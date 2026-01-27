"use client";

import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import GradeListContainer from "@/components/containers/GradeListContainer";
import { useGradesManager } from "@/hooks/use-grades-manager";

export default function GradesPage() {
    const manager = useGradesManager();

    return (
        <div className="max-w-9xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Управлявайте класовете си</h2>
                    <p className="text-sm text-gray-500 mt-1">Конфигурирайте и управлявайте класовете си .</p>
                </div>

                {!manager.isLoading && manager.gradeList.length > 0 && (
                    <button
                        onClick={() => manager.setActiveModal('add')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/> Добави клас
                    </button>
                )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
                <GradeListContainer manager={manager} />
            </Suspense>
        </div>
    );
}