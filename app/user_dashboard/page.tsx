"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import supabase from "@/lib/db";
import JadwalCard from "@/components/jadwal-card";
import { ISesi } from "@/types/sesi.md";

export default function UserDashboard() {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [jadwal, setJadwal] = useState<ISesi[]>([]);
  const [filteredJadwal, setFilteredJadwal] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);

  // State for checkbox filter
  const [filters, setFilters] = useState({
    terkonfirmasi: false,
    menungguKonfirmasi: false,
    ditolak: false,
  });

  // State for mentor registration status
  const [mentorStatus, setMentorStatus] = useState<{
    is_confirmed: boolean | null;
    alasan_ditolak: string | null;
  }>({ is_confirmed: null, alasan_ditolak: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!loggedInUser) return;

      // Fetch the latest user data including profile image
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();

      if (userError) {
        console.error("Error fetching user profile:", userError);
        return;
      }

      // Update the user context with the latest data
      if (userData) {
        setLoggedInUser(userData);
        // Also update localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }
    };

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

    const fetchMentorStatus = async () => {
      if (!loggedInUser) return;

      // Fetch mentor registration status
      const { data, error } = await supabase
        .from("mentors")
        .select("is_confirmed, alasan_ditolak")
        .eq("user_id", loggedInUser.id)
        .single();

      if (error) {
        console.error("Error fetching mentor status:", error);
        return;
      }

      setMentorStatus({
        is_confirmed: data?.is_confirmed ?? null,
        alasan_ditolak: data?.alasan_ditolak ?? null,
      });
    };

    fetchUserProfile();
    fetchJadwal();
    fetchMentorStatus();
  }, [loggedInUser?.id, setLoggedInUser]);

  // Filter jadwal based on checkbox selections
  useEffect(() => {
    const isAnyFilterChecked = Object.values(filters).some((value) => value);

    if (!isAnyFilterChecked) {
      // If no filter is checked, show all jadwal
      setFilteredJadwal(jadwal);
    } else {
      // Apply filters
      const filtered = jadwal.filter((sesi) => {
        if (filters.terkonfirmasi && sesi.status === "Terkonfirmasi")
          return true;
        if (filters.menungguKonfirmasi && sesi.status === "Menunggu Konfirmasi")
          return true;
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
      {/* Hero Section with Background */}

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-start pt-48 sm:pt-34 md:pt-36 lg:pt-48 min-h-[43rem] sm:min-h-[28rem] md:min-h-[30rem] lg:min-h-[26rem] bg-sky-100 bg-[url('/bg-2.svg')] bg-cover bg-center">
        {/* Yang putih putih */}
        <div className="xl:-bottom-20 absolute bg-white w-[70%] flex rounded-lg shadow-lg p-4 gap-4">
          {/* image */}
          <div className="w-full h-full flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-col xl:flex-row items-center justify-center xl:justify-start w-full h-full">
            <Image
              src={loggedInUser?.profile_image || "/def-avatar.png"}
              alt="Profile"
              width={500}
              height={500}
              loading="lazy"
              className="w-40 h-40 border-2 border-gray-300 shadow-lg rounded-full object-cover aspect-square"
            />
            <div className="w-fit flex flex-col gap-2">
              <h1 className="text-lg text-center xl:text-start sm:text-xl lg:text-2xl font-bold text-black mt-2">
                {loggedInUser?.username
                  ?.split(" ")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ") || "Pengguna"}
              </h1>
              <p className="text-sm text-center xl:text-start sm:text-base lg:text-lg text-gray-600">
                Email : {loggedInUser?.email || "Tidak tersedia"}
              </p>
              <p className="text-sm text-center xl:text-start sm:text-base lg:text-lg text-gray-600">
                No Telepon : {loggedInUser?.no_telpon || "Tidak tersedia"}
              </p>
              <Link
                href="/edit_profile_page"
                className="text-blue-500 hover:underline text-center xl:text-start"
              >
                Edit profile
              </Link>
              </div>
            </div>
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* card 1 */}

              <div className="bg-gray-100 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Saldo
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-wallet2"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Rp.20,000
                </h1>
              </div>
              <div className="bg-gray-100 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Sesi
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-hourglass"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  20 jam
                </h1>
              </div>
              <div className="bg-gray-100 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Mentor
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-people-fill"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  20
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="relative z-10 flex flex-col items-center justify-start mt-16 sm:mt-20 lg:mt-24 h-[22.5rem] sm:h-[30rem] md:h-[10rem] lg:h-[17.5rem] xl:h-[2.5rem] w-full"></div>

      {/* Checkbox Filters */}
      <div className="flex flex-col w-full max-w-[70%] mb-4 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md mx-4 items-center lg:items-start">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-black text-start">
          Filter Jadwal
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="terkonfirmasi"
              checked={filters.terkonfirmasi}
              onChange={handleCheckboxChange}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-sm sm:text-base lg:text-lg text-black">
              Terkonfirmasi
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="menungguKonfirmasi"
              checked={filters.menungguKonfirmasi}
              onChange={handleCheckboxChange}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-sm sm:text-base lg:text-lg text-black">
              Menunggu Konfirmasi
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ditolak"
              checked={filters.ditolak}
              onChange={handleCheckboxChange}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-sm sm:text-base lg:text-lg text-black">
              Ditolak
            </span>
          </label>
        </div>
      </div>

      {/* Section for Filtered Sessions */}
      <div className="lg-text-left text-center flex flex-col w-full max-w-[70%] mb-8">
        <div className="overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full py-6 sm:py-8">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 border-b-2 border-black"></div>
                <span className="ml-2 sm:ml-3 lg:ml-4 text-gray-500 text-xs sm:text-sm lg:text-base">
                  Loading jadwal...
                </span>
              </div>
            ) : filteredJadwal.length > 0 ? (
              filteredJadwal.map((sesi) => (
                <JadwalCard key={sesi.id} sesi={sesi} />
              ))
            ) : (
              <div className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 md:text-start text-center w-full">
                Tidak ada jadwal yang sesuai dengan filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mentor Registration Status Section */}
      <div className="flex flex-col w-full max-w-[70%] mb-8 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md mx-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-black text-center lg:text-start">
          Status Pendaftaran Mentor
        </h1>
        {mentorStatus.is_confirmed === null ? (
          <p className="text-gray-600 text-sm text-center lg:text-start w-full">
            Anda belum mendaftar sebagai mentor.
          </p>
        ) : mentorStatus.is_confirmed ? (
          <div className="bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg font-bold">
              Pendaftaran Diterima
            </h2>
            <p className="text-sm sm:text-base">
              Selamat! Anda telah diterima sebagai mentor.
            </p>
          </div>
        ) : mentorStatus.is_confirmed == false &&
          mentorStatus.alasan_ditolak != null ? (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-l text-center">
            <h2 className="text-base sm:text-lg font-bold text-center lg:text-start w-full">
              Pendaftaran Ditolak
            </h2>
            <p className="text-sm sm:text-base text-center lg:text-start w-full">
              Alasan:{" "}
              {mentorStatus.alasan_ditolak ||
                "Tidak ada alasan yang diberikan."}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-700 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base text-center lg:text-start w-full sm:text-lg font-bold">
              Pendaftaran Menunggu Konfirmasi
            </h2>
            <p className="text-sm sm:text-base text-center lg:text-start w-full">
              Pendaftaran Anda sedang dalam proses konfirmasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
