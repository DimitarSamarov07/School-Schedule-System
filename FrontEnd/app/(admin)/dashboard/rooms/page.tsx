"use client";

import React from 'react';
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRoomsManager } from "@/hooks/use-rooms-manager";

export default function RoomsManager() {
    const {
        roomsList,
        isLoading,
        activeModal,
        formData,
        selectedRoom,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal
    } = useRoomsManager();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Manage Rooms</h2>
                <button
                    onClick={() => setActiveModal('add')}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Room
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-gray-400" />
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="border-b text-gray-500 text-sm">
                    <tr>
                        <th className="pb-3">Room Name</th>
                        <th className="pb-3">Building</th>
                        <th className="pb-3">Floor</th>
                        <th className="pb-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {roomsList.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50">
                            <td className="py-4 font-bold">{room.Name}</td>
                            <td className="py-4 font-medium">{room.Building || "N/A"}</td>
                            <td className="py-4 text-gray-600">{room.Floor}</td>
                            <td className="py-4 text-right space-x-2">
                                <button
                                    onClick={() => openEditModal(room)}
                                    className="p-2 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                                >
                                    <Pencil className="w-4 h-4 text-black" />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(room)}
                                    className="p-2 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">
                            {activeModal === 'add' ? 'Add New Room' : activeModal === 'edit' ? `Edit ${selectedRoom?.Name}` : 'Delete Room'}
                        </h3>

                        {activeModal === 'delete' ? (
                            <div className="space-y-4">
                                <p>Are you sure you want to delete <span className="font-bold">{selectedRoom?.Name}</span>? This action cannot be undone.</p>
                                <div className="flex justify-end gap-3">
                                    <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">Confirm Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Room Name</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                        value={formData.Name}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                        placeholder="Enter room name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Building</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                        value={formData.Building}
                                        onChange={(e) => setFormData({ ...formData, Building: e.target.value })}
                                        placeholder="Enter building name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Floor</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                        value={formData.Floor}
                                        onChange={(e) => setFormData({ ...formData, Floor: Number(e.target.value) })}
                                        placeholder="Enter floor level"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        onClick={activeModal === 'add' ? handleCreate : handleUpdate}
                                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        {activeModal === 'add' ? 'Create Room' : 'Save Changes'}
                                    </button>
                                    <button onClick={closeModal} className="w-full py-2 text-gray-500 text-sm hover:underline">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}