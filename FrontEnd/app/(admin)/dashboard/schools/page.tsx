"use client";

import React from "react";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {SCHOOL_CONFIG} from "@/config/entityConfig";
import {useSchoolsManager} from "@/hooks/use-school-manager";

export default function SubjectsPage() {
    const manager = useSchoolsManager();
    return (
        <EntityListContainer
            manager={manager}
            config={SCHOOL_CONFIG}
        />
    );
}