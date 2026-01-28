"use client";

import { useState, useEffect, useCallback } from 'react';
import {getDates, createDate, deleteDate, updateDate} from "@/lib/api/dates";
import {Date} from "@/types/date";

export function useDatesManager() {
    const [dateList, setDateList] = useState<Date[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Date>>({ Date: '', IsHoliday: false });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const fetchDates = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getDates();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (response && !response.error) {
                const data = Array.isArray(response) ? response : [response];
                setDateList(data);
            } else {
                setDateList([]);
            }
        } catch (error) {
            console.warn("Backend 404 - Endpoint not ready:", error);
            setDateList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDates();
    }, [fetchDates]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDates(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchDates, dateList]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Date: '', IsHoliday: undefined});
        setSelectedDate(null);
    };

    const handleCreate = async (manualDate: string, manualIsHoliday: boolean) => {
        const dateToUse = manualDate ?? formData.Date;
        const holidayToUse = manualIsHoliday ?? formData.IsHoliday;

        try {
            await createDate(dateToUse, holidayToUse);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create date");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!formData.id) return;
            await updateDate(formData.id, formData.Date, formData.IsHoliday);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update date");
        }
    };

    const handleDelete = async () => {
        if (!selectedDate?.id) return;
        try {
            await deleteDate(selectedDate.id);
            await fetchDates(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subject");
        }
    };

    const openEditModal = (date: Date) => {
        setSelectedDate(date);
        setFormData(date);
        setActiveModal('edit');
    };

    const openDeleteModal = (date: Date) => {
        setSelectedDate(date);
        setActiveModal('delete');
    };

    return {
        dateList: dateList,
        isLoading,
        activeModal,
        formData,
        selectedDate: selectedDate,
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