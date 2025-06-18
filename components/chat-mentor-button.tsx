'use client';

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function ChatButton({ receiver_id }: { receiver_id: number }) {
  const router = useRouter();
  const { loggedInUser } = useUser();

  const handleChatClick = () => {
    if (!loggedInUser) {
      console.error("User not logged in");
      return;
    }

    // Navigate to the chat page with sender_id and receiver_id as query parameters
    router.push(`/chat?sender_id=${loggedInUser.id}&receiver_id=${receiver_id}`);
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