"use client";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";

export async function GetChat(other_user_id: number) {
  const { loggedInUser } = useUser();
  if (!loggedInUser) {
    throw new Error("User not logged in");
  }
  if (!other_user_id) {
    throw new Error("Other user ID is required");
  }
  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("other_user_id", other_user_id)
    .eq("user_id", loggedInUser.id)
    .order("waktu", { ascending: true });
  if (!chat) {
    throw new Error("No chat found for the given mentor user ID");
  }
  if (chat.length === 0) {
    return { chat: [] };
  }
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", loggedInUser?.id)
    .single();

  const { data: other_user} = await supabase
    .from("users")
    .select("*")
    .eq("id", other_user_id)
    .single();
  return { user, other_user , chat};
}
