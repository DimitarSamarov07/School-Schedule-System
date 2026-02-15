"use client";

import React from "react";
import {useGradesManager} from "@/hooks/use-grades-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {CLASS_CONFIG} from "@/config/entityConfig";

export default function GradesPage() {

    const manager = useGradesManager();

    return (
        <EntityListContainer
            manager={manager}
            config={CLASS_CONFIG}
        />
    );
}