import {ColumnConfig, EntityConfig, ManagerProps} from "@/types/entity";

export interface RowProps {
    item: unknown;
    columns: ColumnConfig[];
    manager: ManagerProps;
    config: EntityConfig;
}