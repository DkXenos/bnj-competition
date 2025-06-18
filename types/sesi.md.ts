type ISesi = {
    id: number;
    jam_mulai: string;
    jam_selesai: string;
    mentor_id: number;
    mentee_id: number;
    rating_ulasan: number | null;
    deksripsi_ulasan: string | null;
};
export type { ISesi };