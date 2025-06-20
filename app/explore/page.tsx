"use client";
import { useEffect, useState } from "react";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
import { GetAllMentors } from "@/app/api/get_all_mentors/route";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MentorWithUser extends IMentor {
  user: IUser;
}

function MentorCard({ mentor, user }: { mentor: IMentor; user: IUser }) {
  const router = useRouter();

  const handleMentorClick = () => {
    router.push(`/mentor_detail/${mentor.id}`);
  };

  return (
    <div
      onClick={handleMentorClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200 min-h-[400px]"
    >
      {/* Profile Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-400"
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

      {/* Mentor Info */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {user.username}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {mentor.deskripsi}
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{mentor.total_rating}/5</span>
          </div>
          <span className="font-medium text-green-600">
            Rp {mentor.harga_per_sesi.toLocaleString()}/sesi
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [mentors, setMentors] = useState<MentorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMentors, setFilteredMentors] = useState<MentorWithUser[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Get all mentors
        const mentorData = await GetAllMentors();

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
  }, [searchQuery, mentors]);

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
    <div className="min-h-screen bg-sky-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Mentors
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover experienced mentors ready to help you achieve your learning
            goals
          </p>

          {/* Search Bar */}
          <div className="relative">
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
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-sky-100 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchQuery ? (
              <>
                Showing {filteredMentors.length} result
                {filteredMentors.length !== 1 ? "s" : ""} for "{searchQuery}"
              </>
            ) : (
              <>
                Showing all {mentors.length} mentor
                {mentors.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} user={mentor.user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
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
              No mentors found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No mentors match your search "${searchQuery}". Try different keywords.`
                : "No mentors are available at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Back to Top Button */}
        {filteredMentors.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Back to Top
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
