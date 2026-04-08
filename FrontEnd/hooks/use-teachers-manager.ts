"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/lib/api/teachers";
import { Teacher } from "@/types/teacher";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useTeacherManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Teacher>>({ Name: '', Email: '' });
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const fetchTeachers = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getTeachers(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setTeacherList([]);
                return;
            }
            setTeacherList(Array.isArray(response) ? response : response ? [response as Teacher] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setTeacherList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchTeachers(true), 5000);
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
        if (!formData.id) return;
        try {
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

    const setSelectedEntity = (entity: unknown) => {
        const teacher = entity as Teacher | null;
        setSelectedTeacher(teacher);
        if (teacher) setFormData({
            ...teacher,
            Name: teacher.Name || '',
            Email: teacher.Email || '',
        });
    };

    return {
        teacherList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedTeacher,
        selectedEntity: selectedTeacher,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchTeachers(true),
    };
}