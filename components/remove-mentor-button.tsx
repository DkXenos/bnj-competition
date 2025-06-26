'use client';
import * as sesi from "@/lib/sesi";
import { useState } from "react";
import LoadingScreen from "@/components/loading-screen";
import supabase from "@/lib/db";

export default function RemoveMentorButton({ sesiId, desc }: { sesiId: number, desc: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const handleButtonClick = async () => {
    if (!desc.trim()) {
      alert("Deskripsi tindak lanjut tidak boleh kosong");
      return;
    }
    
    setIsLoading(true);
    setShowLoadingOverlay(true);
    
    try {
      // First get session data to confirm the mentor_id
      const { data: sessionData } = await supabase
        .from("sesi")
        .select("mentor_id")
        .eq("id", sesiId)
        .single();
      
      if (!sessionData || !sessionData.mentor_id) {
        throw new Error("Tidak dapat menemukan data sesi yang valid");
      }
      
      // Then get the mentor data using the mentor_id
      const { data: mentorData, error } = await supabase
        .from("mentors")
        .select("id, user_id")
        .eq("id", sessionData.mentor_id)
        .single();
        
      if (error || !mentorData) {
        throw new Error("Tidak dapat menemukan data mentor yang valid");
      }
      
      // Make sure both values exist and are numbers before passing to DemoteMentor
      if (!mentorData.id || !mentorData.user_id) {
        throw new Error("Data mentor tidak lengkap");
      }
      
      const result = await sesi.DemoteMentor(sesiId ,mentorData.id, mentorData.user_id, desc);
      
      if (result.success) {
        alert("Laporan berhasil ditindak lanjuti!");
        window.location.href = "/konfirmasi_laporan";
      } else {
        alert("Gagal menindak lanjuti: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menindak lanjuti laporan: " + 
        (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
      setShowLoadingOverlay(false);
    }
  };
  
  return (
    <>
      {showLoadingOverlay && (
        <LoadingScreen message="Memproses tindakan..." animationType="both" />
      )}
      <button
        type="button"
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
            <span>Memproses...</span>
          </div>
        ) : (
          "Hapus Mentor"
        )}
      </button>
    </>
  );
}
