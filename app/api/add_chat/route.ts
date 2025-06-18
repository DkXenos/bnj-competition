"use client";
import supabase from "@/lib/db";

export async function AddChat(loggedInUser: number, receiver_id: number, text: string) {
  if (!loggedInUser) {
    throw new Error("User not logged in");
  }

  const { data: receiver } = await supabase
    .from("users")
    .select("*")
    .eq("id", receiver_id)
    .single();

  await supabase
    .from("chats")
    .insert({
      sender_id: loggedInUser,
      receiver_id: receiver_id,
      text: text,
      waktu: new Date().toISOString(),
    });

  return { receiver };
}
