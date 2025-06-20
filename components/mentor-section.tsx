"use client";
import { useEffect, useState } from "react";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
import { GetAllMentors } from "@/app/api/get_all_mentors/route";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";


function MentorCard({ mentor }: { mentor: IMentor }) {
  const router = useRouter();
  const [mentorUser, setMentorUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchMentorUser = async () => {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", mentor.user_id)
        .single();
      
      if (userData) {
        setMentorUser(userData);
      }
    };
    
    fetchMentorUser();
  }, [mentor.user_id]);

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
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      {/* Mentor Info */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {mentorUser?.username
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {mentor.deskripsi
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Rating: {mentor.total_rating}/5</span>
          <span>Rp {mentor.harga_per_sesi.toLocaleString()}/Sesi</span>
        </div>
      </div>
    </div>
  );
}

export default function MentorSection() {
  const router = useRouter();
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorData = await GetAllMentors();
        
        setMentors(mentorData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-black mb-4">
              Get to know our Mentors!
            </h2>
            <p className="text-xl text-gray-600">
              Learn from our mentor bla bla bla
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Get to know our Mentors!
          </h2>
          <p className="text-xl text-gray-600">
            Learn from our mentor bla bla bla
          </p>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
            />
          ))}
        </div>

        {/* Show All Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => router.push('/explore')}
            className="px-6 bg-white py-3 text-gray-700 shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Tampilkan Semua
          </button>
        </div>
      </div>
    </div>
  );
}