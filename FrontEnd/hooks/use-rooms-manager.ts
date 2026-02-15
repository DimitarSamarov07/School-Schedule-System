"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api/rooms";
import { Room } from "@/types/room";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useRoomsManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [roomsList, setRoomsList] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({ Name: '', Capacity: 0, Floor: 0 });
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const isFetchingRef = useRef(false);

    const fetchRooms = useCallback(async (skipLoadingState = false) => {
        if (!schoolId || isFetchingRef.current) return;

        const shouldToggleLoading = !skipLoadingState;
        isFetchingRef.current = true;

        const clearRooms = () => setRoomsList([]);

        const normalizeRooms = (value: unknown): Room[] => {
            if (Array.isArray(value)) return value as Room[];
            return value ? [value as Room] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getRooms(schoolId);

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearRooms();
                return;
            }

            setRoomsList(normalizeRooms(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearRooms();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [schoolId]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchRooms(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchRooms, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Capacity: 0, Floor: 0 });
        setSelectedRoom(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createRoom(schoolId, formData.Name!, Number(formData.Floor!), formData.Capacity!);
            await fetchRooms(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateRoom(schoolId, Number(formData.id), formData.Name!, Number(formData.Floor!), formData.Capacity!);
            await fetchRooms(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedRoom?.id) return;
        try {
            await deleteRoom(Number(selectedRoom.id), schoolId);
            await fetchRooms(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete room");
        }
    };

    const openEditModal = (room: Room) => {
        if (!isAdmin) return;
        setSelectedRoom(room);
        // Fix ESLint input null warning
        setFormData({
            ...room,
            Name: room.Name || '',
            Capacity: room.Capacity || 0,
            Floor: room.Floor || 0
        });
        setActiveModal('edit');
    };

    const openDeleteModal = (room: Room) => {
        if (!isAdmin) return;
        setSelectedRoom(room);
        setActiveModal('delete');
    };

    return {
        roomsList,
        isLoading: isLoading || !schoolId, // Loading if API working OR school context missing
        isAdmin,
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
        openDeleteModal,
        refresh: () => fetchRooms(true)
    };
}
