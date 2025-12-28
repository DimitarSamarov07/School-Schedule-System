"use client"
// src/app/dashboard/page.tsx

import {BookOpen, Loader2, Pencil, Plus, Trash2} from "lucide-react";
import React from "react";
import {useSubjectsManager} from "@/hooks/use-subjects-manager";

export default function SubjectsPage() {
    const {
        subjectList,
        isLoading,
        activeModal,
        formData,
        selectedSubject,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal
    } = useSubjectsManager();

    const isEmpty = !isLoading && subjectList.length === 0;
    return (
        <div >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Subjects</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure and organize your rooms.</p>
                </div>

                {!isEmpty && !isLoading && (
                    <button
                        onClick={() => setActiveModal('add')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Subject
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
                    <p className="text-gray-500 animate-pulse">Loading subjects...</p>
                </div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="bg-purple-100 p-6 rounded-full mb-6">
                        <BookOpen className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No subjects created yet</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-10 leading-relaxed">
                        It looks like your subject list is empty. Start by adding your first subject to manage your school.
                    </p>
                    <button
                        onClick={() => setActiveModal('add')}
                        className="flex items-center gap-3 bg-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all shadow-xl shadow-purple-200 cursor-pointer group"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        Create Your First Subject
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Subject Name</th>
                            <th className="px-6 py-4 font-semibold">Color</th>
                            <th className="px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {subjectList.map((subject) => (
                            <tr key={subject.id} className="hover:bg-purple-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <BookOpen size={20}></BookOpen>
                                        </div>
                                        <span className="font-bold text-gray-900">{subject.Name}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Color {subject.Color}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-1">
                                    <button
                                        onClick={() => openEditModal(subject)}
                                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all"
                                        title="Edit Subject"
                                    >
                                        <Pencil className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(subject)}
                                        className="p-2.5 hover:bg-red-50 rounded-lg cursor-pointer transition-all group/del"
                                        title="Delete Subject"
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

            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />
                    <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {activeModal === 'add' ? 'Add New Subject' : activeModal === 'edit' ? `Edit ${selectedSubject?.Name}` : 'Delete Subject'}
                        </h3>

                        {activeModal === 'delete' ? (
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{selectedSubject?.Name}</span>?
                                    This action will remove all associated data and cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 cursor-pointer"
                                    >
                                        Delete Subject
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject Name</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Name}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                        placeholder="e.g. Conference Subject A"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Color}
                                        onChange={(e) => setFormData({ ...formData, Color: e.target.value })}
                                    >
                                        <option value="red" >Red</option>
                                        <option value="orange">Orange</option>
                                        <option value="yellow">Yellow</option>
                                        <option value="green">Green</option>
                                        <option value="blue">Blue</option>
                                        <option value="indigo">Indigo</option>
                                        <option value="purple">Purple</option>
                                        <option value="pink">Pink</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={activeModal === 'add' ? handleCreate : handleUpdate}
                                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 cursor-pointer"
                                    >
                                        {activeModal === 'add' ? 'Create Subject' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        Discard Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}