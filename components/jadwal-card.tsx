import supabase from '@/lib/db';
import { ISesi } from '@/types/sesi.md';

import { IUser } from '@/types/user.md';

import { useEffect } from 'react';
import { useState } from 'react';

export default function JadwalCard({ loggedInUser }: { loggedInUser: IUser }) {
  const [jamJadwalDengan, setJamJadwalDengan] = useState<ISesi | null>(null);
  const [jadwalDengan, setJadwalDengan] = useState<IUser | null>(null);

  //ini ada beberapa yang aku ganti soale gaisa di build

  useEffect(() => {
    const fetchSesi = async () => {
      if(loggedInUser.isMentor){
            const { data: userData } = await supabase
            .from("sesi")
            .select("*")
            .eq("mentor_id", loggedInUser.id)
            .single();
          
          if (userData) {
            setJamJadwalDengan(userData);
          }
        };

      if(loggedInUser.isMentor == false){
        const { data: userData } = await supabase
          .from("sesi")
          .select("*")
          .eq("mentee_id", loggedInUser.id)
          .single();
        
        if (userData) {
          setJamJadwalDengan(userData);
        }
      }
    }
      
    
    fetchSesi();
  }, [jamJadwalDengan?.id]);

  if(!jamJadwalDengan) {
    return null; 
  }
  if(!jadwalDengan) {
    return null; 
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", jadwalDengan?.id)
        .single();
      
      if (userData) {
        setJadwalDengan(userData);
      }
    };
    
    fetchUser();
  }, [jadwalDengan?.id]);

  const onClick = () => {
    // router.push(`/mentor_detail/${mentor.id}`);
  };
  return (
    <div
      onClick={onClick}
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
          {jadwalDengan?.username}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">{jamJadwalDengan?.jam_mulai}</p>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Rating: {jamJadwalDengan?.jam_selesai}</span>
        </div>
      </div>
    </div>
  );
}
