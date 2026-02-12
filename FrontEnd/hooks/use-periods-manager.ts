"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPeriod, deletePeriod, getPeriodsForSchool, updateTime } from "@/lib/api/times";
import { Time } from "@/types/time";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function usePeriodsManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [timeList, setTimeList] = useState<Time[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Time>>({ Name: '', Start: '', End: '' });
    const [selectedTime, setSelectedTime] = useState<Time | null>(null);

    const fetchTimes = useCallback(async (silent = false) => {
        if (!schoolId) return;

        if (!silent) setIsLoading(true);
        try {
            const response = await getPeriodsForSchool(schoolId);

            if (response && !response.error) {
                const data = Array.isArray(response) ? response : [response];
                setTimeList(data);
            } else {
                setTimeList([]);
            }
        } catch (error) {
            console.warn("API Error:", error);
            setTimeList([]);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchTimes();
    }, [fetchTimes]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchTimes(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchTimes, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Start: '', End: '' });
        setSelectedTime(null);
    };

    const handleCreate = async () => {
        if (!isAdmin || !schoolId) return alert("Unauthorized: Admin access required.");
        try {
            await createPeriod(schoolId, formData.Name!, formData.Start!, formData.End!);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateTime(formData.id, formData.Name, formData.Start, formData.End);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedTime?.id) return;
        try {
            await deletePeriod(selectedTime.id);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openEditModal = (time: Time) => {
        if (!isAdmin) return;
        setSelectedTime(time);
        setFormData(time);
        setActiveModal('edit');
    };

    const openDeleteModal = (time: Time) => {
        if (!isAdmin) return;
        setSelectedTime(time);
        setActiveModal('delete');
    };

    return {
        timeList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        formData,
        selectedTime,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
        refresh: () => fetchTimes(true)
    };
}