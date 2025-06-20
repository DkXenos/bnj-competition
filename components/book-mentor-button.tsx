"use client";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
import { ISesi } from "@/types/sesi.md";
import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";

export default function BookMentorButton({
  mentor,
}: {
  mentor: IMentor & { user: IUser };
}) {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSchedulePanel, setShowSchedulePanel] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const { error } = await supabase
          .from("sesi")
          .select("*")
          .eq("mentor_id", mentor.user.id);

        if (error) {
          console.error("Error fetching jadwal:", error);
          return;
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [mentor.user.id]);

  const handleClick = () => {
    if (!loggedInUser) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
      return;
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTime(null); // Reset selected time
  };

  const handleSchedulePanelClose = () => {
    setShowSchedulePanel(false);
    setSelectedTime(null); // Reset selected time
  };

  const handleBayar = async () => {
    if (!selectedTime) {
      alert("Pilih jam terlebih dahulu!");
      return;
    }

    try {
      const jamMulai = selectedTime;
      const jamSelesai = new Date(
        new Date(jamMulai).getTime() + 60 * 60 * 1000
      ).toISOString(); // Add 1 hour

      const { error } = await supabase
        .from("sesi")
        .insert([
          {
            mentor_id: mentor.user.id,
            mentee_id: loggedInUser?.id,
            jam_mulai: jamMulai,
            jam_selesai: jamSelesai,
            status: "Menunggu Konfirmasi",
          },
        ]);

      if (error) {
        console.error("Error inserting jadwal:", error);
        return;
      }

      alert("Jadwal berhasil dipilih!");
      handleClose();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleScheduleClick = () => {
    setShowSchedulePanel(true);
  };

  return (
    <>
      <button
        className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-colors flex items-center gap-2 relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        type="button"
      >
        {hovered ? (
          <>
            <i className="bi bi-wallet2"></i> Rp{mentor.harga_per_sesi}
          </>
        ) : (
          <>
            <i className="bi bi-calendar-check"></i> Jadwalkan
          </>
        )}
      </button>

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">Login Diperlukan</h1>
            <p className="text-gray-600 text-center mb-4">
              Anda harus login terlebih dahulu untuk membuat jadwal dengan mentor.
            </p>
            <div className="flex w-full justify-center">
              <button
                className="px-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => (window.location.href = "/login")}
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notifikasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="mb-4 text-black font-bold text-2xl text-center">
              Notifikasi
            </h1>
            <p className="mb-4 text-black text-center">
              Apakah kamu bersedia membayar sebanyak{" "}
              <b>Rp{mentor.harga_per_sesi}</b> untuk 1 sesi?
            </p>
            <div className="flex justify-center gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400"
                onClick={handleClose}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                onClick={handleScheduleClick}
              >
                Lihat Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Panel */}
      {showSchedulePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="mb-4 text-black font-bold text-2xl text-center">
              Pilih Jam
            </h1>
            <div className="mb-4">
              {loading ? (
                <p>Loading jadwal...</p>
              ) : (
                <select
                  className="border text-black border-gray-300 rounded px-4 py-2 w-full"
                  onChange={(e) => setSelectedTime(e.target.value)}
                  value={selectedTime || ""}
                >
                  <option className="text-black" value="" disabled>
                    Pilih jam
                  </option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    const time = `2025-06-20T${hour}:00:00Z`; // Example date
                    return (
                      <option key={time} value={time}>
                        {hour}:00 - {hour}:59
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400"
                onClick={handleSchedulePanelClose}
              >
                Batal
              </button>
              <button
                className={`px-4 py-2 ${
                  selectedTime
                    ? "bg-sky-500 text-white hover:bg-sky-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } rounded`}
                onClick={handleBayar}
                disabled={!selectedTime}
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
