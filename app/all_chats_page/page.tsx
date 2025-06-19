"use client";
import { GetAllChats } from "@/app/api/get_all_chats/route";
import { getUserDetailsById } from "@/app/api/get_user_details/route";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { IChatComposite } from "@/types/chat_composite_id.md";

export default function AllChatsPage() {
  const { loggedInUser } = useUser();
  const [chats, setChats] = useState<IChatComposite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      if (!loggedInUser) return;

      try {
        const fetchedChats = await GetAllChats(loggedInUser.id);

        // Enrich chats with the other user's details
        const enrichedChats = await Promise.all(
          fetchedChats.map(async (chat) => {
            const otherUserId =
              chat.first_user === loggedInUser.id
                ? chat.second_user
                : chat.first_user;

            const otherUserDetails = await getUserDetailsById(otherUserId);

            return {
              ...chat,
              otherUserName: otherUserDetails?.username || "Unknown User",
            };
          })
        );

        setChats(enrichedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [loggedInUser]);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 w-full flex items-center justify-center">
      <div className="w-[75%] border-r bg-gray-100 h-full">
        <h1 className="mt-16 text-lg font-bold p-4 border-b text-black">
          Kotak Pesan
        </h1>
        <div className="overflow-y-auto">
          {chats.length > 0 ? (
            loggedInUser ? (
              chats.map((chat) => (
                  <Link
                  href={`/chat?chat_composite_id=${chat.id}&other_username=${encodeURIComponent(chat.otherUserName)}&other_user_id=${chat.first_user === loggedInUser.id ? chat.second_user : chat.first_user}`}
                  key={chat.id}
                  className="p-4 flex items-center gap-4 cursor-pointer shadow-lg border-b-2 hover:bg-blue-50"
                  >
                  <img
                    src="/favicon.ico"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h1 className="text-black">{chat.otherUserName}</h1>
                    <p className="text-sm text-gray-500">
                    {chat.text || "No messages yet"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.waktu).toLocaleString()}
                  </span>
                  </Link>
              ))
            ) : (
              <p className="text-center text-gray-500">User not logged in.</p>
            )
          ) : (
            <p className="text-center text-gray-500">No chats available.</p>
          )}
        </div>
      </div>
    </div>
  );
}