"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { GetChatByFK } from "@/app/api/get_chat_by_fk/route";

export default function ChatButton({
  receiver_id,
  reciever_name
}: {
  receiver_id: number;
  reciever_name?: string;
}) {
  const router = useRouter();
  const { loggedInUser } = useUser();

  const handleChatClick = async () => {
    if (!loggedInUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const data = await GetChatByFK(loggedInUser.id, receiver_id);
      if (!data) {
        console.error("No chat data found");
        return;
      }
      const chatId = data.id || data.chat_composite_id;
      if (!chatId) {
        console.error("Chat ID not found");
        return;
      }
      // Navigate to the chat page with the chat ID
      router.push(
            `/chat?chat_composite_id=${chatId}&other_username=${encodeURIComponent(
              reciever_name || "Mentor"
            )}&other_user_id=${receiver_id}`
          );
    } catch (error) {
      console.error("Error fetching or creating chat:", error);
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Chat with Mentor
    </button>
  );
}
