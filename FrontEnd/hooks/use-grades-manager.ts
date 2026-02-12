"use client";

import { useState, useEffect, useCallback } from 'react';
import { getGrades, createGrade, updateGrade, deleteGrade } from "@/lib/api/grades";
import { Grade } from "@/types/grade";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useGradesManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [gradeList, setGradeList] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Grade>>({ Name: '', Description: '' });
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

    const fetchGrades = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;

        const shouldToggleLoading = !skipLoadingState;

        const clearGrades = () => setGradeList([]);

        const normalizeGrades = (value: unknown): Grade[] => {
            if (Array.isArray(value)) return value as Grade[];
            return value ? [value as Grade] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getGrades(schoolId);

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearGrades();
                return;
            }

            setGradeList(normalizeGrades(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearGrades();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchGrades();
    }, [fetchGrades]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchGrades(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchGrades, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Description: '', Room: undefined});
        setSelectedGrade(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createGrade(schoolId,formData.Name!, formData.Description!,Number(formData.Room!.id));
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateGrade(schoolId,Number(formData.id), formData.Name, formData.Description,1);
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
            await deleteGrade(Number(selectedGrade.id),schoolId);
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openEditModal = (grade: Grade) => {
        if (!isAdmin) return;
        setSelectedGrade(grade);
        setFormData(grade);
        setActiveModal('edit');
    };

    const openDeleteModal = (grade: Grade) => {
        if (!isAdmin) return;
        setSelectedGrade(grade);
        setActiveModal('delete');
    };

    return {
        gradeList,
        isLoading: isLoading || !schoolId, // Loading if API is working OR school context isn't ready
        isAdmin,
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
        refresh: () => fetchGrades(true)
    };
}