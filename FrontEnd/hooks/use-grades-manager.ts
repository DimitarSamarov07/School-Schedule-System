"use client";

import { useState, useEffect, useCallback } from 'react';
import { getGrades, createGrade, updateGrade, deleteGrade } from "@/lib/api/grades";
import { Grade } from "@/types/grade";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useGradesManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [gradeList, setGradeList] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Grade>>({ Name: '', Description: '' });
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

    const fetchGrades = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getGrades(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setGradeList([]);
                return;
            }
            setGradeList(Array.isArray(response) ? response : response ? [response as Grade] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setGradeList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { fetchGrades(); }, [fetchGrades]);

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
            await createGrade(schoolId, formData.Name!, formData.Description!, Number(formData.Room!.id));
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
            await updateGrade(schoolId, Number(formData.id), formData.Name, formData.Description, 1);
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

    const setSelectedEntity = (entity: unknown) => setSelectedGrade(entity as Grade | null);

    return {
        gradeList,
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