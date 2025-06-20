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
  const [filteredJadwal, setFilteredJadwal] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);

  // State for checkbox filter
  const [filters, setFilters] = useState({
    terkonfirmasi: false,
    menungguKonfirmasi: false,
    ditolak: false,
  });

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!loggedInUser) return;
      setLoading(true);

      // Fetch all sessions where the user is either a mentee or a mentor
      const { data, error } = await supabase
        .from("sesi")
        .select("*")
        .or(`mentee_id.eq.${loggedInUser.id},mentor_id.eq.${loggedInUser.id}`);

      if (error) {
        console.error("Error fetching jadwal:", error);
        setLoading(false);
        return;
      }

      console.log("Fetched sessions:", data); // Debug log
      setJadwal(data || []);
      setFilteredJadwal(data || []); // Initialize filtered data
      setLoading(false);
    };

    fetchJadwal();
  }, [loggedInUser]);

  // Filter jadwal based on checkbox selections
  useEffect(() => {
    const isAnyFilterChecked = Object.values(filters).some((value) => value);

    if (!isAnyFilterChecked) {
      // If no filter is checked, show all jadwal
      setFilteredJadwal(jadwal);
    } else {
      // Apply filters
      const filtered = jadwal.filter((sesi) => {
        if (filters.terkonfirmasi && sesi.status === "Terkonfirmasi") return true;
        if (filters.menungguKonfirmasi && sesi.status === "Menunggu Konfirmasi") return true;
        if (filters.ditolak && sesi.status === "Ditolak") return true;
        return false;
      });
      setFilteredJadwal(filtered);
    }
  }, [filters, jadwal]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 pb-16">
      <div className="relative z-10 flex flex-col items-center justify-start mt-14 min-h-[22.5rem] w-screen bg-sky-100 bg-[url('/bg-2.svg')] bg-cover bg-center">
        <div className="border-1 absolute -bottom-30 z-10 flex flex-col items-start p-4 justify-start mt-14 h-[15rem] w-[70%] rounded-lg shadow-lg bg-white">
          <div className="relative w-full h-full">
            <div
              className="absolute -left-20 -z-10 w-50 h-50 bg-gray-200 border-white shadow-2xl border-3 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url('${loggedInUser?.profile_image || "/def-avatar.png"}')`,
              }}
            ></div>
            <div className="w-full h-full flex">
              <div className="w-70 -z-10 h-50 rounded-full"></div>
              <div className="relative z-20 w-full h-full flex flex-col items-start justify-start p-4">
                <h1 className="text-4xl text-left font-bold mb-4 text-black">
                  Halo, {loggedInUser?.username}!
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
                  className="text-blue-400 hover:underline mt-4 z-[1000]"
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

      {/* Checkbox Filters */}
      <div className="flex flex-col w-[70%] mb-4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-black text-start">
          Filter Jadwal
        </h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="terkonfirmasi"
              checked={filters.terkonfirmasi}
              onChange={handleCheckboxChange}
            />
            <span className="text-lg text-black">Terkonfirmasi</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="menungguKonfirmasi"
              checked={filters.menungguKonfirmasi}
              onChange={handleCheckboxChange}
            />
            <span className="text-lg text-black">Menunggu Konfirmasi</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ditolak"
              checked={filters.ditolak}
              onChange={handleCheckboxChange}
            />
            <span className="text-lg text-black">Ditolak</span>
          </label>
        </div>
      </div>

      {/* Section for Filtered Sessions */}
      <div className="mt-8 flex flex-col w-[70%] mb-8">
        <div className="overflow-x-auto">
          <div className="flex gap-6 mt-4">
            {loading ? (
              <div className="flex items-center justify-start h-full w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span className="ml-4 text-gray-500">Loading jadwal...</span>
              </div>
            ) : filteredJadwal.length > 0 ? (
              filteredJadwal.map((sesi) => <JadwalCard key={sesi.id} sesi={sesi} />)
            ) : (
              <div className="text-gray-500 text-lg mt-4">
                Tidak ada jadwal yang sesuai dengan filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
