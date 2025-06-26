'use client';
import { useState } from "react";
import AdminLaporButton from "@/components/admin-lapor-button";
import RemoveMentorButton from "@/components/remove-mentor-button";

export default function TindakLanjutForm({ sesiId }: { sesiId: number }) {
  const [tindakLanjutDesc, setTindakLanjutDesc] = useState("");
  
  return (
    <div className="mt-6">
      <label htmlFor="tindakLanjut" className="block text-black mb-2">
        Deskripsi Tindak Lanjut Laporan:
      </label>
      <textarea
        id="tindakLanjut"
        name="tindakLanjut"
        value={tindakLanjutDesc}
        onChange={(e) => setTindakLanjutDesc(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none text-black"
        rows={4}
        placeholder="Tulis tindak lanjut di sini..."
      />
      <div className="flex gap-4 justify-end w-full">
        <RemoveMentorButton sesiId={sesiId} desc={tindakLanjutDesc} />
        <AdminLaporButton sesiId={sesiId} desc={tindakLanjutDesc} />
      </div>
    </div>
  );
}