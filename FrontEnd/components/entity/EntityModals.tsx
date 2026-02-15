// components/EntityModals.tsx
"use client";
import React from "react";

interface EntityModalsProps<T> {
    manager: any;
    config: {
        singular: string;
        formFields: FormFieldConfig[];
    };
}

interface FormFieldConfig {
    key: string;
    label: string;
    type: "text" | "textarea";
    placeholder?: string;
}

export function EntityModals<T>({ manager, config }: EntityModalsProps<T>) {
    const {
        activeModal,
        selectedGrade: selectedEntity,
        formData,
        setFormData,
        handleCreate,
        handleUpdate,
        handleDelete,
        closeModal,
    } = manager as any;

    const updateField = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const renderFormField = (field: FormFieldConfig, index: number) => {
        const value = formData[field.key as keyof typeof formData] || "";

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

    const modalTitle = activeModal === "add"
        ? `Добави нов ${config.singular}`
        : activeModal === "edit"
            ? `Редакция: ${(selectedEntity as any)?.Name}`
            : "Изтриване";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-black text-gray-900 mb-8">{modalTitle}</h3>

                {activeModal === "delete" ? (
                    <DeleteModalContent
                        entityName={(selectedEntity as any)?.Name}
                        onDelete={handleDelete}
                        onCancel={closeModal}
                    />
                ) : (
                    <AddEditModalContent
                        config={config}
                        formData={formData}
                        activeModal={activeModal}
                        onSave={activeModal === "add" ? handleCreate : handleUpdate}
                        onCancel={closeModal}
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
                <span className="font-bold text-black border-b-2 border-red-200">
          {entityName}
        </span>
                ?
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
                                 formData,
                                 activeModal,
                                 onSave,
                                 onCancel,
                                 renderField,
                             }: {
    config: any;
    formData: any;
    activeModal: string;
    onSave: () => void;
    onCancel: () => void;
    renderField: (field: any, index: number) => React.ReactNode;
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
