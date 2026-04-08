"use client";

import { useState, useEffect, useCallback } from 'react';
import { getHoliday, createDate, deleteDate, updateDate } from "@/lib/api/dates";
import { Holiday } from "@/types/holiday";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function useDatesManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [dateList, setDateList] = useState<Holiday[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Holiday>>({ Name: '', Start: '', End: '' });
    const [selectedDate, setSelectedDate] = useState<Holiday | null>(null);

    const fetchDates = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getHoliday(schoolId);
            if (response && typeof response === 'object' && 'error' in response) {
                setDateList([]);
                return;
            }
            setDateList(Array.isArray(response) ? response : response ? [response as Holiday] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setDateList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { fetchDates(); }, [fetchDates]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchDates(true), 5000);
        return () => clearInterval(interval);
    }, [fetchDates, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Start: '', End: '' });
        setSelectedDate(null);
    };

    // Params are optional — EntityModals calls handleCreate() with no args,
    // falling back to formData.Start / formData.End in that case.
    const handleCreate = async (start?: string, end?: string) => {
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
        if (!formData.id) return;
        try {
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

    const setSelectedEntity = (entity: unknown) => {
        const date = entity as Holiday | null;
        setSelectedDate(date);
        if (date) setFormData({
            ...date,
            Name: date.Name || '',
            Start: date.Start || '',
            End: date.End || '',
        });
    };

    return {
        dateList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedDate,
        selectedEntity: selectedDate,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchDates(true),
    };
}