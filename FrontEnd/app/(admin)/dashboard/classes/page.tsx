"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import ClassListContainer from "@/components/containers/ClassListContainer";
import {useGradesManager} from "@/hooks/use-grades-manager";
import GradesLoading from "@/app/(admin)/dashboard/classes/loading";

export default function GradesPage() {
    const manager = useGradesManager();

    return (
            <Suspense fallback={<GradesLoading></GradesLoading>}>
                <ClassListContainer manager={manager}/>
            </Suspense>
    );
}