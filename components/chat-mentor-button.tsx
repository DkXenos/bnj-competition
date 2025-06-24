"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { GetChatByFK } from "@/lib/chat";

export default function ChatButton({
  receiver_id,
  reciever_name,
}: {
  receiver_id: number;
  reciever_name: string;
}) {
  const router = useRouter();
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleChatClick = async () => {
    if (!loggedInUser) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
      return;
    }

    setLoading(true);
    try {
      const data = await GetChatByFK(loggedInUser.id, receiver_id);

      // Ensure `data` is a valid number (extract `id` if it's an object)
      const chatCompositeId = typeof data === "object" ? data.id : data;

      if (!chatCompositeId || isNaN(chatCompositeId)) {
        console.error("Invalid chat composite ID:", chatCompositeId);
        setLoading(false);
        return;
      }

      router.push(
        `/chat?chat_composite_id=${chatCompositeId}&other_username=${encodeURIComponent(
          reciever_name
        )}&other_user_id=${receiver_id}`
      );
    } catch (error) {
      console.error("Error fetching or creating chat:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleChatClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        disabled={loading}
      >
        <i className="bi bi-chat-left-dots-fill"></i>
        {loading ? <p>Memuat...</p> : <p>Kontak</p>}
      </button>

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center text-black mb-4">
              Login Diperlukan
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Anda harus login terlebih dahulu untuk menghubungi mentor.
            </p>
            <div className="flex w-full justify-center">
              <button
                className="px-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => (window.location.href = "/login")}
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
