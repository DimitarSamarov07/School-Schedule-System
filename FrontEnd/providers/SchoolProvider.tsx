"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const SchoolContext = createContext<any>(null);

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSchool, setCurrentSchool] = useState<any>(null);
    const [accessList, setAccessList] = useState([]);
    const [username, setUsername] = useState([]);
    const [email, setEmail] = useState([]);

    useEffect(() => {
        const token = Cookies.get('AUTH_TOKEN');
        if (token) {
            const decoded: any = jwtDecode(token);
            setAccessList(decoded.accessList);
            setUsername(decoded.username);
            setEmail(decoded.email);

            if (decoded.accessList?.length > 0) {
                setCurrentSchool(decoded.accessList[0]);
            }
        }
    }, []);

    const switchSchool = (id: number) => {
        const school = accessList.find((a: any) => a.SchoolId === id);
        if (school) setCurrentSchool(school);
    };

    return (
        <SchoolContext.Provider value={{ currentSchool,username, email, accessList, switchSchool }}>
    {children}
    </SchoolContext.Provider>
);
};

export const useCurrentSchool = () => useContext(SchoolContext);