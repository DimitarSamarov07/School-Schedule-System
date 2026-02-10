"use client";

import { Loader2, Pencil, Trash2, Search } from "lucide-react";
import React from "react";
import { Grade } from "@/types/grade";

export default function ClassListContainer({ manager }: { manager: any }) {
    const {
        gradeList,
        isLoading,
        activeModal,
        formData,
        selectedGrade,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
    } = manager;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#7C5CFC] w-10 h-10 mb-4" />
                <p className="text-gray-500 animate-pulse font-medium">Зареждане на класове...</p>
            </div>
        );
    }

    return (
        <div className="p-10 bg-white rounded-2xl font-sans overflow-hidden ">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">Класове и учебни зали</h1>
                    <p className="text-gray-500 font-medium">Управлявайте вашите класове и учебни зали</p>
                </div>
                <button
                    onClick={() => setActiveModal("add")}
                    className="bg-[#7C5CFC] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#6b4de0] transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center gap-2"
                >
                    Добави клас
                </button>
            </div>


            <div className="mb-8 max-w-2xl ">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7C5CFC] transition-colors" />
                    <input
                        type="text"
                        placeholder="Търсене по име на клас..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-sm outline-none focus:border-[#7C5CFC]/30 focus:ring-4 focus:ring-[#7C5CFC]/5 transition-all text-lg font-medium text-gray-700"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b border-gray-100">
                    <tr className="text-gray-500">
                        <th className="px-10 py-6 font-black uppercase tracking-widest text-xs">Клас</th>
                        <th className="px-10 py-6 font-black uppercase tracking-widest text-xs">Стая</th>
                        <th className="px-10 py-6 font-black uppercase tracking-widest text-xs">Специалност / Забележки</th>
                        <th className="px-10 py-6 font-black uppercase tracking-widest text-xs text-right">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {gradeList.map((grade: Grade) => (
                        <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-10 py-7 text-[#1A1A1A] font-bold text-xl">{grade.Name}</td>
                            <td className="px-10 py-7">
                                    <span className="bg-purple-50 text-purple-500 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
                                        {grade.Room?.Name || "Без стая"}
                                    </span>
                            </td>
                            <td className="px-10 py-7 text-gray-600 font-medium text-lg">{grade.Description || ""}</td>

                            <td className="px-10 py-7">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => openEditModal(grade)}
                                        className="p-3 text-[#7C5CFC] hover:bg-purple-50 rounded-2xl transition-all"
                                    >
                                        <Pencil className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(grade)}
                                        className="p-3 text-[#E74C3C] hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {gradeList.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-gray-400 font-medium text-xl italic">Няма намерени записи.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-8">
                            {activeModal === "add" ? "Добави нов клас" : activeModal === "edit" ? `Редакция: ${selectedGrade?.Name}` : "Изтриване"}
                        </h3>

                        {activeModal === "delete" ? (
                            <div className="space-y-8">
                                <p className="text-gray-600 text-lg leading-relaxed">Сигурни ли сте че искате да изтриете клас <span className="font-bold text-black border-b-2 border-red-200">{selectedGrade?.Name}</span>?</p>
                                <div className="flex gap-4">
                                    <button onClick={closeModal} className="flex-1 px-6 py-4 text-gray-500 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition-all">Отказ</button>
                                    <button onClick={handleDelete} className="flex-1 px-6 py-4 bg-[#E74C3C] text-white rounded-2xl font-extrabold hover:bg-red-600 transition-all shadow-lg shadow-red-100">Изтрий</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Име на Клас</label>
                                    <input
                                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold"
                                        value={formData.Name}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                        placeholder="напр. 10А"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Име на стая</label>
                                    <input
                                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold"
                                        value={formData.Room?.Name}
                                        onChange={(e) => setFormData({ ...formData, Room: e.target.value })}
                                        placeholder="напр. Стая 204"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Специалност/забележки</label>
                                    <input
                                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold"
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                        placeholder="напр. Приложно програмиране"
                                    />
                                </div>
                                <div className="pt-6 flex flex-col gap-4">
                                    <button
                                        onClick={activeModal === "add" ? handleCreate : handleUpdate}
                                        className="w-full bg-[#7C5CFC] text-white py-4.5 rounded-2xl font-black text-xl shadow-xl shadow-purple-100 hover:translate-y-[-2px] transition-all"
                                    >
                                        {activeModal === "add" ? "СЪЗДАЙ" : "ЗАПАЗИ"}
                                    </button>
                                    <button onClick={closeModal} className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">Отказ</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}