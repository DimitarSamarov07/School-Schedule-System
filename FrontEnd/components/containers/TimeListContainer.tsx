"use client";

import { Timer, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Time } from "@/types/time";

export default function TimeListContainer({ manager }: { manager: any }) {
    const {
        timeList,
        isLoading,
        activeModal,
        formData,
        selectedTime,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUptime,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
    } = manager;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
                <p className="text-gray-500 animate-pulse">Зареждане на часовете...</p>
            </div>
        );
    }

    const isEmpty = timeList.length === 0;

    return (
        <>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="bg-purple-100 p-6 rounded-full mb-6">
                        <Timer className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Няма добавени часове</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-10 leading-relaxed">
                        Започнете като добавите часове.
                    </p>
                    <button
                        onClick={() => setActiveModal("add")}
                        className="flex items-center gap-3 bg-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all shadow-xl shadow-purple-200 cursor-pointer group"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        Направете първия си час
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Име</th>
                            <th className="px-6 py-4 font-semibold">Начало</th>
                            <th className="px-6 py-4 font-semibold">Край</th>
                            <th className="px-6 py-4 text-right font-semibold">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {timeList.map((time: Time) => (
                            <tr key={time.id} className="hover:bg-purple-50/30 transition-colors group">
                                <td className="px-6 py-4 font-bold text-gray-900">{time.Name}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{time.Start}</td>
                                <td className="px-6 py-4">
                                            {time.End}
                                </td>
                                <td className="px-6 py-4 text-right space-x-1">
                                    <button
                                        onClick={() => openEditModal(time)}
                                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-100"
                                    >
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(time)}
                                        className="p-2.5 hover:bg-red-50 rounded-lg cursor-pointer transition-all group/del"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400 group-hover/del:text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL SYSTEM */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />
                    <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {activeModal === "add"
                                ? "Добавете нов час"
                                : activeModal === "edit"
                                    ? `Променете час: ${selectedTime?.Name}`
                                    : "Изтрийте час"}
                        </h3>

                        {activeModal === "delete" ? (
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed">
                                    Сигурни ли сте че искате да изтриете <span className="font-bold text-gray-900">{selectedTime?.Name}</span>?
                                    Това действие ще изтрие този запис и всички данни свързани с него .
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Отказ
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 cursor-pointer"
                                    >
                                        Изтрий час
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Име</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Name}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                        placeholder="1-ви час"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Начален час</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Start}
                                        onChange={(e) => setFormData({ ...formData, Start: e.target.value })}
                                        placeholder="9:30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Краен час</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.End}
                                        onChange={(e) => setFormData({ ...formData, End: e.target.value })}
                                        placeholder="10:20"
                                    />
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={activeModal === "add" ? handleCreate : handleUptime}
                                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 cursor-pointer"
                                    >
                                        {activeModal === "add" ? "Създай час" : "Запази промените"}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        Отказ
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}