"use client";
import { GetAllChats } from "@/lib/chat";
import { getUserDetailsById } from "@/lib/get-user";
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
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-200"></div>
            <span className="text-gray-600 text-lg">Loading pesan...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[70%] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        {/* Header - Made responsive */}
        <div className="bg-white border-b border-sky-100 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            {/* Back button - responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm sm:text-base font-medium">Kembali</span>
              </Link>
            </div>

            {/* Title - Made responsive */}
            <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-1 sm:gap-2 text-center flex-1 mx-2 sm:mx-4">
              <span className="hidden sm:inline">Kotak Pesan</span>
              <span className="sm:hidden">Pesan</span>
            </h1>

            {/* Spacer for balance - responsive */}
            <div className="w-8 sm:w-16 md:w-20"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-sky-50">
          {chats.length > 0 ? (
            loggedInUser ? (
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {chats.map((chat) => (
                  <Link
                    href={`/chat?chat_composite_id=${
                      chat.id
                    }&other_username=${encodeURIComponent(
                      chat.otherUserName
                    )}&other_user_id=${
                      chat.first_user === loggedInUser.id
                        ? chat.second_user
                        : chat.first_user
                    }`}
                    key={chat.id}
                    className="block"
                  >
                    <div className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-md hover:bg-sky-50 transition-all duration-200 border border-sky-100">
                      {/* Avatar - responsive */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
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

                      {/* Chat Info - responsive */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-medium text-xs sm:text-sm truncate">
                          {chat.otherUserName}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 truncate">
                          {chat.latest_text || "Klik untuk melihat pesan"}
                        </p>
                      </div>

                      {/* Time and Arrow - responsive */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {chat.latest_chat_date
                            ? new Date(chat.latest_chat_date).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                              })
                            : ""}
                            
                        </span>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center text-sm sm:text-base">
                  Kamu belum masuk ke dalam akun.
                </p>
                <Link
                  href="/login"
                  className="mt-4 px-3 py-2 sm:px-4 sm:py-2 bg-sky-100 text-gray-700 rounded-lg hover:bg-sky-200 transition-colors text-sm sm:text-base"
                >
                  Masuk ke dalam akun untuk melihat chat
                </Link>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Buka chat untuk melihat pesan
              </h3>
              <p className="text-gray-500 text-center mb-4 text-xs sm:text-sm">
                Kamu belum memiliki chat. Silakan mulai percakapan dengan mentor.
              </p>
              <Link
                href="/explore"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white shadow-lg text-gray-700 rounded-lg hover:bg-sky-200 transition-colors text-sm sm:text-base"
              >
                Find Mentors
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
