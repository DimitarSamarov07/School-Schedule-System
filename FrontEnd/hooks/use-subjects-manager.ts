"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from "@/lib/api/subjects";
import { Subject } from "@/types/subject";

export function useSubjectsManager() {
    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Subject>>({ Name: '', Color: 'purple' });
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const fetchSubjects = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getSubjects();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (response && !response.error) {
                const data = Array.isArray(response) ? response : [response];
                setSubjectList(data);
            } else {
                setSubjectList([]);
            }
        } catch (error) {
            console.warn("Backend 404 - Endpoint not ready:", error);
            setSubjectList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    useEffect(() => {
        const interval = setInterval(() => fetchSubjects(true), 5000);
        return () => clearInterval(interval);
    }, [fetchSubjects]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Color: 'purple'});
        setSelectedSubject(null);
    };

    const handleCreate = async () => {
        try {
            await createSubject(formData.Name!, formData.Color!);
            await fetchSubjects(true);
            closeModal();
        } catch (error) { console.error(error); }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateSubject(formData.id, formData.Name!, formData.Color!);
            await fetchSubjects(true);
            closeModal();
        } catch (error) { console.error(error); }
    };

    const handleDelete = async () => {
        if (!selectedSubject?.id) return;
        try {
            await deleteSubject(selectedSubject.id);
            await fetchSubjects(true);
            closeModal();
        } catch (error) { console.error(error); }
    };

    const openEditModal = (subject: Subject) => {
        setSelectedSubject(subject);
        setFormData(subject);
        setActiveModal('edit');
    };

    const openDeleteModal = (subject: Subject) => {
        setSelectedSubject(subject);
        setActiveModal('delete');
    };

    return {
        subjectList, isLoading, activeModal, formData, selectedSubject,
        setFormData, setActiveModal, handleCreate, handleUpdate, handleDelete,
        closeModal, openEditModal, openDeleteModal
    };
}