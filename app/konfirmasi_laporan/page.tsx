"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as sesi from "@/lib/sesi";
import { ISesi } from "@/types/sesi.md";
import supabase from "@/lib/db";
import LoadingScreen from "@/components/loading-screen";

function AdminLaporanConfirmation() {
  const router = useRouter();
  const [laporanList, setLaporanList] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeReportId, setActiveReportId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLaporan() {
      try {
        const data = await sesi.GetAllLaporanWhichIsNotConfirmed();

        // Get unique mentee IDs
        const menteeIds = [...new Set(data.map((laporan) => laporan.mentee_id))];

        // Fetch all mentee data in a single query
        const { data: mentees, error } = await supabase
          .from("users")
          .select("id, username")
          .in("id", menteeIds);

        if (error) {
          console.error("Error fetching mentee data:", error);
          throw error;
        }

        // Create a map of mentee data for quick lookup
        const menteeMap = new Map();
        mentees?.forEach((mentee) => {
          menteeMap.set(mentee.id, mentee.username);
        });

        // Add mentee names to laporan objects
        const laporanWithMenteeNames = data.map((laporan) => ({
          ...laporan,
          mentee_name: menteeMap.get(laporan.mentee_id) || "Unknown User",
        }));

        setLaporanList(laporanWithMenteeNames);
      } catch (error) {
        console.error("Error fetching laporan:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLaporan();
  }, []);

  const handleDetailClick = (id: number) => {
    setIsNavigating(true);
    setActiveReportId(id);
    // Use setTimeout to ensure loading screen is shown before navigation
    setTimeout(() => {
      router.push(`/laporan_detail/${id}`);
    }, 100);
  };

  if (loading) {
    return <LoadingScreen message="Memuat daftar laporan..." />;
  }

  return (
    <>
      {isNavigating && (
        <LoadingScreen
          message={`Memuat detail laporan...`}
          overlay={true}
        />
      )}
      <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 py-16">
        <div className="w-screen h-[6vh]"></div>
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Daftar Laporan Belum Dikonfirmasi
          </h2>
          {laporanList.length === 0 ? (
            <p className="text-center text-gray-500">
              Tidak ada laporan yang perlu dikonfirmasi.
            </p>
          ) : (
            <ul className="space-y-4">
              {laporanList.map((laporan: ISesi) => (
                <li
                  key={laporan.id}
                  className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-gray-600">
                      Deskripsi: {laporan.deksripsi_laporan}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Dibuat oleh: {laporan.mentee_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDetailClick(laporan.id)}
                    className="mt-2 md:mt-0 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                    Lihat Detail
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminLaporanConfirmation;