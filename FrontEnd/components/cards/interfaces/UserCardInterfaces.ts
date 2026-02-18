import {User} from "@/types/schoolUser";

export interface UserCardProps {
    user: User;
    onPromote: (userId: number) => void;
    onDemote: (userId: number) => void;
}
