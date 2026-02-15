"use client";

import React from "react";
import {usePeriodsManager} from "@/hooks/use-periods-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {PERIOD_CONFIG} from "@/config/entityConfig";

export default function TimesPage() {
    const manager = usePeriodsManager();

    return (
        <EntityListContainer
            manager={manager}
            config={PERIOD_CONFIG}
        />
    );
}