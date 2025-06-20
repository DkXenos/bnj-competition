import supabase from "@/lib/db";
import { ISesi } from "@/types/sesi.md";
import { IUser } from "@/types/user.md";
import { useEffect } from "react";
import { useState } from "react";

export default function JadwalCard({ loggedInUser, sesi }: { loggedInUser: IUser, sesi:ISesi }) {
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
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
            <svg
              className="w-8 h-8 text-gray-400"
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
      className="min-w-[300px] bg-white rounded-lg shadow-md p-6 justify-between"
    >
      <div className="w-full h-full flex flex-col justify-between">
        <h2 className="text-black text-lg font-bold mb-2">{sesi.mentor_id}</h2>
        <p className="text-gray-600 mb-1">
            {new Date(sesi.jam_mulai).toLocaleString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            })} - {new Date(sesi.jam_selesai).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            })}
        </p>
        <p className="text-gray-500 mb-1">{sesi.link}</p>
        <p className="text-gray-500 mb-1">Mentor: {sesi.mentor_id}</p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            sesi.status === "Terkonfirmasi"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {sesi.status}
        </span>
      </div>
    </div>
  );
}
