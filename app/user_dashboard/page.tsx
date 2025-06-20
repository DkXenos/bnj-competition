"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import supabase from "@/lib/db";
import JadwalCard from "@/components/jadwal-card";
import { ISesi } from "@/types/sesi.md";

export default function UserDashboard() {
  const { loggedInUser } = useUser();
  const [jadwal, setJadwal] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!loggedInUser) return;
      setLoading(true); // Start loading
      const { data, error } = await supabase
        .from("sesi")
        .select("*")
        .eq("mentee_id", loggedInUser.id);
      if (!error) {
        setJadwal(data || []);
      }
      setLoading(false); // End loading
    };
    fetchJadwal();
  }, [loggedInUser]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100">
      <div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[22.5rem] w-screen bg-sky-100 bg-[url('/bg-2.svg')] bg-cover bg-center">
        <div className="border-1 absolute -bottom-30 z-10 flex flex-col items-start p-4 justify-start mt-14 h-[15rem] w-[70%] rounded-lg shadow-lg bg-white">
          <div className="relative w-full h-full">
            <div
              className="absolute -left-20 w-50 h-50 border-white shadow-2xl border-3 rounded-full bg-cover bg-center"
              style={{
              backgroundImage: `url('${loggedInUser?.profile_image || "/default-profile.png"}')`,
              }}
            ></div>
            <div className="w-full h-full flex">
              <div className="w-70 h-50 rounded-full"></div>
              <div className="relative z-20 w-full h-full flex flex-col items-start justify-start p-4">
                <h1 className="text-4xl text-left font-bold mb-4 text-black">
                  Halo, {loggedInUser?.username}! - Mentor
                </h1>
                <p className="text-gray-700 mb-2">
                  Selamat datang di dashboard pengguna Anda!
                </p>
                <p className="text-gray-700 mb-2">
                  email: {loggedInUser?.email}
                </p>
                <p className="text-gray-700 mb-2">
                  nomor telepon:{" "}
                  {loggedInUser?.no_telpon ||
                    "Tidak ada nomor telepon yang terdaftar"}
                </p>
                <Link
                  href={"/edit_profile_page"}
                  className="text-blue-400 hover:underline mt-4 z-30"
                >
                  Edit Profile
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full h-full">
                <div className="bg-gray-100 flex flex-col gap-4 p-2 rounded-lg shadow-md">
                  <h1 className="text-gray-600 text-xl text-center">
                    Total Saldo
                  </h1>
                  <i className="text-8xl text-gray-600 text-center bi bi-wallet2"></i>
                  <h1 className="text-gray-600 text-xl text-center">
                    Rp.20,000
                  </h1>
                </div>
                <div className="bg-gray-100 flex flex-col gap-4 p-2 rounded-lg shadow-md">
                  <h1 className="text-gray-600 text-xl text-center">
                    Total Sesi
                  </h1>
                  <i className="text-8xl text-gray-600 text-center bi bi-hourglass"></i>
                  <h1 className="text-gray-600 text-xl text-center">20 jam</h1>
                </div>
                <div className="bg-gray-100 flex flex-col gap-4 p-2 rounded-lg shadow-md">
                  <h1 className="text-gray-600 text-xl text-center">
                    Total Mentor
                  </h1>
                  <i className="text-8xl text-gray-600 text-center bi bi-people-fill"></i>
                  <h1 className="text-gray-600 text-xl text-center">20</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[8rem] w-screen"></div>

      {/* Personal Schedule Section (Jadwalku) */}
      <div className="flex flex-col w-[70%]">
        <h1 className="text-4xl font-bold mb-4 text-black text-start">
          Jadwalku
        </h1>
        <p className="text-xl text-gray-600">
          Belajar dengan mentor kami yang berpengalaman dan siap membantu Anda
          mencapai tujuan belajar Anda.
        </p>
        <div className="overflow-x-auto">
          <div className="flex gap-6 mt-4">
            {loading ? (
              <div className="flex items-center justify-start h-full w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span className="ml-4 text-gray-500">Loading jadwal...</span>
              </div>
            ) : loggedInUser && jadwal.length > 0 ? (
              jadwal.map((sesi) => <JadwalCard key={sesi.id} sesi={sesi} />)
            ) : (
              <div className="text-gray-500 text-lg mt-4">
                Kamu belum membuat jadwal
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
