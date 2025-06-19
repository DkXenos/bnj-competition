"use client";
import supabase from "@/lib/db";

export async function GetChat(chat_id: number) {
  if (!chat_id) {
    return null;
  }
  // Fetch the composite key data
  const { data: compositeKeyData, error: compositeKeyError } = await supabase
    .from("chat_composite_key")
    .select("*")
    .eq("id", chat_id)
    .single();

  if (compositeKeyError) {
    console.error("Error fetching chat_composite_key:", compositeKeyError);
    throw compositeKeyError;
  }

  // Fetch the chat data
  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("chat_composite_id", chat_id)
    .order("waktu", { ascending: true });

  if (chatError) {
    console.error("Error fetching chat:", chatError);
    throw chatError;
  }

  // Combine the composite key data into the chat result
  const chat = {
    compositeKey: compositeKeyData,
    messages: chatData,
  };

  return { chat };
}
