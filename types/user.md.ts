type IUser = {
    id: number;
    username: string;
    email: string;
    no_telpon: string;
    password: string;
    tanggal_join: string;
    isMentor: boolean;
    profile_image: string | null;
    isAdmin: boolean;
};
export type { IUser };