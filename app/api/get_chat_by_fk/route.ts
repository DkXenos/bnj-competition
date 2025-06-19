"use client";
import supabase from "@/lib/db";

export async function GetChatByFK(first_user: number, second_user: number) {
  if (!first_user || !second_user) {
    return null;
  }
  // Fetch the composite key data
  const { data: compositeKeyData, error: compositeKeyError } = await supabase
    .from("chat_composite_key")
    .select("*")
    .eq("first_user", first_user)
    .eq("second_user", second_user)
    .single();

  if( !compositeKeyData) {
    console.warn("No chat found for the given users:", first_user, second_user);
    await supabase 
    .from("chat_composite_key")
    .insert({
          first_user: first_user,
          second_user: second_user,
        })
    .single();

    // Fetch the newly created composite key
    const { data: newCompositeKeyData, error: newCompositeKeyError } = await
    supabase
      .from("chat_composite_key")
      .select("*")
      .eq("first_user", first_user)
      .eq("second_user", second_user)
      .single();
    return newCompositeKeyData.id;
  } else {
    // Fetch the chat data
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("chat_composite_id", compositeKeyData.id)
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
}
