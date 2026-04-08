"use client";

import React from "react";
import { EntityModalsProps } from "@/components/entity/Interfaces/ModalInterfaces";
import type { EntityConfig, FormFieldConfig } from "@/types/entity";
import { DayPicker } from "@/components/DayPicker";
import { ClockTimePicker } from "@/components/TimePicker";

type EntityLike = Record<string, unknown>;

function getEntityName(entity: unknown, config: EntityConfig): string | undefined {
    if (!entity || typeof entity !== "object") return undefined;
    const obj = entity as EntityLike;
    const v = obj[config.itemNameKey];
    return typeof v === "string" ? v : undefined;
}

export function EntityModals<T>({ manager, config }: EntityModalsProps) {
    const {
        activeModal,
        formData,
        setFormData,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
    } = manager;

    const selectedEntity =
        (manager as EntityLike).selectedEntity ??
        (manager as EntityLike).selectedGrade ??
        (manager as EntityLike).selectedDate ??
        null;

    const safeFormData: EntityLike = (
        formData && typeof formData === "object" ? (formData as EntityLike) : {}
    ) as EntityLike;

    // ── Grouped timepicker state ────────────────────────────────────────────
    const timePickerFields = React.useMemo(
        () => config.formFields.filter((f) => f.type === "timepicker"),
        [config.formFields],
    );
    const firstTimePickerKey = timePickerFields[0]?.key ?? null;
    const [activeTimeKey, setActiveTimeKey] = React.useState<string | null>(null);
    const currentTimeKey = activeTimeKey ?? firstTimePickerKey;

    React.useEffect(() => {
        setActiveTimeKey(firstTimePickerKey);
    }, [activeModal, firstTimePickerKey]);
    // ────────────────────────────────────────────────────────────────────────

    const updateField = (key: string, value: unknown) => {
        setFormData?.({ ...(safeFormData as Record<string, unknown>), [key]: value });
    };

    const renderFormField = (field: FormFieldConfig, index: number) => {
        // ─── Clock time picker (grouped) ────────────────────────────────────
        if (field.type === "timepicker") {
            if (field.key !== firstTimePickerKey) return null;

            const raw = safeFormData[currentTimeKey!];
            const timeValue = typeof raw === "string" && raw ? raw : "08:00:00";

            return (
                <div key={index} className="space-y-2">
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
                        {timePickerFields.map((tf) => (
                            <button
                                key={tf.key}
                                type="button"
                                onClick={() => setActiveTimeKey(tf.key)}
                                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                                    currentTimeKey === tf.key
                                        ? "bg-white text-[#7C5CFC] shadow"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-center bg-purple-50 rounded-2xl p-4 border border-purple-100">
                        <ClockTimePicker
                            value={timeValue}
                            onChange={(val) => updateField(currentTimeKey!, val)}
                        />
                    </div>
                </div>
            );
        }

        // ─── Day picker ─────────────────────────────────────────────────────
        if (field.type === "daypicker") {
            const raw = safeFormData[field.key];
            const days = Array.isArray(raw) ? (raw as number[]) : [];
            return (
                <div key={index} className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
                        {field.label}
                    </label>
                    <DayPicker
                        value={days}
                        onChange={(newDays) => updateField(field.key, newDays)}
                    />
                </div>
            );
        }

        // ─── Dropdown ───────────────────────────────────────────────────────
        if (field.type === "dropdown") {
            const options = ((manager as EntityLike)[field.optionsKey!] as EntityLike[]) ?? [];
            const labelKey = field.labelKey ?? "Name";
            const valueKey = field.valueKey ?? "id";

            // formData[field.key] is the full object (e.g. the Room object)
            const currentValue = (safeFormData[field.key] as EntityLike)?.[valueKey] ?? "";

            return (
                <div key={index} className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
                        {field.label}
                    </label>
                    <select
                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold appearance-none cursor-pointer"
                        value={currentValue as string | number}
                        onChange={(e) => {
                            const selected = options.find(
                                (o) => String(o[valueKey]) === e.target.value
                            );
                            updateField(field.key, selected ?? null);
                        }}
                    >
                        <option value="" disabled>
                            {field.placeholder ?? `Избери ${field.label.toLowerCase()}`}
                        </option>
                        {options.map((option) => (
                            <option
                                key={String(option[valueKey])}
                                value={String(option[valueKey])}
                            >
                                {String(option[labelKey] ?? "")}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        // ─── Text / Textarea ────────────────────────────────────────────────
        const raw = safeFormData[field.key];
        const value = typeof raw === "string" ? raw : "";

        return (
            <div key={index} className="space-y-2">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">
                    {field.label}
                </label>
                {field.type === "textarea" ? (
                    <textarea
                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold resize-vertical min-h-[100px]"
                        value={value}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                    />
                ) : (
                    <input
                        className="w-full border-2 border-gray-100 bg-[#F9FBFF] rounded-2xl px-5 py-4 outline-none focus:border-[#7C5CFC] focus:bg-white transition-all text-lg font-semibold"
                        value={value}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                    />
                )}
            </div>
        );
    };

    const name = getEntityName(selectedEntity, config);

    const modalTitle =
        activeModal === "add"
            ? `Добави нов ${config.singular}`
            : activeModal === "edit"
                ? `Редакция: ${name ?? ""}`
                : "Изтриване";

    if (!activeModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-black text-gray-900 mb-8">{modalTitle}</h3>

                {activeModal === "delete" ? (
                    <DeleteModalContent
                        entityName={name}
                        onDelete={() => handleDelete?.()}
                        onCancel={() => closeModal?.()}
                    />
                ) : (
                    <AddEditModalContent
                        config={config}
                        activeModal={activeModal}
                        onSave={() => (activeModal === "add" ? handleCreate?.() : handleUpdate?.())}
                        onCancel={() => closeModal?.()}
                        renderField={renderFormField}
                    />
                )}
            </div>
        </div>
    );
}

function DeleteModalContent({
                                entityName,
                                onDelete,
                                onCancel,
                            }: {
    entityName?: string;
    onDelete: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="space-y-8">
            <p className="text-gray-600 text-lg leading-relaxed">
                Сигурни ли сте че искате да изтриете{" "}
                <span className="font-bold text-black border-b-2 border-red-200">{entityName}</span>?
            </p>
            <div className="flex gap-4">
                <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-4 text-gray-500 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                    Отказ
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 px-6 py-4 bg-[#E74C3C] text-white rounded-2xl font-extrabold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                >
                    Изтрий
                </button>
            </div>
        </div>
    );
}

function AddEditModalContent({
                                 config,
                                 activeModal,
                                 onSave,
                                 onCancel,
                                 renderField,
                             }: {
    config: EntityConfig;
    activeModal: string;
    onSave: () => void;
    onCancel: () => void;
    renderField: (field: FormFieldConfig, index: number) => React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            {config.formFields.map(renderField)}
            <div className="pt-6 flex flex-col gap-4">
                <button
                    onClick={onSave}
                    className="w-full bg-[#7C5CFC] text-white py-4.5 rounded-2xl font-black text-xl shadow-xl shadow-purple-100 hover:translate-y-[-2px] transition-all"
                >
                    {activeModal === "add" ? "СЪЗДАЙ" : "ЗАПАЗИ"}
                </button>
                <button
                    onClick={onCancel}
                    className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors"
                >
                    Отказ
                </button>
            </div>
        </div>
    );
}