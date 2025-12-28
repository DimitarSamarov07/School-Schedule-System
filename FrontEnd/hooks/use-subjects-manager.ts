"use client";

import { useState, useEffect, useCallback } from 'react';
import {getSubject, createSubject, updateSubject, deleteSubject} from "@/lib/api/subjects";
import { Subject } from "@/types/subject";

export function useSubjectsManager() {
    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Subject>>({ Name: '', Color: '' });
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const fetchSubjects = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getSubject();
            let data: Subject[] = [];
            if (response) {
                data = Array.isArray(response) ? response : [response];
            }
            setSubjectList(data);
        } catch (error) {
            console.error("Fetch error:", error);
            if (!silent) setSubjectList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSubjects(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchSubjects, subjectList]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Color: ''});
        setSelectedSubject(null);
    };

    const handleCreate = async () => {
        try {
            await createSubject(formData.Name!, formData.Color!);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateSubject(formData.id, formData.Name, formData.Color);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!selectedSubject?.id) return;
        try {
            await deleteSubject(selectedSubject.id);
            await fetchSubjects(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subject");
        }
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
        subjectList: subjectList,
        isLoading,
        activeModal,
        formData,
        selectedSubject: selectedSubject,
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