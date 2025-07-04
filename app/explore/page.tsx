"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
// import { GetAllMentors } from "@/lib/get-mentor";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "@/components/loading-screen";
//
gsap.registerPlugin(ScrollTrigger);

interface MentorWithUser extends IMentor {
  user: IUser;
}

function MentorCard({ mentor, user }: { mentor: IMentor; user: IUser }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMentorClick = () => {
    setIsLoading(true);
    router.push(`/mentor_detail/${mentor.id}`);
  };

  return (
    <>{isLoading && <LoadingScreen message="Membuka profil mentor..." />}
    <div
      onClick={handleMentorClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200 min-h-[400px] mentor-card"
    >
      {/* Profile Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <Image src={user?.profile_image || '/guest-photo.svg'} className="object-center rounded-lg w-full h-full object-cover" alt={user?.username ? `${user.username} profile` : "Mentor profile"} width={500} height={500} />
      </div>

      {/* Mentor Info */}
      <div className="flex-grow">
        <h3 className="text-xl text-center md:text-start font-bold text-gray-900 mb-2">
          {user.username?.split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>
        <p className="text-gray-600 text-center md:text-start text-sm line-clamp-3 mb-3">
          {mentor.deskripsi}
        </p>
      </div>

      {/* Additional Info - Changed to grid layout */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {/* Star Rating - Top row */}
          <div className="flex items-center justify-center gap-1 text-gray-500">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{mentor.total_rating}/5 Rating</span>
          </div>
          
          {/* Price - Bottom row */}
          <div className="flex items-center justify-center">
            <span className="font-medium text-green-600 text-center">
              Rp {mentor.harga_per_sesi.toLocaleString()}/sesi
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function ExplorePage() {
  const [mentors, setMentors] = useState<MentorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMentors, setFilteredMentors] = useState<MentorWithUser[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 8;
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Get all mentors where is_confirmed = true
        const { data: mentorData, error: mentorError } = await supabase
          .from("mentors")
          .select("*")
          .eq("is_confirmed", true);

        if (mentorError) {
          console.error("Error fetching mentors:", mentorError);
          return;
        }

        // Fetch user data for each mentor
        const mentorsWithUsers = await Promise.all(
          mentorData.map(async (mentor) => {
            const { data: userData } = await supabase
              .from("users")
              .select("*")
              .eq("id", mentor.user_id)
              .single();

            return userData ? { ...mentor, user: userData } : null;
          })
        );

        // Filter out null results
        const validMentors = mentorsWithUsers.filter(
          (mentor): mentor is MentorWithUser => mentor !== null
        );

        setMentors(validMentors);
        setFilteredMentors(validMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // GSAP Animations
  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(".header-anim", {
        opacity: 0,
        y: -30,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });

      // Animate mentor cards
      gsap.from(".mentor-card", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".grid-container",
          start: "top 85%",
        },
      });

      // Animate pagination
      if (document.querySelector(".pagination-anim")) {
        gsap.from(".pagination-anim", {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pagination-anim",
            start: "top 95%",
          },
        });
      }
    }, mainContainerRef);

    return () => ctx.revert(); // Cleanup GSAP animations
  }, [loading, filteredMentors]);

  // Filter mentors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMentors(mentors);
    } else {
      const filtered = mentors.filter(
        (mentor) =>
          mentor.user.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          mentor.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMentors(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, mentors]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const startIndex = (currentPage - 1) * mentorsPerPage;
  const endIndex = startIndex + mentorsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-lg h-96"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainContainerRef} className="min-h-screen bg-sky-100 pt-20">
      <div className="max-w-[70%] mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8 lg-text-left text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 header-anim">
            Telusuri Mentor Kami
          </h1>
          <p className="text-xl text-gray-600 mb-6 header-anim">
            Belajar dengan mentor kami yang berpengalaman dan siap membantu Anda
            mencapai tujuan belajar Anda.
          </p>

          {/* Search Bar */}
          <div className="relative header-anim">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Telusuri mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-sky-100 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {searchQuery ? (
              <>
                <span>{filteredMentors.length} mentor ditemukan untuk &quot;{searchQuery}&quot;</span>
              </>
            ) : (
              <>
                <span>Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredMentors.length)} dari {filteredMentors.length} mentor</span>
              </>
            )}
          </p>
          
          {/* Page indicator */}
          {totalPages > 1 && (
            <p className="text-gray-500 text-sm">
              Halaman {currentPage} dari {totalPages}
            </p>
          )}
        </div>

        {/* Mentors Grid */}
        {currentMentors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 grid-container">
              {currentMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} user={mentor.user} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pagination-anim">
                {/* Previous Button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Sebelumnya
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                  }`}
                >
                  Selanjutnya
                  <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/70 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Tidak Ada Mentor Yang Ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `Mentor tidak dapat ditemukan "${searchQuery}". Cari mentor yang lain.`
                : "Tidak ada mentor yang tersedia saat ini."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        )}

        {/* Back to Top Button - only show when there are multiple pages */}
        {totalPages > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Kembali ke Atas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
