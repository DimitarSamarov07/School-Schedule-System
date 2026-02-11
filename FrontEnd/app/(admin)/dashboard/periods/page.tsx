"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {usePeriodsManager} from "@/hooks/use-periods-manager";
import PeriodListContainer from "@/components/containers/PeriodListContainer";

export default function TimesPage() {
    const manager = usePeriodsManager();

    return (


            <Suspense fallback={<p>Loading...</p>}>
                <PeriodListContainer manager={manager}/>
            </Suspense>
    );
}