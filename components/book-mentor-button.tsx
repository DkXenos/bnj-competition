"use client";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";
import { CheckForFreeTrial } from "@/lib/sesi";
import { ISesi } from "@/types/sesi.md";

export default function BookMentorButton({
  mentor,
}: {
  mentor: IMentor & { user: IUser };
}) {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSchedulePanel, setShowSchedulePanel] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup
  const [mentorSchedule, setMentorSchedule] = useState<ISesi[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isEligibleForFreeTrial, setIsEligibleForFreeTrial] = useState(false);
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchJadwal = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sesi")
          .select("*")
          .eq("mentor_id", mentor.user.id);

        if (error) {
          console.error("Error fetching jadwal:", error);
          return;
        }
        setMentorSchedule(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [mentor.user.id]);

  useEffect(() => {
    const checkFreeTrial = async () => {
      if (
        typeof mentor.user.id === "number" &&
        typeof loggedInUser?.id === "number"
      ) {
        const freeTrialStatus = await CheckForFreeTrial(
          mentor.user.id,
          loggedInUser.id
        );
        // User is eligible for a free trial if they have no prior session (status is null)
        if (freeTrialStatus === null) {
          setIsEligibleForFreeTrial(true);
        }
      }
    };
    checkFreeTrial();
  }, [mentor.user.id, loggedInUser?.id]);

  const handleClick = () => {
    if (!loggedInUser) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
      return;
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSchedulePanelClose = () => {
    setShowSchedulePanel(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleBayar = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Pilih tanggal dan jam terlebih dahulu!");
      return;
    }

    try {
      const jamMulai = new Date(
        `${selectedDate}T${selectedTime}:00:00Z`
      ).toISOString();
      const jamSelesai = new Date(
        new Date(jamMulai).getTime() + 60 * 60 * 1000
      ).toISOString(); // Add 1 hour

      const { error } = await supabase.from("sesi").insert([
        {
          mentor_id: mentor.user.id,
          mentee_id: loggedInUser?.id,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
          status: "Menunggu Konfirmasi",
          isFreeTrial: isEligibleForFreeTrial, // Set based on eligibility
        },
      ]);

      if (error) {
        console.error("Error inserting jadwal:", error);
        return;
      }

      alert("Jadwal berhasil dipilih!");
      handleSchedulePanelClose();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleScheduleClick = () => {
    setShowModal(false);
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
          {isEligibleForFreeTrial ? (
            <>
              <i className="bi bi-wallet2"></i> Gratis
            </>
          ) : (
            <>
              <i className="bi bi-credit-card"></i> Rp{mentor.harga_per_sesi}
            </>
          )}
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
            {isEligibleForFreeTrial ? (
              <p className="mb-4 text-black text-center">
                Anda berhak mendapatkan <b>1 Sesi Percobaan Gratis</b> dengan
                mentor ini.
              </p>
            ) : (
              <p className="mb-4 text-black text-center">
                Apakah kamu bersedia membayar sebanyak{" "}
                <b>Rp{mentor.harga_per_sesi}</b> untuk 1 sesi?
              </p>
            )}
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
              Pilih Jadwal
            </h1>
            <div className="mb-4 space-y-4">
              {loading ? (
                <p>Loading jadwal...</p>
              ) : (
                <>
                  <div>
                    <label className="block text-black mb-2">Tanggal</label>
                    <input
                      type="date"
                      className="border text-black border-gray-300 rounded px-4 py-2 w-full"
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(""); // Reset time when date changes
                      }}
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-2">Jam</label>
                    <select
                      className="border text-black border-gray-300 rounded px-4 py-2 w-full"
                      onChange={(e) => setSelectedTime(e.target.value)}
                      value={selectedTime}
                      disabled={!selectedDate}
                    >
                      <option className="text-black" value="" disabled>
                        Pilih jam
                      </option>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i;
                        const isBooked = mentorSchedule.some((sesi) => {
                          const sesiDate = new Date(sesi.jam_mulai)
                            .toISOString()
                            .split("T")[0];
                          const sesiHour = new Date(
                            sesi.jam_mulai
                          ).getUTCHours();
                          return (
                            sesiDate === selectedDate && sesiHour === hour
                          );
                        });

                        if (isBooked) {
                          return null;
                        }

                        const hourString = hour.toString().padStart(2, "0");
                        return (
                          <option key={hour} value={hourString}>
                            {hourString}:00
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
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
                  selectedDate && selectedTime
                    ? "bg-sky-500 text-white hover:bg-sky-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } rounded`}
                onClick={handleBayar}
                disabled={!selectedDate || !selectedTime}
              >
                {isEligibleForFreeTrial ? "Ambil Sesi Gratis" : "Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
