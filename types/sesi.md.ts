type ISesi = {
    id: number;
    jam_mulai: string;
    jam_selesai: string;
    mentor_id: number;
    mentee_id: number;
    rating_ulasan: number | null;
    deksripsi_ulasan: string | null;
    link: string;
    status: "Menunggu Konfirmasi" | "Terkonfirmasi" | "Ditolak" | "Dilaksanakan" | "Selesai" | "Bermasalah";
    isFreeTrial: boolean | null
    alasan_ditolak: string | null;
};
export type { ISesi };