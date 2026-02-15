"use client";

import React from "react";
import ClassListContainer from "@/components/containers/ClassListContainer";
import {useGradesManager} from "@/hooks/use-grades-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {CLASS_CONFIG} from "@/config/entityConfig";
import {Grade} from "@/types/grade";

export default function GradesPage() {

    const manager = useGradesManager();

    return (
        <EntityListContainer
            manager={manager}
            config={CLASS_CONFIG}
        />
    );
}