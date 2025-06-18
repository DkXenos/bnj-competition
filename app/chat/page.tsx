'use client'
import { GetChat } from "@/app/api/get_chat/route";
import { AddChat } from "@/app/api/add_chat/route";
import { useEffect, useState } from "react";

export default function ChatPage(other_user_id : number) {
    const [messages, setMessages] = useState<any[]>([]);
    const [form, setForm] = useState({ textToSend: "" });
    const [user, setUser] = useState<any>(null);
    const [otherUser, setOtherUser] = useState<any>(null);

    useEffect(() => {
        async function fetchChat() {
            const { user, other_user, chat } = await GetChat(other_user_id);
            setUser(user);
            setOtherUser(other_user);
            setMessages(chat || []);
        }
        fetchChat();
    }, [other_user_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, textToSend: e.target.value });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.textToSend.trim()) return;
        await AddChat(other_user_id, form.textToSend);
        setForm({ textToSend: "" });
        // Refresh messages
        const { chat } = await GetChat(other_user_id);
        setMessages(chat || []);
    };

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen items-center justify-center">
            <div className="bg-slate-900 flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8">
                <h1 className="text-center text-2xl">Chat</h1>
                <p className="text-center text-gray-400">User: {user?.username}</p>
                <p className="text-center text-gray-400">Mentor: {otherUser?.username}</p>
                <div className="flex-1 overflow-y-auto bg-slate-800 rounded p-4 mb-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                            <span className="font-bold">{msg.sender}:</span> {msg.text}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={form.textToSend}
                        onChange={handleChange}
                        className="flex-1 rounded p-2"
                        placeholder="Type your message..."
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 rounded">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}