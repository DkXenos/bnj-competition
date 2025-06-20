import supabase from "@/lib/db";
import { ISesi } from "@/types/sesi.md";
import { IUser } from "@/types/user.md";
import { useEffect } from "react";
import { useState } from "react";

export default function JadwalCard({ loggedInUser, sesi }: { loggedInUser: IUser, sesi:ISesi }) {

  return (
    <div
      className="min-w-[300px] bg-gray-100 border-1 rounded-lg shadow-lg p-6 justify-between"
    >
      <div className="w-full h-full flex flex-col justify-between">
        <h2 className="text-black text-lg font-bold mb-2">{sesi.mentor_id}</h2>
        <p className="text-gray-600 mb-1">
            {new Date(sesi.jam_mulai).toLocaleString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            })} - {new Date(sesi.jam_selesai).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            })}
        </p>
        <p className="text-gray-500 mb-1">{sesi.link}</p>
        <p className="text-gray-500 mb-1">Mentor: {sesi.mentor_id}</p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            sesi.status === "Terkonfirmasi"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {sesi.status}
        </span>
      </div>
    </div>
  );
}
