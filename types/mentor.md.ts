type IMentor = {
    id: number;
    user_id: number;
    deskripsi: string;
    link_video: string;
    tanggal_join_mentor: string;
    total_rating: number;
    harga_per_sesi: number;
    foto_ktp: string;
    foto_kk: string;
    is_verified: boolean;
    alasan_ditolak: string | null;
    alasan_didemote: string | null;
};
export type { IMentor };