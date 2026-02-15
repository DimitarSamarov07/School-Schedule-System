"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/lib/api/teachers";
import { Teacher } from "@/types/teacher";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useTeacherManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Teacher>>({ Name: '', Email: '' });
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const fetchTeachers = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;

        const shouldToggleLoading = !skipLoadingState;

        const clearTeachers = () => setTeacherList([]);

        const normalizeTeachers = (value: unknown): Teacher[] => {
            if (Array.isArray(value)) return value as Teacher[];
            return value ? [value as Teacher] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getTeachers(schoolId);

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearTeachers();
                return;
            }

            setTeacherList(normalizeTeachers(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearTeachers();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchTeachers(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchTeachers, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Email: '' });
        setSelectedTeacher(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createTeacher(schoolId, formData.Name!, formData.Email!);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create teacher");
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateTeacher(schoolId, Number(formData.id), formData.Name!, formData.Email!);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update teacher");
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedTeacher?.id) return;
        try {
            await deleteTeacher(Number(selectedTeacher.id), schoolId);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete teacher");
        }
    };

    const openEditModal = (teacher: Teacher) => {
        if (!isAdmin) return;
        setSelectedTeacher(teacher);
        setFormData(teacher);
        setActiveModal('edit');
    };

    const openDeleteModal = (teacher: Teacher) => {
        if (!isAdmin) return;
        setSelectedTeacher(teacher);
        setActiveModal('delete');
    };

    return {
        teacherList,
        isLoading: isLoading || !schoolId, // Loading if API is working OR school context isn't ready
        isAdmin,
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
        openDeleteModal,
        refresh: () => fetchTeachers(true)
    };
}
