"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api/rooms";
import { Room } from "@/types/room";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useRoomsManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [roomsList, setRoomsList] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Room>>({ Name: '', Capacity: 0, Floor: 0 });
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const isFetchingRef = useRef(false);

    const fetchRooms = useCallback(async (skipLoadingState = false) => {
        if (!schoolId || isFetchingRef.current) return;
        isFetchingRef.current = true;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getRooms(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setRoomsList([]);
                return;
            }
            setRoomsList(Array.isArray(response) ? response : response ? [response as Room] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setRoomsList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [schoolId]);

    useEffect(() => { fetchRooms(); }, [fetchRooms]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchRooms(true), 30000);
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
        if (!formData.id) return;
        try {
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

    const setSelectedEntity = (entity: unknown) => {
        const room = entity as Room | null;
        setSelectedRoom(room);
        if (room) setFormData({
            ...room,
            Name: room.Name || '',
            Capacity: room.Capacity || 0,
            Floor: room.Floor || 0,
        });
    };

    return {
        roomsList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedRoom,
        selectedEntity: selectedRoom,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchRooms(true),
    };
}