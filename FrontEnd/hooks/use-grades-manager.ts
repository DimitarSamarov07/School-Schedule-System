"use client";

import { useState, useEffect, useCallback } from 'react';
import {getGrades, createGrade, updateGrade, deleteGrade} from "@/lib/api/grades";
import { Grade } from "@/types/grade";

export function useGradesManager() {
    const [gradeList, setGradeList] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Grade>>({ Name: '', Description: '' });
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

    const fetchGrades = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getGrades();
            let data: Grade[] = [];
            if (response) {
                data = Array.isArray(response) ? response : [response];
            }
            setGradeList(data);
        } catch (error) {
            console.error("Fetch error:", error);
            if (!silent) setGradeList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGrades();
    }, [fetchGrades]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchGrades(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchGrades, gradeList]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Description: ''});
        setSelectedGrade(null);
    };

    const handleCreate = async () => {
        try {
            await createGrade(formData.Name!, formData.Description!);
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateGrade(formData.id, formData.Name, formData.Description);
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!selectedGrade?.id) return;
        try {
            await deleteGrade(selectedGrade.id);
            await fetchGrades(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subject");
        }
    };

    const openEditModal = (grade: Grade) => {
        setSelectedGrade(grade);
        setFormData(grade);
        setActiveModal('edit');
    };

    const openDeleteModal = (grade: Grade) => {
        setSelectedGrade(grade);
        setActiveModal('delete');
    };

    return {
        gradeList: gradeList,
        isLoading,
        activeModal,
        formData,
        selectedGrade: selectedGrade,
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