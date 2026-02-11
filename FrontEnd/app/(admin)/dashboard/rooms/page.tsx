"use client";

import React, {Suspense} from "react";
import {Plus} from "lucide-react";
import {useRoomsManager} from "@/hooks/use-rooms-manager";
import RoomListContainer from "@/components/containers/RoomListContainer";
import RoomsLoading from "@/app/(admin)/dashboard/rooms/loading";

export default function RoomsPage() {
    const manager = useRoomsManager();

    return (
            <Suspense fallback={<RoomsLoading></RoomsLoading>}>
                <RoomListContainer manager={manager}/>
            </Suspense>
    );
}