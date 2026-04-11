"use client";

import { useState, useEffect, useCallback } from 'react';
import { getClasses, createClass, updateClass, deleteGrade } from "@/lib/api/classes";
import { getRooms } from "@/lib/api/rooms"; // ← import your rooms API
import { Class } from "@/types/class";
import { Room } from "@/types/room";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useGradesManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [gradeList, setGradeList] = useState<Class[]>([]);
    const [roomList, setRoomList] = useState<Room[]>([]); // ← add this
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Class>>({ Name: '', Description: '' });
    const [selectedGrade, setSelectedGrade] = useState<Class | null>(null);

    const fetchGrades = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getClasses(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setGradeList([]);
                return;
            }
            setGradeList(Array.isArray(response) ? response : response ? [response as Class] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setGradeList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    // ← add this
    const fetchRooms = useCallback(async () => {
        if (!schoolId) return;
        try {
            const response = await getRooms(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setRoomList([]);
                return;
            }
            setRoomList(Array.isArray(response) ? response : response ? [response as Room] : []);
        } catch (error) {
            console.warn("Rooms API Error:", error);
            setRoomList([]);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchGrades();
        fetchRooms(); // ← fetch rooms on mount
    }, [fetchGrades, fetchRooms]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchGrades(true), 5000);
        return () => clearInterval(interval);
    }, [fetchGrades, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Description: '', Room: undefined });
        setSelectedGrade(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createClass(schoolId, formData.Name!, formData.Description!, Number(formData.Room!.id));
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!formData.id) return;
        try {
            await updateClass(schoolId, Number(formData.id), formData.Name, formData.Description, Number(formData.Room?.id));
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedGrade?.id) return;
        try {
            await deleteGrade(Number(selectedGrade.id), schoolId);
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const setSelectedEntity = (entity: unknown) => {
        const grade = entity as Class | null;
        setSelectedGrade(grade);
        if (grade) setFormData({ ...grade, Name: grade.Name || '', Description: grade.Description || '' });
    };

    return {
        gradeList,
        roomList, // ← expose it
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedGrade,
        selectedEntity: selectedGrade,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchGrades(true),
    };
}