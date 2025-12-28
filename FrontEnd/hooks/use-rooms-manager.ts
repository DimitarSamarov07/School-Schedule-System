"use client";

import { useState, useEffect, useCallback } from 'react';
import { getRoom, createRoom, updateRoom, deleteRoom } from "@/lib/api/rooms";
import { Room } from "@/types/room";

export function useRoomsManager() {
    const [roomsList, setRoomsList] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({ Name: '', Building: '', Floor: 0 });
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getRoom();
            if (!response) {
                setRoomsList([]);
            } else if (Array.isArray(response)) {
                setRoomsList(response as Room[]);
            } else {
                setRoomsList([response as Room]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setRoomsList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Building: '', Floor: 0 });
        setSelectedRoom(null);
    };

    const handleCreate = async () => {
        try {
            await createRoom(formData.Name!, formData.Floor);
            await fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateRoom(formData.id, formData.Name, formData.Floor);
            await fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!selectedRoom?.id) return;
        try {
            await deleteRoom(selectedRoom.id);
            await fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete room");
        }
    };

    const openEditModal = (room: Room) => {
        setSelectedRoom(room);
        setFormData(room);
        setActiveModal('edit');
    };

    const openDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setActiveModal('delete');
    };

    return {
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
    };
}