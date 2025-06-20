import { ISesi } from "@/types/sesi.md";
import { useEffect, useState } from "react";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";

export default function JadwalCard({ sesi }: { sesi: ISesi }) {
  const [mentorName, setMentorName] = useState<string>("Loading...");
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchMentorName = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", sesi.mentor_id)
          .single();

        if (error) {
          console.error("Error fetching mentor name:", error);
          setMentorName("Unknown");
          return;
        }

        setMentorName(data?.username || "Unknown");
      } catch (error) {
        console.error("Unexpected error:", error);
        setMentorName("Unknown");
      }
    };

    fetchMentorName();
  }, [sesi.mentor_id]);

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from("sesi")
        .update({ status: "Terkonfirmasi" })
        .eq("id", sesi.id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      alert("Sesi berhasil diterima!");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("sesi")
        .update({ status: "Ditolak" })
        .eq("id", sesi.id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      alert("Sesi berhasil ditolak!");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="min-w-[300px] bg-white border-1 rounded-lg shadow-lg p-6 justify-between">
      <div className="w-full gap-2 h-full flex flex-col justify-between">
        <h2 className="text-black text-lg font-bold mb-2">Belajar bersama</h2>
        <h1 className="text-gray-600 mb-1">
          {new Date(sesi.jam_mulai).toLocaleString("id-ID", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}{" "}
          -{" "}
          {new Date(sesi.jam_selesai).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </h1>
        <p className="text-gray-500 mb-1">{sesi.link}</p>
        <p className="text-gray-500 mb-1">
          Mentor: {mentorName.charAt(0).toUpperCase() + mentorName.slice(1)}
        </p>
        <span
          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
            sesi.status === "Terkonfirmasi"
              ? "bg-green-100 text-green-700"
              : sesi.status === "Ditolak"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {sesi.status}
        </span>

        {/* Buttons for Mentor */}
        {loggedInUser?.id === sesi.mentor_id && sesi.status === "Menunggu Konfirmasi" && (
          <div className="flex w-full gap-2 mt-4">
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleAccept}
            >
              Terima
            </button>
            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleReject}
            >
              Tolak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
