'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetChat } from "@/app/api/get_chat/route";
import { AddChat } from "@/app/api/add_chat/route";
import { IUser } from "@/types/user.md";
import { IChat } from "@/types/chat.md";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const sender_id = parseInt(searchParams.get("sender_id") || "0", 10);
  const receiver_id = parseInt(searchParams.get("receiver_id") || "0", 10);

  const [messages, setMessages] = useState<IChat[]>([]);
  const [form, setForm] = useState({ textToSend: "" });
  const [receiver, setReceiver] = useState<IUser>();

  useEffect(() => {
    async function fetchChat() {
      if (!sender_id || !receiver_id) return;

      try {
        const { chat, receiver } = await GetChat(sender_id, receiver_id);
        setMessages(chat || []);
        setReceiver(receiver);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    }
    fetchChat();
  }, [sender_id, receiver_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, textToSend: e.target.value });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.textToSend.trim() || !sender_id || !receiver_id) return;

    try {
      await AddChat(sender_id, receiver_id, form.textToSend);
      setForm({ textToSend: "" });

      // Refresh messages
      const { chat } = await GetChat(sender_id, receiver_id);
      setMessages(chat || []);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen w-screen items-center justify-center">
      <div className="bg-white flex flex-col min-w-[40%] min-h-[30rem] p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h1 className="text-xl font-bold text-gray-800">Chat</h1>
          <p className="text-sm text-gray-500">Mentor: {receiver?.username}</p>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col mb-2 ${
                msg.sender_id === sender_id ? "items-end" : "items-start"
              }`}
            >
              {/* Nama pengirim */}
              <span className="text-xs text-gray-500 mb-1">
                {msg.sender_id === sender_id ? "Anda" : receiver?.username || "Guest"}
              </span>
              <div
                className={`max-w-[70%] p-2 rounded-lg shadow ${
                  msg.sender_id === sender_id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-300 block text-right mt-1">
                  {msg.waktu
                    ? new Date(msg.waktu).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={form.textToSend}
            onChange={handleChange}
            className="flex-1 rounded p-2 border border-gray-300 text-black"
            placeholder="Mau bicara apa hari ini ?"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}