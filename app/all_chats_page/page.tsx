'use client';

import { useRouter } from "next/navigation";

export default function AllChatsPage() {
    const router = useRouter();

    const chats = [
        { id: 1, name: "Yen", lastMessage: "Start conversation :D", date: "23 Dec 2024" },
    ];

    return (
        <div className="h-screen bg-gray-100 w-full flex items-center justify-center">
            {/* Sidebar Only */}
            <div className="w-[75%] border-r bg-gray-100 h-full">
            <h1 className="mt-16 text-lg font-bold p-4 border-b text-black">Kotak Pesan</h1>
            <div className="overflow-y-auto">
                {chats.map((chat) => (
                <div
                    key={chat.id}
                    className="p-4 flex items-center gap-4 cursor-pointer shadow-lg border-b-2 hover:bg-blue-50"
                    onClick={() => router.push('/chat')}
                >
                    <img
                    src="/favicon.ico"
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                    <h2 className="font-bold text-black">{chat.name}</h2>
                    <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-500">{chat.date}</span>
                </div>
                ))}
            </div>
            </div>
        </div>
    );
}
