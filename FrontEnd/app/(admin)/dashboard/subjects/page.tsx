"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {useSubjectsManager} from "@/hooks/use-subjects-manager";
import SubjectListContainer from "@/components/containers/SubjectListContainer";
import SubjectsLoading from "@/app/(admin)/dashboard/subjects/loading";

export default function GradesPage() {
    const manager = useSubjectsManager();

    return (
            <Suspense fallback={<SubjectsLoading></SubjectsLoading>}>
                <SubjectListContainer manager={manager}/>
            </Suspense>
    );
}