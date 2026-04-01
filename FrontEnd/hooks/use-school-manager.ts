"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCurrentSchool } from "@/providers/SchoolProvider";
import {School} from "@/types/school";
import {createSchool, deleteSchool, getSchools, updateSchool} from "@/lib/api/school";
import {formatWorkweek} from "@/lib/utils";

//Name address, work week config
export function useSchoolsManager() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;

    const [schoolsList, setSchoolList] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<School>>({ Name: '', Address: '', WorkweekConfig: [] });
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const isFetchingRef = useRef(false);

    const fetchSchools = useCallback(async (skipLoadingState = false) => {
        if (!schoolId || isFetchingRef.current) return;

        const shouldToggleLoading = !skipLoadingState;
        isFetchingRef.current = true;

        const clearSchools = () => setSchoolList([]);

        const normalizeSchools = (value: unknown): School[] => {
            if (Array.isArray(value)) return value as School[];
            return value ? [value as School] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getSchools();

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearSchools();
                return;
            }
            setSchoolList(normalizeSchools(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearSchools();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [schoolId]);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    useEffect(() => {
        if (!schoolId) return;

        const interval = setInterval(() => {
            fetchSchools(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchSchools, schoolId]);

    const closeModal = () => {
        setActiveModal(null);
        setFormData({ Name: '', Address: '', WorkweekConfig: [] });
        setSelectedSchool(null);
    };

    const handleCreate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            await createSchool(formData.Name!, formData.Address!, formData.WorkweekConfig!);
            await fetchSchools(true);
            closeModal();
        } catch (error) {
            console.error("Create error:", error);
            alert("Failed to create room");
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        try {
            if (!formData.Id) return;
            await updateSchool(schoolId, Number(formData.Id), formData.Name!, formData.Address!, formData.WorkweekConfig!);
            await fetchSchools(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update room");
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!selectedSchool?.Id) return;
        try {
            await deleteSchool(Number(selectedSchool.Id), schoolId);
            await fetchSchools(true);
            closeModal();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete room");
        }
    };

    const openEditModal = (school: School) => {
        if (!isAdmin) return;
        setSelectedSchool(school);
        setFormData({
            ...school,
            Name: school.Name || '',
            Address: school.Address || '',
            WorkweekConfig: school.WorkweekConfig || []
        });
        setActiveModal('edit');
    };

    const openDeleteModal = (school: School) => {
        if (!isAdmin) return;
        setSelectedSchool(school);
        setActiveModal('delete');
    };

    return {
        schoolsList,
        isLoading: isLoading || !schoolId, // Loading if API working OR school context missing
        isAdmin,
        activeModal,
        formData,
        selectedSchool,
        setFormData,
        setActiveModal,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        openEditModal,
        openDeleteModal,
        refresh: () => fetchSchools(true)
    };
}
