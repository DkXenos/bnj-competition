"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import supabase from "@/lib/db";
import JadwalCard from "@/components/jadwal-card";
import { ISesi } from "@/types/sesi.md";

export default function UserDashboard() {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [jadwal, setJadwal] = useState<ISesi[]>([]);
  const [filteredJadwal, setFilteredJadwal] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);

  // --- State for different layouts ---
  const [isMobile, setIsMobile] = useState(false);

  // --- Pagination State (for Mobile) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Items per page on mobile

  // --- Scrolling State (for Desktop) ---
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimer = useRef<NodeJS.Timeout | null>(null);

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

  // State for total sesi
  const [totalSesi, setTotalSesi] = useState<number>(0);
  const [uniqueMentorCount, setUniqueMentorCount] = useState<number>(0);

  // --- Effect for device detection ---
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!loggedInUser) return;
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();
      if (userError) {
        console.error("Error fetching user profile:", userError);
        return;
      }
      if (userData) {
        setLoggedInUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }
    };

    const fetchJadwal = async () => {
      if (!loggedInUser) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("sesi")
        .select("*")
        .or(`mentee_id.eq.${loggedInUser.id},mentor_id.eq.${loggedInUser.id}`);
      if (error) {
        console.error("Error fetching jadwal:", error);
        setLoading(false);
        return;
      }
      setJadwal(data || []);
      setFilteredJadwal(data || []);
      setLoading(false);
    };

    const fetchMentorStatus = async () => {
      if (!loggedInUser) return;
      const { data: isUserInMentorTable, error: mentorError } = await supabase
        .from("mentors")
        .select("*")
        .eq("user_id", Number(loggedInUser.id));

      if (mentorError) {
        console.error("Error checking mentor status:", mentorError);
        return;
      }

      if (isUserInMentorTable) {
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
          is_confirmed: data?.is_confirmed,
          alasan_ditolak: data?.alasan_ditolak,
        });
      }
    };

    const fetchTotalSesi = async () => {
      if (!loggedInUser) return;

      try {
        // Count all sessions where the user is either a mentor or mentee
        const { data, error } = await supabase
          .from("sesi")
          .select("id")
          .or(`mentee_id.eq.${loggedInUser.id},mentor_id.eq.${loggedInUser.id}`);

        if (error) {
          console.error("Error fetching total sesi:", error);
          return;
        }

        setTotalSesi(data?.length || 0);
      } catch (error) {
        console.error("Unexpected error fetching total sessions:", error);
      }
    };

    const fetchUniqueMentorCount = async () => {
      if (!loggedInUser) return;

      try {
        // Get all sessions where the user is a mentee
        const { data, error } = await supabase
          .from("sesi")
          .select("mentor_id")
          .eq("mentee_id", loggedInUser.id);

        if (error) {
          console.error("Error fetching mentor count:", error);
          return;
        }

        // Extract unique mentor IDs
        const uniqueMentorIds = new Set(data.map(session => session.mentor_id));
        setUniqueMentorCount(uniqueMentorIds.size);
      } catch (error) {
        console.error("Unexpected error fetching unique mentors:", error);
      }
    };

    fetchUserProfile();
    fetchJadwal();
    fetchMentorStatus();
    fetchTotalSesi();
    fetchUniqueMentorCount();
  }, [loggedInUser?.id, setLoggedInUser]);

  // --- Auto-scrolling logic for Desktop ---
  const isPaused = isHovering || isInteracting;
  useEffect(() => {
    if (
      isMobile ||
      isPaused ||
      loading ||
      !scrollContainerRef.current ||
      filteredJadwal.length < 4
    ) {
      return;
    }
    const container = scrollContainerRef.current;
    const scrollInterval = setInterval(() => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 30);
    return () => clearInterval(scrollInterval);
  }, [isPaused, loading, filteredJadwal.length, isMobile]);

  // Filter jadwal based on checkbox selections
  useEffect(() => {
    const isAnyFilterChecked = Object.values(filters).some((value) => value);
    if (!isAnyFilterChecked) {
      setFilteredJadwal(jadwal);
    } else {
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
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [filters, jadwal]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  // --- Handlers for Desktop Scrolling ---
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleInteraction = () => {
    setIsInteracting(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => setIsInteracting(false), 2000);
  };

  // --- Pagination Logic for Mobile ---
  const totalPages = Math.ceil(filteredJadwal.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJadwal = filteredJadwal.slice(startIndex, endIndex);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 pb-16">
      {/* Hero Section with Background */}
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-start pt-48 sm:pt-34 md:pt-36 lg:pt-48 min-h-[43rem] sm:min-h-[28rem] md:min-h-[30rem] lg:min-h-[26rem] bg-sky-100 bg-[url('/bg-2.svg')] bg-cover bg-center">
        <div className="xl:-bottom-20 absolute bg-white w-[70%] flex rounded-lg shadow-lg p-4 gap-4">
          <div className="w-full h-full flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-col xl:flex-row items-center justify-center xl:justify-start w-full h-full">
              <Image
                src={loggedInUser?.profile_image || "/def-avatar.png"}
                alt="Profile"
                width={500}
                height={500}
                loading="lazy"
                className="w-30 h-30 md:w-40 md:h-40 border-2 border-gray-300 shadow-lg rounded-full object-cover aspect-square"
              />
              <div className="w-fit flex flex-col gap-2">
                <h1 className="text-lg text-center xl:text-start sm:text-xl lg:text-2xl font-bold text-black mt-2">
                  {loggedInUser?.username
                    ?.split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
              <Link href={"/dompet_page"}>
              <div className="bg-gray-100 hover:bg-gray-200 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Saldo
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-wallet2"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Rp.{loggedInUser?.saldo}
                </h1>
              </div>
              </Link>
              <div className="bg-gray-100 hover:bg-gray-200 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Sesi
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-hourglass"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  {totalSesi} jam
                </h1>
              </div>
              <div className="bg-gray-100 hover:bg-gray-200 min-h-[10rem] justify-between p-4 flex flex-col rounded-lg shadow-md">
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  Total Mentor
                </h1>
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-people-fill"></i>
                <h1 className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">
                  {uniqueMentorCount}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start mt-16 sm:mt-20 lg:mt-24 h-[22.5rem] sm:h-[30rem] md:h-[10rem] lg:h-[17.5rem] xl:h-[2.5rem] w-full"></div>

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
        {isMobile ? (
          // --- PAGINATION LAYOUT FOR MOBILE ---
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 min-h-[20rem]">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 animate-pulse rounded-lg h-64"
                  ></div>
                ))
              ) : currentJadwal.length > 0 ? (
                currentJadwal.map((sesi) => (
                  <JadwalCard key={sesi.id} sesi={sesi} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg">
                  <div className="text-gray-500 text-base mt-4 text-center w-full col-span-full">
                    Sayang sekali, kamu masih belum memiliki sesi yang terjadwal.
                  </div>
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="w-full flex justify-between items-center gap-4 mt-8">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {"<"}
                </button>
                <span className="text-black font-medium">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {">"}
                </button>
              </div>
            )}
          </>
        ) : (
          // --- SCROLLING LAYOUT FOR DESKTOP ---
          <div
            ref={scrollContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={handleInteraction}
            onTouchStart={handleInteraction}
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex flex-row gap-6 mt-4">
              {loading ? (
                <div className="flex items-center justify-center h-full w-full py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <span className="ml-4 text-gray-500 text-base">
                    Loading jadwal...
                  </span>
                </div>
              ) : filteredJadwal.length > 0 ? (
                <>
                  {filteredJadwal.map((sesi) => (
                    <JadwalCard key={sesi.id} sesi={sesi} />
                  ))}
                  {filteredJadwal.length >= 4 &&
                    filteredJadwal.map((sesi) => (
                      <JadwalCard key={`${sesi.id}-clone`} sesi={sesi} />
                    ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[10rem] w-full bg-white rounded-lg shadow-lg">
                  <div className="text-gray-500 text-base mt-4 text-center w-full col-span-full">
                    Sayang sekali, kamu masih belum memiliki sesi yang terjadwal.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
        ) : mentorStatus.is_confirmed === true ? (
          <div className="bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base sm:text-lg text-center lg:text-start font-bold">
              Pendaftaran Diterima
            </h2>
            <p className="text-sm sm:text-base text-center lg:text-start">
              Selamat! Anda telah diterima sebagai mentor.
            </p>
          </div>
        ) : mentorStatus.is_confirmed === false && mentorStatus.alasan_ditolak !== null ? (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg text-center lg:text-start">
            <h2 className="text-base sm:text-lg font-bold">
              Pendaftaran Ditolak
            </h2>
            <p className="text-sm sm:text-base">
              Alasan:{" "}
              {mentorStatus.alasan_ditolak || "Tidak ada alasan yang diberikan."}
            </p>
          </div>
        ) : mentorStatus.is_confirmed === false && mentorStatus.alasan_ditolak === null ? (
          <div className="bg-yellow-100 text-yellow-700 p-3 sm:p-4 rounded-lg">
            <h2 className="text-base text-center lg:text-start w-full sm:text-lg font-bold">
              Pendaftaran Menunggu Konfirmasi
            </h2>
            <p className="text-sm sm:text-base text-center lg:text-start w-full">
              Pendaftaran Anda sedang dalam proses konfirmasi.
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
