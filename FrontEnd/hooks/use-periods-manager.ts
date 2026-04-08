"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPeriod, deletePeriod, getPeriodsForSchool, updateTime } from "@/lib/api/periods";
import { Time } from "@/types/time";
import { useCurrentSchool } from "@/providers/SchoolProvider";
// ── Helper ────────────────────────────────────────────────────────────────────
/** Ensures a time string is always HH:MM:SS.
 *  "08:30"       → "08:30:00"
 *  "08:30:00"    → "08:30:00"  (already correct, unchanged)
 *  "08:30:45"    → "08:30:45"  (seconds preserved if user typed them)
 */
const toHHMMSS = (t: string) => {
    if (!t) return t;
    const parts = t.split(':');
    if (parts.length === 2) return `${t}:00`;
    return t;
};

export function usePeriodsManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [timeList, setTimeList] = useState<Time[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<Time>>({ Name: '', Start: '', End: '' });
    const [selectedTime, setSelectedTime] = useState<Time | null>(null);

    const fetchTimes = useCallback(async (skipLoadingState = false) => {
        if (!schoolId) return;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getPeriodsForSchool(schoolId);
            if (response && typeof response === 'object' && 'error' in response) {
                setTimeList([]);
                return;
            }
            const trimSeconds = (t: string) => t?.slice(0, 5) ?? '';
            const raw = Array.isArray(response) ? response as Time[] : response ? [response as Time] : [];
            setTimeList(raw.map(time => ({
                ...time,
                Start: trimSeconds(time.Start),
                End: trimSeconds(time.End),
            })));
        } catch (error) {
            console.warn("API Error:", error);
            setTimeList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { fetchTimes(); }, [fetchTimes]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchTimes(true), 5000);
        return () => clearInterval(interval);
    }, [fetchTimes, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Start: '', End: '' });
        setSelectedTime(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            console.log("Creating time:", formData);
            await createPeriod(
                schoolId,
                formData.Name!,
                toHHMMSS(formData.Start!),  // ← was formData.Start!
                toHHMMSS(formData.End!),    // ← was formData.End!

            );
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!formData.id) return;
        try {
            await updateTime(
                schoolId,
                Number(formData.id),
                formData.Name!,
                toHHMMSS(formData.Start!),  // ← was formData.Start!
                toHHMMSS(formData.End!),    // ← was formData.End!
            );
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
            await deletePeriod(Number(selectedTime.id), schoolId);
            await fetchTimes(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const setSelectedEntity = (entity: unknown) => {
        const time = entity as Time | null;
        setSelectedTime(time);
        if (time) setFormData({ ...time, Name: time.Name || '', Start: time.Start || '', End: time.End || '' });
    };

    return {
        timeList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedTime,
        selectedEntity: selectedTime,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchTimes(true),
    };
}