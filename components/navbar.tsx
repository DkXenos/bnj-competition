"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import LogoutButton from "./logout-button";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
import supabase from "@/lib/db";
import LoadingScreen from "./loading-screen";

interface MentorWithUser extends IMentor {
  user: IUser;
}

export default function Navbar() {
  const { loggedInUser } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MentorWithUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownVisible(false);
      closeTimeoutRef.current = null;
    }, 150);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  // Search functionality
  const searchMentors = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      // First, get all mentors
      const { data: mentors, error: mentorsError } = await supabase
        .from("mentors")
        .select("*");

      if (mentorsError) {
        console.error("Error fetching mentors:", mentorsError);
        return;
      }

      if (!mentors || mentors.length === 0) {
        console.log("No mentors found in database");
        setSearchResults([]);
        return;
      }

      // Then fetch user data for each mentor and filter by username
      const mentorsWithUsers = await Promise.all(
        mentors
          .filter((mentor) => mentor.is_confirmed === true)
          .map(async (mentor) => {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", mentor.user_id)
          .single();

        if (userError || !userData) {
          console.error(
            "Error fetching user for mentor:",
            mentor.id,
            userError
          );
          return null;
        }

        return {
          ...mentor,
          user: userData,
        };
          })
      );

      // Filter out null results and search by username
      const validMentors = mentorsWithUsers
        .filter(
          (mentor): mentor is MentorWithUser =>
            mentor !== null &&
            mentor.user?.username?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results

      console.log("Search results:", validMentors); // Debug log
      setSearchResults(validMentors);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchMentors(searchQuery);
    }, 150); // 300ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchInputFocus = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchInputBlur = () => {
    // Delay hiding results to allow clicking on results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleMentorClick = (mentorId: number) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setIsLoading(true);
    // Navigate to mentor detail page
    window.location.href = `/mentor_detail/${mentorId}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-[70%]">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/MP-logo.svg"
              alt="MentorPact Logo"
              width={40}
              height={40}
              className="h-8 w-8 md:h-10 md:w-10 transform transition-transform duration-200 group-hover:scale-102 group-hover:rotate-3"
            />
            <span className="text-xl md:text-3xl font-bold text-gray-900 transition-colors duration-200 group-hover:scale-102">
              MentorPact
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <Link
            href="/explore"
            className="hidden md:block text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 ml-8 px-3 py-2 rounded-lg hover:shadow-sm"
          >
            Telusuri
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <div className="relative w-full">
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
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all duration-200 hover:border-gray-400"
            />
          </div>
          <>{isLoading && <LoadingScreen message="Membuka profil mentor..." />}
          {/* Search Results Popup */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((mentor) => (
                    <div
                      key={mentor.id}
                      onClick={() => handleMentorClick(mentor.id)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 hover:bg-blue-100">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {mentor.user.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {mentor.deskripsi}
                          </p>
                          <p className="text-xs text-blue-500">
                            Rp {mentor.harga_per_sesi.toLocaleString()}/sesi
                          </p>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs text-gray-600 ml-1">
                            {mentor.total_rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-4 text-center">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.291-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-gray-500">No mentors found</p>
                  <p className="text-xs text-gray-400">
                    Try a different search term
                  </p>
                </div>
              ) : null}
            </div>
          )}
          </>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {loggedInUser ? (
            <>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                Beranda
              </Link>
               <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                Tentang
              </Link>
                {!loggedInUser.isMentor && !loggedInUser.isAdmin && (
                <Link
                  href="/register-mentor"
                  className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
                >
                  Jadi Mentor
                </Link>
                )}

                {loggedInUser.isAdmin && (
                  <>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
                >
                  Konfirmasi Mentor
                </Link>
                <Link
                  href="/konfirmasi_laporan"
                  className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
                >
                  Konfirmasi Laporan
                </Link>
                  </>
                )}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-sky-100 transition-all duration-200 group"
                  onClick={toggleDropdown}
                >
                  <Image
                    src={loggedInUser.profile_image || "/def-avatar.png"}
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="rounded-full w-10 h-10 object-cover border border-gray-300 transition-transform duration-200 group-hover:scale-105"
                  />
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-center gap-3 px-4 py-2 mb-2 border-b border-gray-100">
                      <div className="flex flex-col items-center gap-2">
                        <Image
                          src={loggedInUser.profile_image || "/def-avatar.png"}
                          alt="Avatar"
                          width={100}
                          height={100}
                          className="rounded-full w-10 h-10 object-cover border border-gray-300 transition-transform duration-200 group-hover:scale-105"
                        />
                        <h1 className="text-black font-bold text-sm text-center">
                          {loggedInUser.username
                            ?.split(" ")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h1>
                      </div>
                    </div>
                    <Link href="/user_dashboard" className="block">
                      <div className="hover:bg-blue-50 w-full text-black text-md p-2 text-center transition-colors duration-200 hover:text-blue-700">
                        Dashboard
                      </div>
                    </Link>
                    <Link href="/all_chats_page" className="block">
                      <div className="hover:bg-blue-50 w-full text-black text-md p-2 text-center transition-colors duration-200 hover:text-blue-700">
                        Pesan
                      </div>
                    </Link>
                    <LogoutButton />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
            <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                Beranda
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                Tentang
              </Link>
              <Link
                href="/register-mentor"
                className="text-gray-600 hover:text-gray-900 hover:bg-sky-100 transition-all duration-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                Jadi Mentor
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Masuk
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${mobileMenuVisible ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuVisible ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuVisible && (
        <div className="lg:hidden bg-white text-center border-t border-gray-200 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
              onClick={() => setMobileMenuVisible(false)}
            >
              Beranda
            </Link>
            <Link
              href="/explore"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
              onClick={() => setMobileMenuVisible(false)}
            >
              Telusuri
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
              onClick={() => setMobileMenuVisible(false)}
            >
              Tentang
            </Link>
            {!loggedInUser?.isMentor && (
              <Link
              href="/register-mentor"
              className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
              onClick={() => setMobileMenuVisible(false)}
              >
              Jadi Mentor
              </Link>
            )}
            {loggedInUser?.isAdmin && (
                  <>
                <Link
                  href="/admin"
                  className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
                >
                  Konfirmasi Mentor
                </Link>
                <Link
                  href="/konfirmasi_laporan"
                  className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
                >
                  Konfirmasi Laporan
                </Link>
                  </>
                )}

            {loggedInUser ? (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <Image
                      src={loggedInUser.profile_image || "/def-avatar.png"}
                      alt="Avatar"
                      width={100}
                      height={100}
                      className="rounded-full w-10 h-10 object-cover border border-gray-300 transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="text-black font-medium">
                      {loggedInUser.username
                        ?.split(" ")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </div>
                  <Link
                    href="/user_dashboard"
                    className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
                    onClick={() => setMobileMenuVisible(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/all_chats_page"
                    className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-3 rounded-lg"
                    onClick={() => setMobileMenuVisible(false)}
                  >
                    Pesan
                  </Link>
                  <div className="py-2">
                    <LogoutButton />
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
