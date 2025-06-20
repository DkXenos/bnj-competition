"use client";
import { useUser } from "@/context/UserContext";
import { GetChat } from "@/app/api/get_chat/route";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddChat } from "@/app/api/add_chat/route";
import { IChat } from "@/types/chat.md";
import Link from "next/link";

export default function ChatPage() {
  const { loggedInUser } = useUser();
  const [chat, setChat] = useState<IChat[]>([]);
  const searchParams = useSearchParams();
  const chatId = Number(searchParams.get("chat_composite_id"));

  if (isNaN(chatId) || chatId <= 0) {
    console.error("Invalid chat_composite_id in URL:", chatId);
    return <div>Error: Invalid chat ID</div>;
  }

  const otherUser = searchParams.get("other_username");
  const otherUserID = Number(searchParams.get("other_user_id"));
  const [form, setForm] = useState({ textToSend: "" });

  useEffect(() => {
    if (!chatId) return;
    const fetchChat = async () => {
      try {
        const data = await GetChat(chatId);
        if (data && data.chat?.messages) {
          setChat(data.chat.messages);

          for (const message of data.chat.messages) {
            if (message.first_user === loggedInUser?.id) {
              message.first_user = loggedInUser?.id;
            } else {
              message.first_user = otherUser;
            }
          }
        } else {
          setChat([]);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        setChat([]);
      }
    };
    fetchChat();
  }, [chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.textToSend.trim() || !loggedInUser) return;

    try {
      // Add the chat to the database
      await AddChat(chatId, form.textToSend, otherUserID);
      // Clear the input field
      setForm({ textToSend: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-sky-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/all_chats_page"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <span className="font-medium">Back</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
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
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {otherUser}
              </h1>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-sky-50">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {chat && chat.length > 0 ? (
              chat.map((message, idx) => (
                <div
                  key={message.id || idx}
                  className={`flex ${
                    message.receiver_id !== loggedInUser?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.receiver_id !== loggedInUser?.id
                        ? "bg-sky-100 text-gray-800"
                        : "bg-white text-gray-800 border border-sky-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-sky-100 p-6">
          <form
            onSubmit={handleSend}
            className="flex gap-3 max-w-3xl mx-auto"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 bg-sky-50 border border-sky-100 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-transparent transition-all"
                placeholder="Type your message..."
                name="textToSend"
                value={form.textToSend}
                onChange={(e) => setForm({ textToSend: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={!form.textToSend.trim()}
              className="px-6 py-3 bg-sky-100 text-gray-700 rounded-xl hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
