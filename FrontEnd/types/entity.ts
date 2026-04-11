import type { Dispatch, SetStateAction } from "react";

export interface ColumnConfig {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (item: unknown) => React.ReactNode;
}

// @/types/entity.ts
export type FormFieldConfig = {
    key: string;
    label: string;
    type: "text" | "textarea" | "timepicker" | "daypicker" | "dropdown";
    placeholder?: string;
    // dropdown-specific
    optionsKey?: string;   // key on the manager object, e.g. "roomList"
    labelKey?: string;     // field to display, e.g. "Name"
    valueKey?: string;     // field used as value, e.g. "id"
};

export interface EntityConfig {
    title: string;
    singular: string;
    listKey: string;
    itemNameKey: string;
    searchKeys: string[];
    columns: ColumnConfig[];
    formFields: FormFieldConfig[];
}

export interface ManagerProps<TModal = string> {
    isLoading: boolean;
    activeModal?: TModal | null;
    setActiveModal?: Dispatch<SetStateAction<TModal | null>>;
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
