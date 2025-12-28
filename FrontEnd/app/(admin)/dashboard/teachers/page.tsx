"use client"

import {Users, Loader2, Pencil, Plus, Trash2} from "lucide-react";
import React from "react";
import {useTeacherManager} from "@/hooks/use-teachers-manager";

export default function TeachersPage() {
    const {
        teacherList,
        isLoading,
        activeModal,
        formData,
        selectedTeacher,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal
    } = useTeacherManager();

    const isEmpty = !isLoading && teacherList.length === 0;
    return (
        <div >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Teachers</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure and organize your school.</p>
                </div>

                {!isEmpty && !isLoading && (
                    <button
                        onClick={() => setActiveModal('add')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Teacher
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
                    <p className="text-gray-500 animate-pulse">Loading teachers...</p>
                </div>
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <div className="bg-purple-100 p-6 rounded-full mb-6">
                        <Users className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No teachers created yet</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-10 leading-relaxed">
                        It looks like your teacher list is empty. Start by adding your first teacher to manage your school.
                    </p>
                    <button
                        onClick={() => setActiveModal('add')}
                        className="flex items-center gap-3 bg-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all shadow-xl shadow-purple-200 cursor-pointer group"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        Create Your First Teacher
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Teacher Name</th>
                            <th className="px-6 py-4 font-semibold">Color</th>
                            <th className="px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {teacherList.map((teacher) => (
                            <tr key={teacher.id} className="hover:bg-purple-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                            <Users size={20}></Users>
                                        </div>
                                        <span className="font-bold text-gray-900">{teacher.FirstName} {teacher.LastName}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Email {teacher.Email}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Teacher {teacher.Subject.Name}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-1">
                                    <button
                                        onClick={() => openEditModal(teacher)}
                                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all"
                                        title="Edit Teacher"
                                    >
                                        <Pencil className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(teacher)}
                                        className="p-2.5 hover:bg-red-50 rounded-lg cursor-pointer transition-all group/del"
                                        title="Delete Teacher"
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
                            {activeModal === 'add' ? 'Add New Teacher' : activeModal === 'edit' ? `Edit ${selectedTeacher?.FirstName} ${selectedTeacher?.LastName}` : 'Delete Teacher'}
                        </h3>

                        {activeModal === 'delete' ? (
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{selectedTeacher?.FirstName} {selectedTeacher?.LastName}</span>?
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
                                        Delete Teacher
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher First Name</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.FirstName}
                                        onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                                        placeholder="e.g. John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher Last Name</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.LastName}
                                        onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                                        placeholder="e.g. Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                        placeholder="e.g. example@example.com"
                                    >
                                    </input>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    >
                                        <option value="red">Red</option>
                                        <option value="green">Green</option>
                                        <option value="blue">Blue</option>
                                        <option value="yellow">Yellow</option>
                                        <option value="purple">Purple</option>
                                        <option value="pink">Pink</option>
                                        <option value="orange">Orange</option>
                                        <option value="gray">Gray</option>
                                        <option value="brown">Brown</option>
                                        <option value="black">Black</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        onClick={activeModal === 'add' ? handleCreate : handleUpdate}
                                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 cursor-pointer"
                                    >
                                        {activeModal === 'add' ? 'Create Teacher' : 'Save Changes'}
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