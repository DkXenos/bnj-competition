"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/db";
import Link from "next/link";

interface IMentor {
  id: number;
  user_id: number;
  deskripsi: string;
  link_video: string;
  harga_per_sesi: number;
  is_confirmed: boolean;
  alasan_ditolak: string | null;
  foto_ktp: string; // URL for KTP image
  foto_kk: string; // URL for KK image
}

interface MentorWithUser extends IMentor {
  username: string;
}

export default function AdminPage() {
  const [unconfirmedMentors, setUnconfirmedMentors] = useState<MentorWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnconfirmedMentors = async () => {
      try {
        // Fetch mentors with is_confirmed = false
        const { data: mentors, error: mentorError } = await supabase
          .from("mentors")
          .select("*")
          .eq("is_confirmed", false);

        if (mentorError) {
          console.error("Error fetching unconfirmed mentors:", mentorError);
          return;
        }

        // Fetch user data for each mentor
        const mentorsWithUsers = await Promise.all(
          mentors.map(async (mentor) => {
            const { data: user, error: userError } = await supabase
              .from("users")
              .select("username")
              .eq("id", mentor.user_id)
              .single();

            if (userError) {
              console.error(`Error fetching user for mentor ID ${mentor.id}:`, userError);
              return null;
            }

            return { ...mentor, username: user.username };
          })
        );

        // Filter out null results
        const validMentors = mentorsWithUsers.filter(
          (mentor): mentor is MentorWithUser => mentor !== null
        );

        setUnconfirmedMentors(validMentors);
      } catch (error) {
        console.error("Unexpected error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnconfirmedMentors();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 py-8">
      <div className="w-screen h-[10vh]"></div>
      <h1 className="text-2xl font-bold text-black mb-6">Konfirmasi Mentors</h1>
      {loading ? (
        <p className="text-black">Loading calon mentor...</p>
      ) : unconfirmedMentors.length > 0 ? (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unconfirmedMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{mentor.username}</h3>
                <p className="text-gray-600 text-sm mb-2">Mentor ID: {mentor.id}</p>
                <p className="text-gray-600 text-sm mb-2">
                  Deskripsi: {mentor.deskripsi}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Harga per sesi: Rp {mentor.harga_per_sesi.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin_mentor_confirmation?id=${mentor.id}`}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black w-[70%] text-2xl text-center">Sayang sekali belum ada orang baru yang mendaftar sebagai mentor.</p>
      )}
    </div>
  );
}