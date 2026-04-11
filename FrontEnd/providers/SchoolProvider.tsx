"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getSchools } from "@/lib/api/school"; // Ensure this import is correct
import { School } from "@/types/school";

const SchoolContext = createContext<any>(null);
const STORAGE_KEY = 'SUDO_SELECTED_SCHOOL_ID';

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Core State (Fast, from token)
    const [accessList, setAccessList] = useState<any[]>([]);
    const [currentSchoolId, setCurrentSchoolId] = useState<number | null>(null);
    const [userData, setUserData] = useState({ username: '', email: '', isSudo: false });
    const [isLoading, setIsLoading] = useState(true);

    // 2. Hydration State (Slow, from API)
    const [fullSchools, setFullSchools] = useState<School[]>([]);

    // --- PHASE 1: Instant Load from Cookie ---
    useEffect(() => {
        const token = Cookies.get('AUTH_TOKEN');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const list = decoded.accessList || [];
                const sudoStatus = !!decoded.isSudo;

                setUserData({
                    username: decoded.username || '',
                    email: decoded.email || '',
                    isSudo: sudoStatus
                });
                setAccessList(list);

                const savedId = localStorage.getItem(STORAGE_KEY);
                let activeId = null;

                if (sudoStatus && savedId) {
                    // Verify saved ID exists in their access list
                    const isValid = list.some((s: any) => Number(s.SchoolId) === Number(savedId));
                    if (isValid) activeId = Number(savedId);
                }

                if (!activeId && list.length > 0) activeId = Number(list[0].SchoolId);

                setCurrentSchoolId(activeId);
            } catch (err) {
                console.error("Token decode error:", err);
            }
        }

        // UNBLOCK THE APP IMMEDIATELY
        setIsLoading(false);
    }, []);

    // --- PHASE 2: Background Hydration ---
    // This runs strictly AFTER the app has already loaded
    useEffect(() => {
        if (isLoading || accessList.length === 0) return;

        const fetchNames = async () => {
            try {
                const data = await getSchools();
                if (Array.isArray(data)) {
                    setFullSchools(data);
                }
            } catch (err) {
                console.warn("Could not fetch school names for dropdown:", err);
            }
        };

        fetchNames();
    }, [isLoading, accessList.length]);

    // --- PHASE 3: Merge the Data ---
    // This safely combines the reliable IDs from the token with the pretty names from the API
    const hydratedAccessList = useMemo(() => {
        return accessList.map(tokenSchool => {
            const fullSchoolDetails = fullSchools.find(s => Number(s.Id) === Number(tokenSchool.SchoolId));
            // If we found the full details, merge them but keep SchoolId consistent
            return fullSchoolDetails
                ? { ...fullSchoolDetails, SchoolId: fullSchoolDetails.Id }
                : tokenSchool;
        });
    }, [accessList, fullSchools]);

    const currentSchool = useMemo(() => {
        if (!currentSchoolId) return null;
        return hydratedAccessList.find(s => Number(s.SchoolId) === currentSchoolId) || null;
    }, [currentSchoolId, hydratedAccessList]);

    const switchSchool = (id: number) => {
        setCurrentSchoolId(Number(id));
        if (userData.isSudo) {
            localStorage.setItem(STORAGE_KEY, id.toString());
        }
    };

    return (
        <SchoolContext.Provider value={{
            currentSchool,
            ...userData,
            accessList: hydratedAccessList, // Pass the merged list to the app
            switchSchool,
            isLoading
        }}>
            {!isLoading && children}
        </SchoolContext.Provider>
    );
};

export const useCurrentSchool = () => useContext(SchoolContext);