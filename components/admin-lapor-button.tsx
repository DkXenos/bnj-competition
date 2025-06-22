'use client';
import * as sesi from "@/lib/sesi";
import { useState } from "react";

export default function AdminLaporButton({ sesiId, desc }: { sesiId: number, desc: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    if (!desc.trim()) {
      alert("Deskripsi tindak lanjut tidak boleh kosong");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sesi.TindakLanjutLaporan(sesiId, desc);
      if (result.success) {
        alert("Laporan berhasil ditindak lanjuti!");
        window.location.reload(); // Refresh page to show updated status
      } else {
        alert("Gagal menindak lanjuti: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menindak lanjuti laporan.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      type="button"
      className="mt-3 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={handleButtonClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
          <span>Memproses...</span>
        </div>
      ) : (
        "Kirim Tindak Lanjut"
      )}
    </button>
  );
}
