"use client";
import supabase from "@/lib/db";

export async function AddChat(composite_chat_id: number, text: string, receiver_id: number) {
  if (!composite_chat_id) {
    throw new Error("chat id not valid");
  }

  const { error } = await supabase
    .from("chats")
    .insert({
      chat_composite_id: composite_chat_id,
      text: text,
      receiver_id: receiver_id,
      waktu: new Date().toISOString(),
    });

  if (error) {
    console.error("Error adding chat:", error);
    throw error;
  }
  return { success: true };
}
