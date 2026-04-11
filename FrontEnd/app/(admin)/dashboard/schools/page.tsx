"use client";

import React from "react";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {SCHOOL_CONFIG} from "@/config/entityConfig";
import {useSchoolsManager} from "@/hooks/use-school-manager";
import {SchoolSwitcher} from "@/components/admin/SchoolSwitcher";

export default function SubjectsPage() {
    const manager = useSchoolsManager();
    return (
        <>
            <SchoolSwitcher></SchoolSwitcher>
        <EntityListContainer
            manager={manager}
            config={SCHOOL_CONFIG}
        />
            </>
    );
}