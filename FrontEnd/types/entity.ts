import type { Dispatch, SetStateAction } from "react";

export interface ColumnConfig {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (item: unknown) => React.ReactNode;
}

export interface FormFieldConfig {
    key: string;
    label: string;
    type: "text" | "textarea" | string;  
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
  isLoading: boolean;
  activeModal?: string | null;

  setActiveModal?: Dispatch<SetStateAction<string | null>>;
  closeModal?: () => void;

  openEditModal?: (item: unknown) => void;
  openDeleteModal?: (item: unknown) => void;

  handleCreate?: (...args: unknown[]) => void | Promise<void>;
  handleUpdate?: (...args: unknown[]) => void | Promise<void>;
  handleDelete?: (...args: unknown[]) => void | Promise<void>;

  formData?: Record<string, unknown>;
  setFormData?: Dispatch<SetStateAction<Record<string, unknown>>> | ((data: Record<string, unknown>) => void);

  isAdmin?: boolean;

  [key: string]: unknown;
}
