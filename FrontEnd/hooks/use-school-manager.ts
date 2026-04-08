"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCurrentSchool } from "@/providers/SchoolProvider";
import { School } from "@/types/school";
import { createSchool, deleteSchool, getSchools, updateSchool } from "@/lib/api/school";

export function useSchoolsManager() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [schoolsList, setSchoolList] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [formData, setFormData] = useState<Partial<School>>({ Name: '', Address: '', WorkweekConfig: [] });
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const isFetchingRef = useRef(false);

    const fetchSchools = useCallback(async (skipLoadingState = false) => {
        if (!schoolId || isFetchingRef.current) return;
        isFetchingRef.current = true;
        if (!skipLoadingState) setIsLoading(true);
        try {
            const response = await getSchools();
            if (response && typeof response === 'object' && 'error' in (response as object)) {
                setSchoolList([]);
                return;
            }
            setSchoolList(Array.isArray(response) ? response : response ? [response as School] : []);
        } catch (error) {
            console.warn("API Error:", error);
            setSchoolList([]);
        } finally {
            if (!skipLoadingState) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [schoolId]);

    useEffect(() => { fetchSchools(); }, [fetchSchools]);

    useEffect(() => {
        if (!schoolId) return;
        const interval = setInterval(() => fetchSchools(true), 30000);
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
            alert("Failed to create school");
        }
    };

    const handleUpdate = async () => {
        if (!isAdmin) return alert("Unauthorized: Admin access required.");
        if (!formData.Id) return;
        try {
            await updateSchool(schoolId, Number(formData.Id), formData.Name!, formData.Address!, formData.WorkweekConfig!);
            await fetchSchools(true);
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update school");
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
            alert("Failed to delete school");
        }
    };

    const setSelectedEntity = (entity: unknown) => {
        const school = entity as School | null;
        setSelectedSchool(school);
        if (school) setFormData({
            ...school,
            Name: school.Name || '',
            Address: school.Address || '',
            WorkweekConfig: school.WorkweekConfig || [],
        });
    };

    return {
        schoolsList,
        isLoading: isLoading || !schoolId,
        isAdmin,
        activeModal,
        setActiveModal,
        formData,
        setFormData,
        selectedSchool,
        selectedEntity: selectedSchool,
        setSelectedEntity,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
        refresh: () => fetchSchools(true),
    };
}