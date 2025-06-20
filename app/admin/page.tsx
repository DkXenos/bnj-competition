"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/db";

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
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [selectedMentorName, setSelectedMentorName] = useState<string>("");

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

  const handleConfirmMentor = async () => {
    if (!selectedMentorId) return;

    try {
      const { error } = await supabase
        .from("mentors")
        .update({ is_confirmed: true })
        .eq("id", selectedMentorId);

      if (error) {
        console.error("Error confirming mentor:", error);
        alert("Failed to confirm mentor.");
        return;
      }

      alert(`Mentor "${selectedMentorName}" confirmed successfully!`);
      setUnconfirmedMentors((prev) =>
        prev.filter((mentor) => mentor.id !== selectedMentorId)
      );
      setShowConfirmPanel(false);
      setSelectedMentorId(null);
      setSelectedMentorName("");
    } catch (error) {
      console.error("Unexpected error confirming mentor:", error);
      alert("An error occurred while confirming the mentor.");
    }
  };

  const handleRejectMentor = async () => {
    if (!selectedMentorId) return;

    try {
      const { error } = await supabase
        .from("mentors")
        .update({ alasan_ditolak: rejectReason })
        .eq("id", selectedMentorId);

      if (error) {
        console.error("Error rejecting mentor:", error);
        alert("Failed to reject mentor.");
        return;
      }

      alert(`Mentor "${selectedMentorName}" rejected successfully! Reason: ${rejectReason}`);
      setUnconfirmedMentors((prev) =>
        prev.filter((mentor) => mentor.id !== selectedMentorId)
      );
      setShowRejectPanel(false);
      setRejectReason("");
      setSelectedMentorId(null);
      setSelectedMentorName("");
    } catch (error) {
      console.error("Unexpected error rejecting mentor:", error);
      alert("An error occurred while rejecting the mentor.");
    }
  };

  const openRejectPanel = (mentorId: number, mentorName: string) => {
    setSelectedMentorId(mentorId);
    setSelectedMentorName(mentorName);
    setShowRejectPanel(true);
  };

  const openConfirmPanel = (mentorId: number, mentorName: string) => {
    setSelectedMentorId(mentorId);
    setSelectedMentorName(mentorName);
    setShowConfirmPanel(true);
  };

  const closeRejectPanel = () => {
    setShowRejectPanel(false);
    setRejectReason("");
    setSelectedMentorId(null);
    setSelectedMentorName("");
  };

  const closeConfirmPanel = () => {
    setShowConfirmPanel(false);
    setSelectedMentorId(null);
    setSelectedMentorName("");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-100 py-8">
      <div className="w-screen h-[10vh]"></div>
      <h1 className="text-2xl font-bold text-black mb-6">Unconfirmed Mentors</h1>
      {loading ? (
        <p className="text-black">Loading unconfirmed mentors...</p>
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
                  Description: {mentor.deskripsi}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Price per session: Rp {mentor.harga_per_sesi.toLocaleString()}
                </p>
                {/* Display KTP and KK Images */}
                <div className="flex gap-4 mt-4">
                  <div className="w-24 h-24 border rounded-lg overflow-hidden">
                    <img
                      src={mentor.foto_ktp}
                      alt="Foto KTP"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-24 h-24 border rounded-lg overflow-hidden">
                    <img
                      src={mentor.foto_kk}
                      alt="Foto KK"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openRejectPanel(mentor.id, mentor.username)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => openConfirmPanel(mentor.id, mentor.username)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black">No unconfirmed mentors found.</p>
      )}

      {/* Confirm Panel */}
      {showConfirmPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Apakah Anda yakin untuk menerima "{selectedMentorName}" menjadi mentor?
            </h1>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeConfirmPanel}
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

      {/* Reject Panel */}
      {showRejectPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Sertakan Alasan Penolakan untuk "{selectedMentorName}"
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
                onClick={closeRejectPanel}
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