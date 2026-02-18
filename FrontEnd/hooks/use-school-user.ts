import { useState, useEffect, useCallback } from "react";
import { getAllSchoolUsers, demoteUser, promoteUser } from "@/lib/api/schoolUser";
import { User, ApiUser } from "@/types/schoolUser";

export const useSchoolUser = (schoolId: number) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllSchoolUsers(schoolId);

                const transformedUsers: User[] = data.map((user: ApiUser) => ({
                    id: user.Id,
                    name: user.Username,
                    email: user.Email,
                    isAdmin: user.IsAdmin === 1,
                    status: user.IsAdmin === 1 ? 'Администратор' : 'Активна'
                }));

                setUsers(transformedUsers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        if (schoolId) {
            fetchUsers();
        }
    }, [schoolId]);

    const handlePromote = useCallback(async (userId: number) => {
        try {
            await promoteUser(schoolId, userId);
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isAdmin: true, status: 'Администратор' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to promote user:', err);
            throw err;
        }
    }, [schoolId, users]);

    const handleDemote = useCallback(async (userId: number) => {
        try {
            await demoteUser(schoolId, userId);
            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, isAdmin: false, status: 'Активна' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to demote user:', err);
            throw err;
        }
    }, [schoolId, users]);

    return {
        users,
        loading,
        error,
        handlePromote,
        handleDemote
    };
};
