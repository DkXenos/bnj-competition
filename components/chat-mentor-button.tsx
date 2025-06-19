"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { GetChatByFK } from "@/app/api/get_chat_by_fk/route";

export default function ChatButton({
  receiver_id,
  reciever_name
}: {
  receiver_id: number;
  reciever_name: string;
}) {
  const router = useRouter();
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleChatClick = async () => {
    if (!loggedInUser) {
      console.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const data = await GetChatByFK(loggedInUser.id, receiver_id);
      if (!data) {
        console.error("No chat data found");
        setLoading(false);
        return;
      }
      router.push(
        `/chat?chat_composite_id=${data}&other_username=${encodeURIComponent(
          reciever_name
        )}&other_user_id=${receiver_id}`
      );
    } catch (error) {
      console.error("Error fetching or creating chat:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      disabled={loading}
    >
      {loading ? "Loading..." : "Chat with Mentor"}
    </button>
  );
}
