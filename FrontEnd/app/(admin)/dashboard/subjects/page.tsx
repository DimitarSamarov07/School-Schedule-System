"use client";

import React from "react";
import {useSubjectsManager} from "@/hooks/use-subjects-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {SUBJECT_CONFIG} from "@/config/entityConfig";

export default function SubjectsPage() {
    const manager = useSubjectsManager();

    return (
        <EntityListContainer
            manager={manager}
            config={SUBJECT_CONFIG}
        />
    );
}