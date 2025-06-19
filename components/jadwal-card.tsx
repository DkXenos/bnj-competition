import supabase from '@/lib/db';
import { ISesi } from '@/types/sesi.md';
import { IUser } from '@/types/user.md';
import { useEffect } from 'react';
import { useState } from 'react';

export default function JadwalCard({ loggedInUser }: { loggedInUser: IUser }) {
  const [jamJadwalDengan, setJamJadwalDengan] = useState<ISesi | null>(null);
  const [jadwalDengan, setJadwalDengan] = useState<IUser | null>(null);

  // First useEffect - fetch session data (moved before any returns)
  useEffect(() => {
    const fetchSesi = async () => {
      if (loggedInUser.isMentor) {
        const { data: userData } = await supabase
          .from("sesi")
          .select("*")
          .eq("mentor_id", loggedInUser.id)
          .single();
        
        if (userData) {
          setJamJadwalDengan(userData);
        }
      } else {
        const { data: userData } = await supabase
          .from("sesi")
          .select("*")
          .eq("mentee_id", loggedInUser.id)
          .single();
        
        if (userData) {
          setJamJadwalDengan(userData);
        }
      }
    };
    
    fetchSesi();
  }, [loggedInUser.id, loggedInUser.isMentor]); // Fixed dependencies

  // Second useEffect - fetch user data when session is available (moved before any returns)
  useEffect(() => {
    const fetchUser = async () => {
      if (!jamJadwalDengan) return;
      
      // Determine which user ID to fetch based on logged in user type
      const targetUserId = loggedInUser.isMentor 
        ? jamJadwalDengan.mentee_id 
        : jamJadwalDengan.mentor_id;
      
      if (!targetUserId) return;
      
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", targetUserId)
        .single();
      
      if (userData) {
        setJadwalDengan(userData);
      }
    };
    
    fetchUser();
  }, [jamJadwalDengan, loggedInUser.isMentor]); // Fixed dependencies

  // Early returns AFTER all hooks have been called
  if (!jamJadwalDengan) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!jadwalDengan) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Loading user info...</p>
        </div>
      </div>
    );
  }

  const onClick = () => {
    // router.push(`/mentor_detail/${mentor.id}`);
  };

  return (
    <div
      onClick={onClick}
      className="bg-sky-100 border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200 min-h-[400px]"
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

      {/* Schedule Info */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {loggedInUser.isMentor ? 'Mentee' : 'Mentor'}: {jadwalDengan.username}
        </h3>
        <div className="space-y-1 text-gray-600 text-sm">
          <p>Start: {jamJadwalDengan.jam_mulai}</p>
          <p>End: {jamJadwalDengan.jam_selesai}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Session ID: {jamJadwalDengan.id}</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
