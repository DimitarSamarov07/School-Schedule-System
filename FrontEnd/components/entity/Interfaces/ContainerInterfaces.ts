import {ManagerProps, EntityConfig} from "@/types/entity";


export interface ContainerProps<TModal = string> {
    manager: ManagerProps<TModal>;
    config: EntityConfig;
}