type ITransaction = {
    id: number;
    transaction_date: string;
    amount: number;
    payment_method: "BCA" | "OVO" | "QRIS" | "Gopay" | "Dompetku";
    user_id: number;
    transaction_status: "Menunggu Konfrimasi" | "Berhasil" | "Gagal";
    transaction_purpose: "Isi Saldo" | "Tarik Saldo" | "Pembelian Sesi Mentoring"
};
export type { ITransaction };