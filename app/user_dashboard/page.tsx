"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState, useEffect } from "react";
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
      {/* Hero Section with Background */}
      <div className="w-full h-full">
        <div className="relative z-10 flex flex-col items-center justify-start pt-28 sm:pt-34 md:pt-36 lg:pt-28 min-h-[43rem] sm:min-h-[28rem] md:min-h-[30rem] lg:min-h-[26rem] w-[full] bg-sky-100 bg-[url('/bg-2.svg')] bg-cover bg-center px-4 sm:px-6">
          {/* Main Profile Card */}
          <div className="absolute -bottom-16 sm:-bottom-20 lg:-bottom-24 z-10 flex flex-col items-start p-4 sm:p-6 justify-start min-h-[14rem] sm:min-h-[15rem] lg:min-h-[16rem] w-[70%] max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] rounded-lg shadow-lg bg-white">
            <div className="relative w-full h-full">
              {/* Profile Info Section */}
              <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-start p-2 sm:p-4 gap-4 lg:gap-6 pt-2 sm:pt-4">
                {/* User Info with Profile Picture */}
                <div className="w-full lg:flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Profile Avatar - Positioned much lower to avoid navbar cut-off */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-46 xl:h-46 bg-gray-200 border-white shadow-2xl border-3 sm:border-4 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${loggedInUser?.profile_image || "/def-avatar.png"}')`,
                      }}
                    ></div>
                  </div>
        
                  {/* User Text Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-black">
                      Halo, {loggedInUser?.username}!
                    </h1>
                    <p className="text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">
                      Selamat datang di dashboard pengguna Anda!
                    </p>
                    <p className="text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">
                      email: {loggedInUser?.email}
                    </p>
                    <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                      nomor telepon:{" "}
                      {loggedInUser?.no_telpon ||
                        "Tidak ada nomor telepon yang terdaftar"}
                    </p>
                    <Link
                      href={"/edit_profile_page"}
                      className="text-blue-400 hover:underline mt-2 sm:mt-3 lg:mt-4 z-[1000] text-xs sm:text-sm lg:text-base"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
        
                {/* Stats Grid - Smaller and more compact */}
                <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mt-4 lg:mt-0">
                  <div className="bg-gray-100 flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-lg shadow-md min-w-[90px] sm:min-w-[100px] lg:min-w-[110px]">
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                      Total Saldo
                    </h1>
                    <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-wallet2"></i>
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                      Rp.20,000
                    </h1>
                  </div>
                  <div className="bg-gray-100 flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-lg shadow-md min-w-[90px] sm:min-w-[100px] lg:min-w-[110px]">
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                      Total Sesi
                    </h1>
                    <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-hourglass"></i>
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">20 jam</h1>
                  </div>
                  <div className="bg-gray-100 flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-lg shadow-md min-w-[90px] sm:min-w-[100px] lg:min-w-[110px]">
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                      Total Mentor
                    </h1>
                    <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-people-fill"></i>
                    <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">20</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer */}
      <div className="relative z-10 flex flex-col items-center justify-start mt-16 sm:mt-20 lg:mt-24 h-[2rem] sm:h-[4rem] lg:h-[6rem] w-full"></div>

      {/* Checkbox Filters */}
      <div className="flex flex-col w-full max-w-[70%] sm:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] mb-4 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md mx-4 items-center lg:items-start">
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
            <span className="text-sm sm:text-base lg:text-lg text-black">Terkonfirmasi</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="menungguKonfirmasi"
              checked={filters.menungguKonfirmasi}
              onChange={handleCheckboxChange}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-sm sm:text-base lg:text-lg text-black">Menunggu Konfirmasi</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ditolak"
              checked={filters.ditolak}
              onChange={handleCheckboxChange}
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span className="text-sm sm:text-base lg:text-lg text-black">Ditolak</span>
          </label>
        </div>
      </div>

      {/* Section for Filtered Sessions */}
      <div className="mt-2 sm:mt-4 lg:mt-8 lg-text-left text-center flex flex-col w-full max-w-[70%] sm:max-w-[90%] lg:max-w-[0%] xl:max-w-[70%] mb-8">
        <div className="overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full py-6 sm:py-8">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 border-b-2 border-black"></div>
                <span className="ml-2 sm:ml-3 lg:ml-4 text-gray-500 text-xs sm:text-sm lg:text-base">Loading jadwal...</span>
              </div>
            ) : filteredJadwal.length > 0 ? (
              filteredJadwal.map((sesi) => <JadwalCard key={sesi.id} sesi={sesi} />)
            ) : (
              <div className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 md:text-start text-center w-full">
                Tidak ada jadwal yang sesuai dengan filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mentor Registration Status Section */}
      <div className="flex flex-col w-full max-w-[70%] sm:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] mb-8 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md mx-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-black text-center lg:text-start">
          Status Pendaftaran Mentor
        </h1>
        {mentorStatus.is_confirmed === null ? (
          <p className="text-gray-600 text-sm sm:text-base">Anda belum mendaftar sebagai mentor.</p>
        ) : mentorStatus.is_confirmed ? (
          <div className="bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg font-bold">Pendaftaran Diterima</h2>
            <p className="text-sm sm:text-base">Selamat! Anda telah diterima sebagai mentor.</p>
          </div>
        ) : (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-l text-center">
            <h2 className="text-base sm:text-lg font-bold">Pendaftaran Ditolak</h2>
            <p className="text-sm sm:text-base">Alasan: {mentorStatus.alasan_ditolak || "Tidak ada alasan yang diberikan."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
