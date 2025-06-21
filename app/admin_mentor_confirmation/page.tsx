"use client"; // Ensure this page is a client component

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

interface IMentor {
  id: number;
  user_id: number;
  deskripsi: string;
  link_video: string;
  harga_per_sesi: number;
  foto_ktp: string;
  foto_kk: string;
  is_confirmed: boolean;
  alasan_ditolak: string | null;
}

interface MentorWithUser extends IMentor {
  username: string;
}

function AdminMentorConfirmationContent() {
  const [mentor, setMentor] = useState<MentorWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const searchParams = useSearchParams();
  const mentorId = searchParams.get("id");

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!mentorId) return;

      try {
        const { data: mentorData, error: mentorError } = await supabase
          .from("mentors")
          .select("*")
          .eq("id", mentorId)
          .single();

        if (mentorError) {
          console.error("Error fetching mentor details:", mentorError);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username")
          .eq("id", mentorData.user_id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        setMentor({ ...mentorData, username: userData.username });
      } catch (error) {
        console.error("Unexpected error fetching mentor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  const handleConfirmMentor = async () => {
    if (!mentor) return;

    try {
      const { error } = await supabase
        .from("mentors")
        .update({ is_confirmed: true })
        .eq("id", mentor.id);

      if (error) {
        console.error("Error confirming mentor:", error);
        alert("Failed to confirm mentor.");
        return;
      }

      const { error: updateUserError } = await supabase
        .from("users")
        .update({ isMentor: true })
        .eq("id", mentor.user_id);

      if (updateUserError) {
        console.error("Error updating user to mentor:", updateUserError);
        alert("Failed to update user to mentor.");
        return;
      }

      alert(`Mentor "${mentor.username}" confirmed successfully!`);
      setShowConfirmPanel(false);
    } catch (error) {
      console.error("Unexpected error confirming mentor:", error);
      alert("An error occurred while confirming the mentor.");
    }
  };

  const handleRejectMentor = async () => {
    if (!mentor) return;

    try {
      const { error } = await supabase
        .from("mentors")
        .update({ alasan_ditolak: rejectReason })
        .eq("id", mentor.id);

      if (error) {
        console.error("Error rejecting mentor:", error);
        alert("Failed to reject mentor.");
        return;
      }
      alert(
        `Mentor "${mentor.username}" rejected successfully! Reason: ${rejectReason}`
      );
      setShowRejectPanel(false);
      setRejectReason("");
    } catch (error) {
      console.error("Unexpected error rejecting mentor:", error);
      alert("An error occurred while rejecting the mentor.");
    }
  };

  if (loading) {
    return <p className="text-black">Loading details mentor...</p>;
  }

  if (!mentor) {
    return <p className="text-black">Mentor tidak dapat ditemukan.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 py-16">
      <div className="w-screen h-[6vh]"></div>
      <h1 className="w-[70%] text-2xl font-bold text-black mb-6 text-center md:text-start">
        Detail Mentor
      </h1>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between w-full max-w-[70%]">
        <div>
          <h3 className="text-xl font-bold text-black mb-2 text-center md:text-start">
            {mentor.username.charAt(0).toUpperCase() + mentor.username.slice(1)}
          </h3>
          <p className="text-gray-600 text-sm mb-2 text-center md:text-start">
            Mentor ID: {mentor.id}
          </p>
          <p className="text-gray-600 text-sm mb-2 text-center md:text-start">
            Deskripsi: {mentor.deskripsi}
          </p>
          <p className="text-gray-600 text-sm mb-2 text-center md:text-start">
            Harga per sesi: Rp {mentor.harga_per_sesi.toLocaleString()}
          </p>
          <div className="mt-6 flex flex-col">
            <div className="flex w-full flex-col md:flex-row gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <p className="w-full text-base font-semibold text-gray-700 mb-2 text-center md:text-start">
                    Foto KTP
                  </p>
                  <div className="md:w-56 md:h-58.5 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Link
                      href={mentor.foto_ktp}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat Foto KTP"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={mentor.foto_ktp}
                        alt="Foto KTP"
                        className="object-contain w-full h-full cursor-pointer"
                      />
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="w-full text-base font-semibold text-gray-700 mb-2 text-center md:text-start">
                    Foto KK
                  </p>
                  <div className="md:w-56 md:h-58.5 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Link
                      href={mentor.foto_kk}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat Foto KK"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={mentor.foto_kk}
                        alt="Foto KK"
                        className="object-contain w-full h-full cursor-pointer"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full h-full">
                <h1 className="w-full text-base font-semibold text-gray-700 mb-2 text-center md:text-start">
                  Video Perkenalan
                </h1>
                <div className="w-full aspect-video min-h-[315px]">
                  {mentor.link_video &&
                  mentor.link_video.includes("youtube.com/watch?v=") ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={mentor.link_video.replace("watch?v=", "embed/")}
                      title="Video Perkenalan Mentor"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg w-full h-full"
                    />
                  ) : mentor.link_video &&
                    mentor.link_video.includes("youtu.be/") ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${
                        mentor.link_video.split("youtu.be/")[1]
                      }`}
                      title="Video Perkenalan Mentor"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-center md:text-start">
                      Tidak ada video
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowRejectPanel(true)}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Tolak
          </button>
          <button
            onClick={() => setShowConfirmPanel(true)}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Terima
          </button>
        </div>
      </div>

      {showConfirmPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Apakah Anda yakin untuk menerima &ldquo;{mentor.username}&rdquo;
              menjadi mentor?
            </h1>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowConfirmPanel(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmMentor}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Terima
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Sertakan Alasan Penolakan untuk &ldquo;
              {mentor.username.charAt(0).toUpperCase() +
                mentor.username.slice(1)}
              &rdquo;
            </h1>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Tuliskan alasan kamu menolak mentor ini..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRejectPanel(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRejectMentor}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMentorConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-sky-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <AdminMentorConfirmationContent />
    </Suspense>
  );
}