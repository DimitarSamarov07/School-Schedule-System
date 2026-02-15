export interface ColumnConfig {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (item: unknown) => React.ReactNode;
}

export interface FormFieldConfig {
    key: string;
    label: string;
    type: "text" | "textarea" | string;  // ✅ Loose union
    placeholder?: string;
}

export interface EntityConfig {
    title: string;
    singular: string;
    listKey: string;
    itemNameKey: string;
    columns: ColumnConfig[];
    formFields: FormFieldConfig[];
}

export interface ManagerProps {
    [key: string]: any;
    isLoading: boolean;
    activeModal?: string | null;
    setActiveModal?: (modal: string | null) => void;
    closeModal?: () => void;
    openEditModal?: (item: any) => void;
    openDeleteModal?: (item: any) => void;
    handleCreate?: () => void;
    handleUpdate?: () => void;
    handleDelete?: () => void;
    formData?: any;
    setFormData?: (data: any) => void;
    isAdmin?: boolean;
}
