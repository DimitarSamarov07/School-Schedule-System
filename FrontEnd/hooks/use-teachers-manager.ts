"use client";

import { useState, useEffect, useCallback } from 'react';
import {getTeachers, createTeacher, updateTeacher, deleteTeacher} from "@/lib/api/teachers";
import {Teacher} from "@/types/teacher";

export function useTeacherManager() {
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Teacher>>({ Name: '', Email: '' });
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const fetchTeachers = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getTeachers(1);
            let data: Teacher[] = [];
            if (response) {
                data = Array.isArray(response) ? response : [response];
            }
            setTeacherList(data);
        } catch (error) {
            console.error("Fetch error:", error);
            if (!silent) setTeacherList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchTeachers(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchTeachers, teacherList]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Email: ''});
        setSelectedTeacher(null);
    };

    const handleCreate = async () => {
        try {

            await createTeacher(1,formData.Name!, formData.Email!);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateTeacher(formData.id, formData.Name!,formData.Email!);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!selectedTeacher?.id) return;
        try {
            await deleteTeacher(selectedTeacher.id);
            await fetchTeachers(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subject");
        }
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData(teacher,);
        setActiveModal('edit');
    };

    const openDeleteModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setActiveModal('delete');
    };

    return {
        teacherList: teacherList,
        isLoading,
        activeModal,
        formData,
        selectedTeacher: selectedTeacher,
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