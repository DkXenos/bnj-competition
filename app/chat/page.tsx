import { getDetails } from "@/app/api/add_chat/route";

export default async function ChatPage(user_id: number, mentor_user_id: number){
    const { user, mentor } = await getDetails(user_id, mentor_user_id);
    return (
        <div className="flex flex-col bg-white min-h-screen w-screen items-center justify-center">
        <div className="bg-slate-900 flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8">
            <h1 className="text-center text-2xl">Chat</h1>
            <p className="text-center text-gray-400">User: {user.username}</p>
            <p className="text-center text-gray-400">Mentor: {mentor.username}</p>
            <p className="text-center text-gray-400">This is the chat page.</p>
        </div>
        </div>
    );
}