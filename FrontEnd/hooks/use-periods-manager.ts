"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPeriod, deletePeriod, updateTime} from "@/lib/api/times";
import {Time} from "@/types/time";

export function usePeriodsManager() {
    const [timeList, setTimeList] = useState<Time[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Time>>({ Start: '', End: '' });
    const [selectedTime, setSelectedTime] = useState<Time | null>(null);

    const fetchTimes = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        // @ts-ignore
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (response && !response.error) {
                const data = Array.isArray(response) ? response : [response];
                setTimeList(data);
            } else {
                setTimeList([]);
            }
        } catch (error) {
            console.warn("Backend 404 - Endpoint not ready:", error);
            setTimeList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTimes();
    }, [fetchTimes]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchTimes(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchTimes, timeList]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Start: '', End: ''});
        setSelectedTime(null);
    };

    const handleCreate = async () => {
        try {
            await createPeriod(formData.Start!, formData.End!);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create time");
        }
    };

    const handleUptime = async () => {
        try {
            if (!formData.id) return;
            await updateTime(formData.id, formData.Start, formData.End);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Uptime error:", error);
            alert("Failed to uptime time");
        }
    };

    const handleDelete = async () => {
        if (!selectedTime?.id) return;
        try {
            await deletePeriod(selectedTime.id);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subject");
        }
    };

    const openEditModal = (time: Time) => {
        setSelectedTime(time);
        setFormData(time);
        setActiveModal('edit');
    };

    const openDeleteModal = (time: Time) => {
        setSelectedTime(time);
        setActiveModal('delete');
    };

    return {
        timeList: timeList,
        isLoading,
        activeModal,
        formData,
        selectedTime: selectedTime,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUptime,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
        refresh: () => fetchTimes(true)
    };
}