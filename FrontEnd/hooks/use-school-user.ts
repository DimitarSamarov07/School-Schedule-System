"use client"

import {useState, useEffect, useCallback, useRef} from "react";


import {useCurrentSchool} from "@/providers/SchoolProvider";
import {SchoolUser} from "@/types/schoolUser";
import {getAllSchoolUsers} from "@/lib/api/schoolUser";

export function useSchoolUser() {
    const { currentSchool } = useCurrentSchool();
    const schoolId = currentSchool?.SchoolId;
    const isAdmin = currentSchool?.IsAdmin === 1;
    const [schoolUsersList, setSchoolUsersList] = useState<SchoolUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSchoolUser, setselectedSchoolUser] = useState<SchoolUser | null>(null);
    const isFetchingRef = useRef(false);

    const fetchSchoolUsers = useCallback(async (skipLoadingState = false) => {
        if (!schoolId || isFetchingRef.current) return;

        const shouldToggleLoading = !skipLoadingState;
        isFetchingRef.current = true;

        const clearRooms = () => setSchoolUsersList([]);

        const normalizeSchoolUsers = (value: unknown): SchoolUser[] => {
            if (Array.isArray(value)) return value as SchoolUser[];
            return value ? [value as SchoolUser] : [];
        };

        if (shouldToggleLoading) setIsLoading(true);

        try {
            const response = await getAllSchoolUsers(schoolId);

            if (response && typeof response === 'object' && 'error' in (response as object)) {
                clearRooms();
                return;
            }

            setSchoolUsersList(normalizeSchoolUsers(response));
        } catch (error) {
            console.warn("API Error:", error);
            clearRooms();
        } finally {
            if (shouldToggleLoading) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [schoolId]);
}
