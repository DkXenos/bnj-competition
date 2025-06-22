"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as sesi from "@/lib/sesi";
import { ISesi } from "@/types/sesi.md";

function AdminLaporanConfirmation() {
  const [laporanList, setLaporanList] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLaporan() {
      try {
        const data = await sesi.GetAllLaporanWhichIsNotConfirmed();
        setLaporanList(data);
      } catch (error) {
        console.error("Error fetching laporan:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 py-16">
      <div className="w-screen h-[6vh]"></div>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Daftar Laporan Belum Dikonfirmasi</h2>
        {laporanList.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada laporan yang perlu dikonfirmasi.</p>
        ) : (
          <ul className="space-y-4">
            {laporanList.map((laporan: ISesi) => (
              <li key={laporan.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-gray-600">Deskripsi: {laporan.deksripsi_laporan}</p>
                  <p className="text-gray-500 text-sm">Dibuat oleh: {laporan.mentee_name}</p>
                </div>
                <Link
                  href={`/laporan_detail/${laporan.id}`}
                  className="mt-2 md:mt-0 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                  Lihat Detail
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminLaporanConfirmation;