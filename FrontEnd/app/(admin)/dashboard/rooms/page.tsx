"use client";

import React from "react";
import {useRoomsManager} from "@/hooks/use-rooms-manager";
import EntityListContainer from "@/components/entity/EntityListContainer";
import {ROOM_CONFIG} from "@/config/entityConfig";

export default function RoomsPage() {
    const manager = useRoomsManager();

    return (
        <EntityListContainer
            manager={manager}
            config={ROOM_CONFIG}
        />
    );
}