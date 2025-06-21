import { ISesi } from "@/types/sesi.md";
import { useEffect, useState } from "react";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";
import { confirmSession } from "@/lib/sesi";
import Link from "next/link";

export default function JadwalCard({ sesi }: { sesi: ISesi }) {
  const [name, setName] = useState<string>("Loading...");
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchName = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq(
            loggedInUser?.id === sesi.mentor_id ? "id" : "id",
            loggedInUser?.id === sesi.mentor_id ? sesi.mentee_id : sesi.mentor_id
          )
          .single();

        if (error) {
          console.error("Error fetching name:", error);
          setName("Unknown");
          return;
        }

        setName(data?.username || "Unknown");
      } catch (error) {
        console.error("Unexpected error:", error);
        setName("Unknown");
      }
    };

    fetchName();
  }, [sesi.mentor_id, sesi.mentee_id, loggedInUser?.id]);

  const handleAccept = async () => {
    try {
      const result = await confirmSession(sesi.id);

      if (!result.success) {
        alert(`Gagal mengonfirmasi sesi: ${result.error}`);
        return;
      }

      alert(result.message); // "Sesi berhasil dikonfirmasi."
      window.location.reload(); // Refresh the page to reflect changes
      // Optional: Refresh data or update UI
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan saat mengonfirmasi sesi.");
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
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const label = loggedInUser?.id === sesi.mentor_id ? "Mentee" : "Mentor";

  return (
    <div className="relative min-w-[300px] bg-white border-1 rounded-lg shadow-lg p-6">
      {loggedInUser?.id === sesi.mentee_id && sesi.status === "Terkonfirmasi" && (
          <div className="absolute top-4 right-4 flex gap-1 hover:cursor-pointer">
            <div className="rounded-full bg-gray-200 px-2">
            <i className="bi bi-flag-fill text-xs text-red-300"></i>
            </div>
          </div>
      )}
      <div className="gap-2 h-full flex flex-col justify-between">
        <h2 className="text-black text-lg font-bold mb-2">Mentoring</h2>
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
       
        <p className="text-gray-500 mb-1">
          {label}: {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        {loggedInUser?.id === sesi.mentee_id && (sesi.status === "Terkonfirmasi" || "Selesai" || "Dilaksanakan" || "Bermasalah") && (
         <Link href={sesi.link} className="mb-1 text-center w-full text-blue-500">Link meeting</Link>
        )}
        <span
          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
            sesi.status === "Terkonfirmasi"
              ? "bg-green-100 text-green-700"
              : sesi.status === "Ditolak"
              ? "bg-red-100 text-red-700"
              : sesi.status === "Selesai" || sesi.status === "Bermasalah"
              ? "bg-blue-100 text-blue-700"
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
