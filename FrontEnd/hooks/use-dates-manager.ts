"use client";

import { useState, useEffect, useCallback } from 'react';
import { getHoliday, createDate, deleteDate, updateDate } from "@/lib/api/dates";
import { Holiday} from "@/types/holiday";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useDatesManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [dateList, setDateList] = useState<Holiday[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Holiday>>({ Name: '', Start: '', End: '' });
    const [selectedDate, setSelectedDate] = useState<Holiday | null>(null);

    const fetchDates = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;

        const shouldToggleLoading = !skipLoadingState;

        const clearDates = () => setDateList([]);

        const normalizeDates = (value: unknown): Holiday[] => {
            if (Array.isArray(value)) return value as Holiday[];
            return value ? [value as Holiday] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getHoliday(schoolId);

            if (response && typeof response === 'object' && 'error' in response) {
                clearDates();
                return;
            }

            setDateList(normalizeDates(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearDates();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        fetchDates();
    }, [fetchDates]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchDates(true);
        }, 5000); // Standardized to 5s

        return () => clearInterval(interval);
    }, [fetchDates, schoolId]); // Fixed dependency

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Start: '', End: '' });
        setSelectedDate(null);
    };

    const handleCreate = async (start: string, end:string) => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");

        const Start = start ?? formData.Start;
        const End = end ?? formData.End;

        try {
            await createDate(schoolId, "Holiday", Start!, End!);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create date");
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.id) return;
            await updateDate(schoolId, Number(formData.id), formData.Name!, formData.Start!, formData.End!);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update date");
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedDate?.id) return;
        try {
            await deleteDate(Number(selectedDate.id), schoolId);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete date");
        }
    };

    const openEditModal = (date: Holiday) => {
        if (!isAdmin) return;
        setSelectedDate(date as Holiday);
        setFormData({
            ...date,
            Name: date.Name || '',
            Start: date.Start || '',
            End: date.End || ''
        });
        setActiveModal('edit');
    };

    const openDeleteModal = (holiday: Holiday) => {
        if (!isAdmin) return;
        setSelectedDate(holiday);
        setActiveModal('delete');
    };

    return {
        dateList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        formData,
        selectedDate,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
        refresh: () => fetchDates(true)
    };
}
