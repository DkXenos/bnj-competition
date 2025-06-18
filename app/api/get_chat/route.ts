"use client";
import supabase from "@/lib/db";

export async function GetChat(loggedInUser: number, receiver_id: number) {
  if (!loggedInUser) {
    throw new Error("User not logged in");
  }

  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("receiver_id", receiver_id)
    .eq("sender_id", loggedInUser)
    .order("waktu", { ascending: true });

  const { data: receiver } = await supabase
    .from("users")
    .select("*")
    .eq("id", receiver_id)
    .single();

  return { chat, receiver };
}
