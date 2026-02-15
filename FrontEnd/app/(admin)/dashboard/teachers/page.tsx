"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {useTeacherManager} from "@/hooks/use-teachers-manager";
import TeacherListContainer from "@/components/containers/TeacherListContainer";
import TeacherLoading from "@/app/(admin)/dashboard/teachers/loading";
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