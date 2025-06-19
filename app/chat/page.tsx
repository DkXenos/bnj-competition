"use client";
import { useUser } from "@/context/UserContext";
import { GetChat } from "@/app/api/get_chat/route";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddChat } from "@/app/api/add_chat/route";
import { IChat } from "@/types/chat.md";
import Link from "next/link";

export default function ChatPage() {
  const {loggedInUser} = useUser();
  const [chat, setChat] = useState<IChat[]>([]);
  const searchParams = useSearchParams();
  const chatId = Number(searchParams.get("chat_composite_id"));
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

          for(const message of data.chat.messages) {
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
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="overflow-hidden flex flex-col w-screen items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-between mt-12 w-[75%] min-h-[50rem] bg-white border-1 shadow-lg rounded-lg">
        <div className="flex items-center gap-2 bg-slate-200 p-4 rounded-t-lg">
          <Link href="/" className="text-xl font-semibold text-black">{" < "}Back</Link>
          <div className="ml-4 w-10 h-10 rounded-full bg-slate-900"></div>
          <h1 className="text-xl font-bold text-black">{otherUser}</h1>
        </div>
        <div className="p-4 h-[40rem] overflow-y-auto">
          {/* Chat messages will go here */}
          <div className="flex flex-col gap-4">
            {chat && chat.map((message, idx) => (
              <div
                key={message.id || idx}
                className={`p-3 rounded-lg max-w-md ${
                  message.receiver_id !== loggedInUser?.id
                    ? "bg-sky-200 self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                <p className="text-gray-800">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
        <form name="" className="flex p-2 items-center bg-gray-100" onSubmit={handleSend}>
            <input
              type="text"
              className="flex-1 text-black focus:outline-none border-gray-300 w-full h-full px-4 py-5"
              placeholder="Type your message..."
              name="textToSend"
              value={form.textToSend}
              onChange={e => setForm({ textToSend: e.target.value })}
            />
            <button
              type="submit"
              className="bg-sky-500 text-white p-2 px-4 rounded-lg hover:bg-sky-600 transition"
            >
              Send
            </button>
          </form>
      </div>
    </div>
  );
}
