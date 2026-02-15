"use client";

import React from "react";
import {useTeacherManager} from "@/hooks/use-teachers-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {TEACHER_CONFIG} from "@/config/entityConfig";

export default function TeachersPage() {
    const manager = useTeacherManager();

    return (
        <EntityListContainer
            manager={manager}
            config={TEACHER_CONFIG}
        />
    );
}