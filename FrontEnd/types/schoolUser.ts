
export interface ApiUser {
    Id: number;
    Username: string;
    Email: string;
    IsAdmin: number;
}

// Frontend Component interface (transformed data)
export interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    status: string;
}