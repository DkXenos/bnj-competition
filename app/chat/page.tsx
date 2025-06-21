"use client";
import { useUser } from "@/context/UserContext";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AddChat, GetChat } from "@/lib/chat";
import { IChat } from "@/types/chat.md";
import Link from "next/link";
import { IUser } from "@/types/user.md";

interface ChatContentProps {
  loggedInUser: IUser | null;
  chat: IChat[];
  setChat: React.Dispatch<React.SetStateAction<IChat[]>>;
  form: { textToSend: string };
  setForm: React.Dispatch<React.SetStateAction<{ textToSend: string }>>;
}

export default function ChatPage() {
  const { loggedInUser } = useUser();
  const [chat, setChat] = useState<IChat[]>([]);
  const [form, setForm] = useState({ textToSend: "" });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent
        loggedInUser={loggedInUser}
        chat={chat}
        setChat={setChat}
        form={form}
        setForm={setForm}
      />
    </Suspense>
  );
}

function ChatContent({
  loggedInUser,
  chat,
  setChat,
  form,
  setForm,
}: ChatContentProps) {
  const searchParams = useSearchParams();
  const chatId = Number(searchParams.get("chat_composite_id"));
  const otherUser = searchParams.get("other_username");
  const otherUserID = Number(searchParams.get("other_user_id"));

  useEffect(() => {
    if (!chatId || !loggedInUser?.id || !otherUser) return;
    const fetchChat = async () => {
      try {
        const data = await GetChat(chatId);
        if (data && data.chat?.messages) {
          setChat(data.chat.messages);
        } else {
          setChat([]);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        setChat([]);
      }
    };
    fetchChat();
  }, [chatId, loggedInUser?.id, otherUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.textToSend.trim() || !loggedInUser) return;

    try {
      await AddChat(chatId, form.textToSend, otherUserID);
      setForm({ textToSend: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isNaN(chatId) || chatId <= 0) {
    console.error("Invalid chat_composite_id in URL:", chatId);
    return <div>Error: Invalid chat ID</div>;
  }

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-sky-100 p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/all_chats_page"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
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
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Link>
          </div>

          {/* Chat with user name */}
          <div className="flex-1 text-center">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
              Chat with {otherUser}
            </h2>
          </div>

          {/* Spacer for balance */}
          <div className="w-16 sm:w-20"></div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto bg-sky-50">
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            {chat && chat.length > 0 ? (
              chat.map((message, idx) => (
                <div
                  key={message.id || idx}
                  className={`flex w-full ${
                    message.receiver_id !== loggedInUser?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[85%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-md
                      px-3 sm:px-4 py-2 sm:py-3 
                      rounded-2xl shadow-sm
                      break-words hyphens-auto
                      ${
                        message.receiver_id !== loggedInUser?.id
                          ? "bg-sky-100 text-gray-800"
                          : "bg-white text-gray-800 border border-sky-100"
                      }
                    `}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap overflow-wrap-anywhere">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
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
                <p className="text-gray-500 text-sm sm:text-base">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-sky-100 p-3 sm:p-6 flex-shrink-0">
          <form
            onSubmit={handleSend}
            className="flex gap-2 sm:gap-3 w-full"
          >
            <div className="flex-1 relative min-w-0">
              <textarea
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-sky-50 border border-sky-100 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-transparent transition-all resize-none min-h-[44px] max-h-32 text-sm sm:text-base"
                placeholder="Type your message..."
                name="textToSend"
                value={form.textToSend}
                onChange={(e) => setForm({ textToSend: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '44px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!form.textToSend.trim()}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-sky-100 text-gray-700 rounded-xl hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 sm:gap-2 flex-shrink-0 text-sm sm:text-base"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
