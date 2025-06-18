type IUser = {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    password: string;
    created_at: string;
    role: "user" | "admin" | "staff"; // Assuming roles are either 'user' or 'admin'

    // add other properties if needed
};
export type { IUser };