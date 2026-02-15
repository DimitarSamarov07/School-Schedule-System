"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useSubjectsManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Subject>>({ Name: '', Description: '' });
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const fetchSubjects = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;

        const shouldToggleLoading = !skipLoadingState;

        const clearSubjects = () => setSubjectList([]);

        const normalizeSubjects = (value: unknown): Subject[] => {
            if (Array.isArray(value)) return value as Subject[];
            return value ? [value as Subject] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getSubjects(schoolId);

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearSubjects();
                return;
            }

            setSubjectList(normalizeSubjects(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearSubjects();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchSubjects(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchSubjects, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Description: '' });
        setSelectedSubject(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createSubject(schoolId, formData.Name!, formData.Description!);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateSubject(schoolId, Number(formData.id), formData.Name!, formData.Description!);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedSubject?.id) return;
        try {
            await deleteSubject(Number(selectedSubject.id), schoolId);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openEditModal = (subject: Subject) => {
        if (!isAdmin) return;
        setSelectedSubject(subject);
        setFormData({
            ...subject,
            Name: subject.Name || '',
            Description: subject.Description || ''
        });
        setActiveModal('edit');
    };
    const openDeleteModal = (subject: Subject) => {
        if (!isAdmin) return;
        setSelectedSubject(subject);
        setActiveModal('delete');
    };

    return {
        subjectList,
        isLoading: isLoading || !schoolId, // Loading if API is working OR school context isn't ready
        isAdmin,
        activeModal,
        formData,
        selectedSubject,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
        refresh: () => fetchSubjects(true)
    };
}
