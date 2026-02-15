"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { EntityHeader } from "./EntityHeader";
import { EntitySearch } from "./EntitySearch";
import { EntityTable } from "./EntityTable";
import { EntityModals } from "./EntityModals";
import {ContainerProps} from "@/components/entity/Interfaces/ContainerInterfaces";



export default function EntityListContainer({ manager, config }: ContainerProps) {
  const rawList = manager[config.listKey];

  const list: unknown[] = Array.isArray(rawList)
    ? rawList
    : rawList
      ? [rawList]
      : [];

  const isLoading = manager.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#7C5CFC] w-10 h-10 mb-4" />
        <p className="text-gray-500 animate-pulse font-medium">
          Зареждане на {config.title.toLowerCase()}...
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white rounded-2xl font-sans overflow-hidden">
      <EntityHeader manager={manager} config={config} />
      <EntitySearch />
      <EntityTable list={list} manager={manager} config={config} />
      {manager.activeModal && <EntityModals manager={manager} config={config} />}
    </div>
  );
}
