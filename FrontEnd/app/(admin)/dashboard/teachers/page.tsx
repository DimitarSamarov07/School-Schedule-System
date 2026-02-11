"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {useTeacherManager} from "@/hooks/use-teachers-manager";
import TeacherListContainer from "@/components/containers/TeacherListContainer";
import TeacherLoading from "@/app/(admin)/dashboard/teachers/loading";

export default function TeachersPage() {
    const manager = useTeacherManager();

    return (
            <Suspense fallback={<TeacherLoading></TeacherLoading>}>
                <TeacherListContainer manager={manager}/>
            </Suspense>
    );
}