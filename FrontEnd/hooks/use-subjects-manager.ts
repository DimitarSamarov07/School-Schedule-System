"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useSubjectsManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Subject>>({ Name: '', Description: '' });
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const fetchSubjects = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getSubjects(schoolId);
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setSubjectList([]);
                return;
            }
            setSubjectList(Array.isArray(response) ? response : response ? [response as Subject] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setSubjectList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchSubjects(true), 5000);
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
        if (!formData.id) return;
        try {
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

    const setSelectedEntity = (entity: unknown) => {
        const subject = entity as Subject | null;
        setSelectedSubject(subject);
        if (subject) setFormData({
            ...subject,
            Name: subject.Name || '',
            Description: subject.Description || '',
        });
    };

    return {
        subjectList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedSubject,
        selectedEntity: selectedSubject,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchSubjects(true),
    };
}